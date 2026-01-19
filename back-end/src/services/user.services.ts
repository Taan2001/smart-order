// libs
import { Request, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

// utils
import { ResponseError, ResponseSuccess } from "../utils/common";
import { isNumberic, isString, isVietnamesePhoneNumber } from "../utils/helper";

//constants
import { ERRORS } from "../constants/error.constants";

//database repositories
import { commitPoolTransaction, createConnectionPoolTransaction, releasePoolTransaction, rollbackPoolTransaction } from "../database/connection-pool";
import { insertUserInformationByEndUser, updateUserInformationByAdminWithUserId } from "../database/repositories/user.repositories";

// interfaces
import {
    IPostUserDetailRequestBody,
    IPostUserDetailRequestPath,
    IPostUserDetailResponse,
    IPostUserRequestBody,
    IPostUserResponse,
} from "../interfaces/user.interfaces";

// types
import { AppResponseError, AppResponseSuccess } from "../types/app.types";

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
        if (type !== undefined && !isNumberic(type)) {
            messages.push(ERRORS.POST_USER_DETAIL_DATA_TYPE_ERROR.ERROR_MESSAGE("type", "data types"));
        }
        if (type !== undefined && isNumberic(type) && type === 1) {
            messages.push(ERRORS.POST_USER_DETAIL_DATA_TYPE_ERROR.ERROR_MESSAGE("type", "input value"));
        }

        // deleteFlg
        if (deleteFlg !== undefined && !isNumberic(deleteFlg)) {
            messages.push(ERRORS.POST_USER_DETAIL_DATA_TYPE_ERROR.ERROR_MESSAGE("deleteFlg", "data types"));
        }
        if (deleteFlg !== undefined && isNumberic(deleteFlg) && deleteFlg !== 1 && deleteFlg !== 0) {
            messages.push(ERRORS.POST_USER_DETAIL_DATA_TYPE_ERROR.ERROR_MESSAGE("type", "input value"));
        }

        if (messages.length > 0) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.POST_USER_DETAIL_DATA_TYPE_ERROR.ERROR_CODE,
                errorMessages: messages,
            });
        }

        // Step 3:  Insert the data into the database
        // ---> Step3-1: Create data before inserting.
        // const userId = uuidv4();
        const timestamp = Date.now();
        const date = dayjs(timestamp).format("YYYY-MM-DD H:mm:ss");

        // ---> Step3-2: Insert the data.
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
