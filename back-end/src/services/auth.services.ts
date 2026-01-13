// libs
import { Request, NextFunction } from "express";

// utils
import { ResponseError, ResponseSuccess } from "../utils/common";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

//constants
import { ERRORS } from "../constants/error.constants";

//database repositories
import { getUserByUserId } from "../database/repositories/auth.repositories";

// interfaces
import { IPostTokenRequestBody, IPostTokenResponse } from "../interfaces/auth.interfaces";

// types
import { AppResponseSuccess } from "../types/app.types";

/**
 * postToken Service
 * @param {Request} request - Express Request
 * @param {NextFunction} nextFunction - Express Next Function
 * @returns { Promise<AppResponseSuccess<IPostTokenResponse> | AppResponseError> } - Promise resolving to service result
 */
export const postTokenService = async (request: Request, nextFunction: NextFunction): Promise<AppResponseSuccess<IPostTokenResponse>> => {
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
                errorCode: "E00012",
                errorMessages: ["The user information not found"],
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

        // ---> Step2-2: Create Access Token and Refresh Token
        const accessToken = await generateAccessToken(request, nextFunction, user);
        const refreshToken = await generateRefreshToken(request, nextFunction, user);

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

// /**
//  * Sign In Service
//  * @param {Request} request - Express Request
//  * @param {NextFunction} nextFunction - Express Next Function
//  * @returns { Promise<AppResponseSuccess<IPostSignInResponse> | AppResponseError> } - Promise resolving to service result
//  */
// export const postSignInService = async (request: Request, nextFunction: NextFunction): Promise<AppResponseSuccess<IPostSignInResponse>> => {
//     try {
//         // logic here

//         // return response
//         return ResponseSuccess<IPostSignInResponse>({ statusCode: 200, data: { messages: ["Sign In successfully"] } });
//     } catch (error) {
//         throw error;
//     }
// };
