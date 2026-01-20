// libs
import { Request, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

// utils
import { ResponseError, ResponseSuccess } from "../utils/common";
import { isNumeric, isString, isValidNumber, isVietnamesePhoneNumber } from "../utils/helper";

//constants
import { ERRORS } from "../constants/error.constants";

//database repositories
import { commitPoolTransaction, createConnectionPoolTransaction, releasePoolTransaction, rollbackPoolTransaction } from "../database/connection-pool";
import {
    selectCountSelectUsers,
    insertUserInformationByEndUser,
    updateUserInformationByAdminWithUserId,
    selectUsers,
} from "../database/repositories/user.repositories";

// interfaces
import {
    IGetUsersRequestQuery,
    IGetUsersResponse,
    IPostUserDetailRequestBody,
    IPostUserDetailRequestPath,
    IPostUserDetailResponse,
    IPostUserRequestBody,
    IPostUserResponse,
} from "../interfaces/user.interfaces";

// types
import { AppResponseError, AppResponseSuccess } from "../types/app.types";
import { FILTER_FIELD_GET_USERS, FILTER_TYPE_VALUE_GET_USERS, LIMITS, SORT_FIELD_GET_USERS, SORT_TYPE } from "../constants/common.constants";

/**
 * getUsers Service
 * @param {Request} request - Express Request
 * @param {NextFunction} nextFunction - Express Next Function
 * @returns {Promise<AppResponseSuccess<IGetUsersResponse[]> | AppResponseError>} - Promise resolving to service result
 */
export const getUsersService = async (request: Request, nextFunction: NextFunction): Promise<AppResponseSuccess<IGetUsersResponse> | AppResponseError> => {
    try {
        // Step 3: Validate query parameters.
        const { limit, currentPage, sortType, sortField, filterField, filterValue } = request.query as unknown as IGetUsersRequestQuery;
        const messages: string[] = [];

        // ---> Step3-1: Check require parameters.
        if (limit === undefined) {
            messages.push(ERRORS.GET_USERS_REQUIRED_FIELD_ERROR.ERROR_MESSAGE("limit"));
        }

        if (currentPage === undefined) {
            messages.push(ERRORS.GET_USERS_REQUIRED_FIELD_ERROR.ERROR_MESSAGE("currentPage"));
        }

        if (sortType === undefined) {
            messages.push(ERRORS.GET_USERS_REQUIRED_FIELD_ERROR.ERROR_MESSAGE("sortType"));
        }

        if (sortField === undefined) {
            messages.push(ERRORS.GET_USERS_REQUIRED_FIELD_ERROR.ERROR_MESSAGE("sortField"));
        }

        if (filterField === undefined) {
            messages.push(ERRORS.GET_USERS_REQUIRED_FIELD_ERROR.ERROR_MESSAGE("filterField"));
        }

        if (filterValue === undefined) {
            messages.push(ERRORS.GET_USERS_REQUIRED_FIELD_ERROR.ERROR_MESSAGE("filterValue"));
        }

        if (messages.length > 0) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.GET_USERS_REQUIRED_FIELD_ERROR.ERROR_CODE,
                errorMessages: messages,
            });
        }

        // ---> Step3-2: Check data type.
        // limit
        if (!isValidNumber(limit)) {
            messages.push(ERRORS.GET_USERS_DATA_TYPE_ERROR.ERROR_MESSAGE("limit", "data types"));
        }
        if (isValidNumber(limit) && !LIMITS.includes(Number(limit))) {
            messages.push(ERRORS.GET_USERS_DATA_TYPE_ERROR.ERROR_MESSAGE("limit", "input value"));
        }

        // currentPage
        if (!isValidNumber(currentPage)) {
            messages.push(ERRORS.GET_USERS_DATA_TYPE_ERROR.ERROR_MESSAGE("currentPage", "data types"));
        }
        if (isValidNumber(currentPage) && Number(currentPage) <= 0) {
            messages.push(ERRORS.GET_USERS_DATA_TYPE_ERROR.ERROR_MESSAGE("currentPage", "input value"));
        }

        // sortField
        if (!isString(sortField)) {
            messages.push(ERRORS.GET_USERS_DATA_TYPE_ERROR.ERROR_MESSAGE("sortField", "data types"));
        }
        if (isString(sortField) && !SORT_FIELD_GET_USERS.includes(sortField.toUpperCase())) {
            messages.push(ERRORS.GET_USERS_DATA_TYPE_ERROR.ERROR_MESSAGE("sortField", "input value"));
        }

        // sortType
        if (!isString(sortType)) {
            messages.push(ERRORS.GET_USERS_DATA_TYPE_ERROR.ERROR_MESSAGE("sortType", "data types"));
        }
        if (isString(sortType) && !SORT_TYPE.includes(sortType.toUpperCase())) {
            messages.push(ERRORS.GET_USERS_DATA_TYPE_ERROR.ERROR_MESSAGE("sortType", "input value"));
        }

        // filterField
        if (!isString(filterField)) {
            messages.push(ERRORS.GET_USERS_DATA_TYPE_ERROR.ERROR_MESSAGE("filterField", "data types"));
        }
        if (isString(filterField) && !FILTER_FIELD_GET_USERS.includes(filterField.toUpperCase())) {
            messages.push(ERRORS.GET_USERS_DATA_TYPE_ERROR.ERROR_MESSAGE("filterField", "input value"));
        }

        // filterValue
        if (filterField && FILTER_TYPE_VALUE_GET_USERS[filterField as keyof typeof FILTER_TYPE_VALUE_GET_USERS] === "number" && !isValidNumber(filterValue)) {
            messages.push(ERRORS.GET_USERS_DATA_TYPE_ERROR.ERROR_MESSAGE("filterValue", "input value"));
        }
        if (filterField && FILTER_TYPE_VALUE_GET_USERS[filterField as keyof typeof FILTER_TYPE_VALUE_GET_USERS] === "string" && !isString(filterValue)) {
            messages.push(ERRORS.GET_USERS_DATA_TYPE_ERROR.ERROR_MESSAGE("filterValue", "input value"));
        }

        if (messages.length > 0) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.GET_USERS_DATA_TYPE_ERROR.ERROR_CODE,
                errorMessages: messages,
            });
        }

        // Step 4: Retrieving a list of user information
        // ---> Step4-1: Calculate the page info
        // const totalUsers = await selectCountSelectUsers({ filterField: filterField as string, filterValue: handleFilterValue(filterValue) });
        const totalUsers = await selectCountSelectUsers({
            filterField: filterField,
            filterFields: FILTER_FIELD_GET_USERS,
            filterValue: filterValue,
        });

        if (totalUsers === 0) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.EMPTY_LIST_ERROR.ERROR_CODE,
                errorMessages: [ERRORS.EMPTY_LIST_ERROR.ERROR_MESSAGE()],
            });
        }

        const offset = (Number(currentPage) - 1) * Number(limit);

        if (offset >= totalUsers) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.OFFSET_ERROR.ERROR_CODE,
                errorMessages: [ERRORS.OFFSET_ERROR.ERROR_MESSAGE()],
            });
        }

        const totalPages = Math.ceil(Number(totalUsers) / Number(limit));
        const pageInfo = {
            limit: Number(limit),
            currentPage: Number(currentPage),
            totalRecords: totalUsers,
            totalPages,
        };

        // ---> Step4-2: Get the user information in database
        const users = await selectUsers({
            limit: Number(limit),
            offset,
            sortField,
            sortFields: SORT_FIELD_GET_USERS,
            sortType,
            sortTypes: SORT_TYPE,
            filterField,
            filterFields: FILTER_FIELD_GET_USERS,
            filterValue,
        });

        if (users.length === 0) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.EMPTY_LIST_ERROR.ERROR_CODE,
                errorMessages: [ERRORS.EMPTY_LIST_ERROR.ERROR_MESSAGE()],
            });
        }

        // return response
        return ResponseSuccess<IGetUsersResponse>({
            statusCode: 200,
            data: {
                users,
                pageInfo,
            },
        });
    } catch (error) {
        throw error;
    }
};

/**
 * postUserDetail Service
 * @param {Request} request - Express Request
 * @param {NextFunction} nextFunction - Express Next Function
 * @returns {Promise<AppResponseSuccess<IPostUserDetailResponse> | AppResponseError>} - Promise resolving to service result
 */
export const postUserDetailService = async (
    request: Request,
    nextFunction: NextFunction
): Promise<AppResponseSuccess<IPostUserDetailResponse> | AppResponseError> => {
    try {
        // Step 3: Validate body parameters.
        const { userId } = request.params as unknown as IPostUserDetailRequestPath;
        const { fullname, address, phone, type, deleteFlg } = request.body as IPostUserDetailRequestBody;
        const messages: string[] = [];

        // ---> Step3-1: Check require parameters.
        if (userId === undefined) {
            messages.push(ERRORS.POST_USER_DETAIL_REQUIRED_FIELD_ERROR.ERROR_MESSAGE("userId"));
        }

        if (messages.length > 0) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.POST_USER_DETAIL_REQUIRED_FIELD_ERROR.ERROR_CODE,
                errorMessages: messages,
            });
        }

        if (fullname === undefined && address === undefined && phone === undefined && type === undefined && deleteFlg === undefined) {
            return ResponseSuccess<IPostUserResponse>({
                statusCode: 200,
                data: {
                    messages: ["User information updated successful!!!"],
                },
            });
        }
        // ---> Step3-2: Check data type.
        // fullname
        if (fullname !== undefined && !isString(fullname)) {
            messages.push(ERRORS.POST_USER_DETAIL_DATA_TYPE_ERROR.ERROR_MESSAGE("fullname", "data types"));
        }
        if (fullname !== undefined && isString(fullname) && !fullname.trim()) {
            messages.push(ERRORS.POST_USER_DETAIL_DATA_TYPE_ERROR.ERROR_MESSAGE("fullname", "input value"));
        }
        if (fullname !== undefined && isString(fullname) && fullname.trim().length < 6) {
            messages.push(ERRORS.POST_USER_DETAIL_DATA_TYPE_ERROR.ERROR_MESSAGE("fullname", "minimum length"));
        }
        if (fullname !== undefined && isString(fullname) && fullname.trim().length > 36) {
            messages.push(ERRORS.POST_USER_DETAIL_DATA_TYPE_ERROR.ERROR_MESSAGE("fullname", "maximum length"));
        }

        // address
        if (address !== undefined && !isString(address)) {
            messages.push(ERRORS.POST_USER_DETAIL_DATA_TYPE_ERROR.ERROR_MESSAGE("address", "data types"));
        }
        if (address !== undefined && isString(address) && !address.trim()) {
            messages.push(ERRORS.POST_USER_DETAIL_DATA_TYPE_ERROR.ERROR_MESSAGE("address", "input value"));
        }
        if (address !== undefined && isString(fullname) && fullname.trim().length > 128) {
            messages.push(ERRORS.POST_USER_DETAIL_DATA_TYPE_ERROR.ERROR_MESSAGE("fullname", "maximum length"));
        }

        // phone
        if (phone !== undefined && !isVietnamesePhoneNumber(phone)) {
            messages.push(ERRORS.POST_USER_DETAIL_DATA_TYPE_ERROR.ERROR_MESSAGE("phone", "phone number"));
        }

        // type
        if (type !== undefined && !isNumeric(type)) {
            messages.push(ERRORS.POST_USER_DETAIL_DATA_TYPE_ERROR.ERROR_MESSAGE("type", "data types"));
        }
        if (type !== undefined && isNumeric(type) && type === 1) {
            messages.push(ERRORS.POST_USER_DETAIL_DATA_TYPE_ERROR.ERROR_MESSAGE("type", "input value"));
        }

        // deleteFlg
        if (deleteFlg !== undefined && !isNumeric(deleteFlg)) {
            messages.push(ERRORS.POST_USER_DETAIL_DATA_TYPE_ERROR.ERROR_MESSAGE("deleteFlg", "data types"));
        }
        if (deleteFlg !== undefined && isNumeric(deleteFlg) && deleteFlg !== 1 && deleteFlg !== 0) {
            messages.push(ERRORS.POST_USER_DETAIL_DATA_TYPE_ERROR.ERROR_MESSAGE("type", "input value"));
        }

        if (messages.length > 0) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.POST_USER_DETAIL_DATA_TYPE_ERROR.ERROR_CODE,
                errorMessages: messages,
            });
        }

        // Step 4:  Insert the data into the database
        // ---> Step4-1: Create data before inserting.
        // const userId = uuidv4();
        const timestamp = Date.now();
        const date = dayjs(timestamp).format("YYYY-MM-DD H:mm:ss");

        // ---> Step4-2: Insert the data.
        const transaction = await createConnectionPoolTransaction();
        try {
            const updatedInformation = await updateUserInformationByAdminWithUserId(transaction, {
                userId,
                fullname,
                phone,
                address,
                type,
                deleteFlg,
                updatedBy: request.currentUser.userId,
                updatedAt: timestamp,
                updatedDate: date,
            });

            console.log(updatedInformation);

            // commit transaction
            await commitPoolTransaction(transaction);

            // release transaction
            await releasePoolTransaction(transaction);

            // return response
            return ResponseSuccess<IPostUserResponse>({
                statusCode: 200,
                data: {
                    messages: ["User information updated successful."],
                },
            });
        } catch (error) {
            // rollback transaction
            await rollbackPoolTransaction(transaction);

            // release transaction
            await releasePoolTransaction(transaction);

            // throw Error
            throw error;
        }
    } catch (error) {
        throw error;
    }
};

/**
 * postUser Service
 * @param {Request} request - Express Request
 * @param {NextFunction} nextFunction - Express Next Function
 * @returns {Promise<AppResponseSuccess<IPostUserResponse> | AppResponseError>} - Promise resolving to service result
 */
export const postUserService = async (request: Request, nextFunction: NextFunction): Promise<AppResponseSuccess<IPostUserResponse> | AppResponseError> => {
    try {
        // Step 2: Validate body parameters.
        const { fullname, address, phone } = request.body as IPostUserRequestBody;
        const messages: string[] = [];

        // ---> Step2-1: Check require parameters.
        if (fullname === undefined) {
            messages.push(ERRORS.POST_USER_REQUIRED_FIELD_ERROR.ERROR_MESSAGE("fullname"));
        }
        if (address === undefined) {
            messages.push(ERRORS.POST_USER_REQUIRED_FIELD_ERROR.ERROR_MESSAGE("address"));
        }

        if (messages.length > 0) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.POST_USER_REQUIRED_FIELD_ERROR.ERROR_CODE,
                errorMessages: messages,
            });
        }

        // ---> Step2-2: Check data type.
        // fullname
        if (!isString(fullname)) {
            messages.push(ERRORS.POST_USER_DATA_TYPE_ERROR.ERROR_MESSAGE("fullname", "data types"));
        }
        if (isString(fullname) && !fullname.trim()) {
            messages.push(ERRORS.POST_USER_DATA_TYPE_ERROR.ERROR_MESSAGE("fullname", "input value"));
        }
        if (isString(fullname) && fullname.trim().length < 6) {
            messages.push(ERRORS.POST_USER_DATA_TYPE_ERROR.ERROR_MESSAGE("fullname", "minimum length"));
        }
        if (isString(fullname) && fullname.trim().length > 36) {
            messages.push(ERRORS.POST_USER_DATA_TYPE_ERROR.ERROR_MESSAGE("fullname", "maximum length"));
        }

        // address
        if (!isString(address)) {
            messages.push(ERRORS.POST_USER_DATA_TYPE_ERROR.ERROR_MESSAGE("address", "data types"));
        }
        if (isString(address) && !address.trim()) {
            messages.push(ERRORS.POST_USER_DATA_TYPE_ERROR.ERROR_MESSAGE("address", "input value"));
        }
        if (isString(address) && address.trim().length > 128) {
            messages.push(ERRORS.POST_USER_DATA_TYPE_ERROR.ERROR_MESSAGE("address", "maximum length"));
        }

        // phone
        if (phone && !isVietnamesePhoneNumber(phone)) {
            messages.push(ERRORS.POST_USER_DATA_TYPE_ERROR.ERROR_MESSAGE("phone", "phone number"));
        }

        if (messages.length > 0) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.POST_USER_DATA_TYPE_ERROR.ERROR_CODE,
                errorMessages: messages,
            });
        }

        // Step 3:  Insert the data into the database
        // ---> Step3-1: Create data before inserting.
        const userId = uuidv4();
        const timestamp = Date.now();
        const date = dayjs(timestamp).format("YYYY-MM-DD H:mm:ss");

        // ---> Step3-2: Insert the data.
        const transaction = await createConnectionPoolTransaction();
        try {
            const insertedInformation = await insertUserInformationByEndUser(transaction, {
                userId,
                fullname,
                username: userId,
                password: "",
                phone: phone || "",
                address,
                type: 0,
                createdBy: "end-user",
                createdAt: timestamp,
                createdDate: date,
                updatedBy: "end-user",
                updatedAt: timestamp,
                updatedDate: date,
            });

            // commit transaction
            await commitPoolTransaction(transaction);

            // release transaction
            await releasePoolTransaction(transaction);

            // return response
            return ResponseSuccess<IPostUserResponse>({
                statusCode: 200,
                data: {
                    messages: ["User information registration successful."],
                },
            });
        } catch (error) {
            // rollback transaction
            await rollbackPoolTransaction(transaction);

            // release transaction
            await releasePoolTransaction(transaction);

            // throw Error
            throw error;
        }
    } catch (error) {
        throw error;
    }
};
