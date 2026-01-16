// libs
import { Request, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

// utils
import { ResponseError, ResponseSuccess } from "../utils/common";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { isNumberic, isString, isVietnamesePhoneNumber } from "../utils/helper";

//constants
import { ERRORS } from "../constants/error.constants";

//database repositories
import { commitPoolTransaction, createConnectionPoolTransaction, releasePoolTransaction, rollbackPoolTransaction } from "../database/connection-pool";
import { getUserByUserId, getUserInformationByUsernameAndPassword, insertUserInformationByAdmin } from "../database/repositories/auth.repositories";

// interfaces
import {
    IPostRefreshTokenRequestBody,
    IPostRefreshTokenResponse,
    IPostSignInRequestBody,
    IPostSignInResponse,
    IPostSignUpRequestBody,
    IPostSignUpResponse,
    IPostTokenRequestBody,
    IPostTokenResponse,
} from "../interfaces/auth.interfaces";

// types
import { AppResponseError, AppResponseSuccess } from "../types/app.types";

/**
 * postSignUp Service
 * @param {Request} request - Express Request
 * @param {NextFunction} nextFunction - Express Next Function
 * @returns {Promise<AppResponseSuccess<IPostSignInResponse> | AppResponseError>} - Promise resolving to service result
 */
export const postSignInService = async (request: Request, nextFunction: NextFunction): Promise<AppResponseSuccess<IPostSignInResponse> | AppResponseError> => {
    try {
        // Step 1: Validate body parameters.
        const { username, password } = request.body as IPostSignInRequestBody;
        const messages: string[] = [];

        // ---> Step1-1: Check require parameters.
        if (username === undefined) {
            messages.push(ERRORS.POST_SIGN_UP_REQUIRED_FIELD_ERROR.ERROR_MESSAGE("username"));
        }
        if (password === undefined) {
            messages.push(ERRORS.POST_SIGN_UP_REQUIRED_FIELD_ERROR.ERROR_MESSAGE("password"));
        }

        if (messages.length > 0) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.POST_SIGN_UP_REQUIRED_FIELD_ERROR.ERROR_CODE,
                errorMessages: messages,
            });
        }

        // ---> Step1-2: Check data type.
        // username
        if (!isString(username)) {
            messages.push(ERRORS.POST_SIGN_IN_DATA_TYPE_ERROR.ERROR_MESSAGE("username", "data types"));
        }
        if (isString(username) && !username.trim()) {
            messages.push(ERRORS.POST_SIGN_IN_DATA_TYPE_ERROR.ERROR_MESSAGE("username", "input value"));
        }
        // password
        if (!isString(password)) {
            messages.push(ERRORS.POST_SIGN_IN_DATA_TYPE_ERROR.ERROR_MESSAGE("password", "data types"));
        }
        if (isString(password) && !password.trim()) {
            messages.push(ERRORS.POST_SIGN_IN_DATA_TYPE_ERROR.ERROR_MESSAGE("password", "input value"));
        }

        if (messages.length > 0) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.POST_SIGN_IN_DATA_TYPE_ERROR.ERROR_CODE,
                errorMessages: messages,
            });
        }

        // Step 2:  Get userInformation
        const users = await getUserInformationByUsernameAndPassword({ username, password });

        if (users.length !== 1) {
            throw ResponseError({
                statusCode: 404,
                errorCode: ERRORS.POST_SIGN_IN_USER_INFORMATION_NOT_FOUND_ERROR.ERROR_CODE,
                errorMessages: [ERRORS.POST_SIGN_IN_USER_INFORMATION_NOT_FOUND_ERROR.ERROR_MESSAGE()],
            });
        }

        const user = users[0];

        // Step3: Create Access Token and Refresh Token
        const accessToken = await generateAccessToken(request, user);
        const refreshToken = await generateRefreshToken(request, user);

        return ResponseSuccess<IPostSignInResponse>({
            statusCode: 200,
            data: {
                user: {
                    userId: user.userId,
                },
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        throw error;
    }
};

/**
 * postSignUp Service
 * @param {Request} request - Express Request
 * @param {NextFunction} nextFunction - Express Next Function
 * @returns {Promise<AppResponseSuccess<IPostSignUpResponse> | AppResponseError>} - Promise resolving to service result
 */
export const postSignUpService = async (request: Request, nextFunction: NextFunction): Promise<AppResponseSuccess<IPostSignUpResponse> | AppResponseError> => {
    try {
        // Step 3: Validate body parameters.
        const { username, password, fullname, phone, address, type } = request.body as IPostSignUpRequestBody;
        const messages: string[] = [];

        // ---> Step3-1: Check require parameters.
        if (username === undefined) {
            messages.push(ERRORS.POST_SIGN_UP_REQUIRED_FIELD_ERROR.ERROR_MESSAGE("username"));
        }
        if (password === undefined) {
            messages.push(ERRORS.POST_SIGN_UP_REQUIRED_FIELD_ERROR.ERROR_MESSAGE("password"));
        }
        if (fullname === undefined) {
            messages.push(ERRORS.POST_SIGN_UP_REQUIRED_FIELD_ERROR.ERROR_MESSAGE("fullname"));
        }
        if (phone === undefined) {
            messages.push(ERRORS.POST_SIGN_UP_REQUIRED_FIELD_ERROR.ERROR_MESSAGE("phone"));
        }
        if (address === undefined) {
            messages.push(ERRORS.POST_SIGN_UP_REQUIRED_FIELD_ERROR.ERROR_MESSAGE("address"));
        }
        if (type === undefined) {
            messages.push(ERRORS.POST_SIGN_UP_REQUIRED_FIELD_ERROR.ERROR_MESSAGE("type"));
        }

        if (messages.length > 0) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.POST_SIGN_UP_REQUIRED_FIELD_ERROR.ERROR_CODE,
                errorMessages: messages,
            });
        }

        // ---> Step3-2: Check data type.
        // username
        if (!isString(username)) {
            messages.push(ERRORS.POST_SIGN_UP_DATA_TYPE_ERROR.ERROR_MESSAGE("username", "data types"));
        }
        if (isString(username) && username.includes(" ")) {
            messages.push(ERRORS.POST_SIGN_UP_DATA_TYPE_ERROR.ERROR_MESSAGE("username", "space in string"));
        }
        if (isString(username) && username.trim().length > 24) {
            messages.push(ERRORS.POST_SIGN_UP_DATA_TYPE_ERROR.ERROR_MESSAGE("username", "maximum length"));
        }
        if (isString(username) && username.trim().length < 6) {
            messages.push(ERRORS.POST_SIGN_UP_DATA_TYPE_ERROR.ERROR_MESSAGE("username", "minimum length"));
        }

        // password
        if (!isString(password)) {
            messages.push(ERRORS.POST_SIGN_UP_DATA_TYPE_ERROR.ERROR_MESSAGE("password", "data types"));
        }
        if (isString(password) && password.includes(" ")) {
            messages.push(ERRORS.POST_SIGN_UP_DATA_TYPE_ERROR.ERROR_MESSAGE("password", "space in string"));
        }
        if (isString(password) && password.trim().length > 16) {
            messages.push(ERRORS.POST_SIGN_UP_DATA_TYPE_ERROR.ERROR_MESSAGE("password", "maximum length"));
        }
        if (isString(password) && password.trim().length < 8) {
            messages.push(ERRORS.POST_SIGN_UP_DATA_TYPE_ERROR.ERROR_MESSAGE("password", "minimum length"));
        }

        // phone
        if (!isVietnamesePhoneNumber(phone)) {
            messages.push(ERRORS.POST_SIGN_UP_DATA_TYPE_ERROR.ERROR_MESSAGE("phone", "phone number"));
        }

        // address
        if (!isString(address)) {
            messages.push(ERRORS.POST_SIGN_UP_DATA_TYPE_ERROR.ERROR_MESSAGE("address", "data types"));
        }
        if (isString(address) && address.trim().length > 128) {
            messages.push(ERRORS.POST_SIGN_UP_DATA_TYPE_ERROR.ERROR_MESSAGE("address", "maximum length"));
        }

        // type
        if (!isNumberic(type) || Number.isNaN(type)) {
            messages.push(ERRORS.POST_SIGN_UP_DATA_TYPE_ERROR.ERROR_MESSAGE("type", "data types"));
        }
        if (type === 1) {
            messages.push(ERRORS.POST_SIGN_UP_DATA_TYPE_ERROR.ERROR_MESSAGE("type", "input value"));
        }

        if (messages.length > 0) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.POST_SIGN_UP_DATA_TYPE_ERROR.ERROR_CODE,
                errorMessages: messages,
            });
        }

        // Step 4:  Insert the data into the database
        // ---> Step4-1: Create data before inserting.
        const userId = uuidv4();
        const timestamp = Date.now();
        const date = dayjs(timestamp).format("YYYY-MM-DD H:mm:ss");

        // ---> Step4-2: Insert the data.
        const transaction = await createConnectionPoolTransaction();
        try {
            const insertInformation = await insertUserInformationByAdmin(transaction, {
                userId,
                fullname,
                username,
                password,
                phone,
                address,
                type,
                createdBy: request.currentUser.userId,
                createdAt: timestamp,
                createdDate: date,
                updatedBy: request.currentUser.userId,
                updatedAt: timestamp,
                updatedDate: date,
            });

            // commit transaction
            await commitPoolTransaction(transaction);

            // release transaction
            await releasePoolTransaction(transaction);

            // return response
            return ResponseSuccess<IPostSignUpResponse>({
                statusCode: 201,
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

/**
 * postRefreshToken Service
 * @param {Request} request - Express Request
 * @param {NextFunction} nextFunction - Express Next Function
 * @returns {Promise<AppResponseSuccess<IPostRefreshTokenResponse> | AppResponseError>} - Promise resolving to service result
 */
export const postRefreshTokenService = async (
    request: Request,
    nextFunction: NextFunction
): Promise<AppResponseSuccess<IPostRefreshTokenResponse> | AppResponseError> => {
    try {
        // Step 1: Validate body parameters.
        const { refreshToken } = request.payload as IPostRefreshTokenRequestBody;
        if (refreshToken === undefined) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.POST_REFRESH_TOKEN_REQUIRED_FIELD_ERROR.ERROR_CODE,
                errorMessages: [ERRORS.POST_REFRESH_TOKEN_REQUIRED_FIELD_ERROR.ERROR_MESSAGE("refreshToken")],
                errorParams: ["refreshToken"],
            });
        }

        // Step 2: Verify and decode the refreshToken.
        const currentUser = await verifyRefreshToken(request, refreshToken);
        const userId = currentUser.userId;

        // Step 3:  Generate new Access Token
        // ---> Step3-1: Get userInformation
        const users = await getUserByUserId({ userId });

        if (users.length !== 1) {
            throw ResponseError({
                statusCode: 404,
                errorCode: ERRORS.POST_TOKEN_USER_INFORMATION_NOT_FOUND_ERROR.ERROR_CODE,
                errorMessages: [ERRORS.POST_TOKEN_USER_INFORMATION_NOT_FOUND_ERROR.ERROR_MESSAGE()],
            });
        }

        if (users.length === 1 && users[0].deleteFlg === 1) {
            throw ResponseError({
                statusCode: 401,
                errorCode: "E00013",
                errorMessages: ["The current user account is unavailable."],
            });
        }

        const user = users[0];

        // ---> Step3-2: Create new Access Token
        const accessToken = await generateAccessToken(request, user);

        return ResponseSuccess<IPostRefreshTokenResponse>({
            statusCode: 200,
            data: {
                user: { userId },
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        throw error;
    }
};

/**
 * postToken Service
 * @param {Request} request - Express Request
 * @param {NextFunction} nextFunction - Express Next Function
 * @returns { Promise<AppResponseSuccess<IPostTokenResponse> | AppResponseError> } - Promise resolving to service result
 */
export const postTokenService = async (request: Request, nextFunction: NextFunction): Promise<AppResponseSuccess<IPostTokenResponse> | AppResponseError> => {
    try {
        // Business logic
        // Step 1: Validate body parameters.
        const { userId } = request.payload as IPostTokenRequestBody;

        // ---> Step1-1: Check require parameters.
        if (userId === undefined) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.POST_TOKEN_REQUIRED_FIELD_ERROR.ERROR_CODE,
                errorMessages: [ERRORS.POST_TOKEN_REQUIRED_FIELD_ERROR.ERROR_MESSAGE("userId")],
                errorParams: ["userId"],
            });
        }
        // ---> Step1-2: Check data type.
        // not implemented yet

        // Step 2:  Generate Access Token and Refresh Token
        // ---> Step2-1: Get userInformation
        const users = await getUserByUserId({ userId });

        if (users.length !== 1) {
            throw ResponseError({
                statusCode: 404,
                errorCode: ERRORS.POST_TOKEN_USER_INFORMATION_NOT_FOUND_ERROR.ERROR_CODE,
                errorMessages: [ERRORS.POST_TOKEN_USER_INFORMATION_NOT_FOUND_ERROR.ERROR_MESSAGE()],
            });
        }

        if (users.length === 1 && users[0].deleteFlg === 1) {
            throw ResponseError({
                statusCode: 401,
                errorCode: ERRORS.POST_TOKEN_USER_INFORMATION_NOT_FOUND_ERROR.ERROR_CODE,
                errorMessages: [ERRORS.POST_TOKEN_USER_INFORMATION_NOT_FOUND_ERROR.ERROR_MESSAGE()],
            });
        }

        const user = users[0];

        // ---> Step2-2: Create Access Token and Refresh Token
        const accessToken = await generateAccessToken(request, user);
        const refreshToken = await generateRefreshToken(request, user);

        return ResponseSuccess<IPostTokenResponse>({
            statusCode: 200,
            data: {
                user: {
                    userId: user.userId,
                },
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
        });
    } catch (error) {
        throw error;
    }
};
