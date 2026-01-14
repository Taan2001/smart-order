// libs
import { Request, Response, NextFunction } from "express";
import { ResponseError } from "../utils/common";
import { verifyAccessToken } from "../utils/jwt";
import { ERRORS } from "../constants/error.constants";
import { getUserByUserId } from "../database/repositories/auth.repositories";

/**
 * Authentication Handler
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {nextFunction} nextFunction - Express Next Function
 */
const authenticationHandlerMiddleware = async (request: Request, response: Response, nextFunction: NextFunction) => {
    try {
        // Step 1: Get accessToken in Authorization header.
        const authorization = request.headers["authorization"];
        if (authorization === undefined) {
            throw ResponseError({
                statusCode: 401,
                errorCode: ERRORS.MISSING_AUTHORIZATION_HEADER_ERROR.ERROR_CODE,
                errorMessages: [ERRORS.MISSING_AUTHORIZATION_HEADER_ERROR.ERROR_MESSAGE()],
                errorParams: ["Authorization"],
                errorDetails: [
                    {
                        functionName: "authenticationHandlerMiddleware",
                        params: ["Authorization"],
                        errorMessage: "Bearer token is not passed in request header.",
                    },
                ],
            });
        }

        const accessToken = authorization.split(" ")[1];

        // Step 2: Verify and decode the accessToken.
        const currentUser = await verifyAccessToken(request, accessToken);

        // Step 3: Get the userInformation.
        const users = await getUserByUserId({ userId: currentUser.userId });

        if (users.length !== 1) {
            throw ResponseError({
                statusCode: 401,
                errorCode: ERRORS.UNABLE_AUTHENTICATION_USER_ERROR.ERROR_CODE,
                errorMessages: [ERRORS.UNABLE_AUTHENTICATION_USER_ERROR.ERROR_MESSAGE()],
            });
        }

        if (users.length === 1 && users[0].deleteFlg !== 0) {
            throw ResponseError({
                statusCode: 401,
                errorCode: ERRORS.UNAVAILABLE_AUTHENTICATION_USER_ERROR.ERROR_CODE,
                errorMessages: [ERRORS.UNAVAILABLE_AUTHENTICATION_USER_ERROR.ERROR_MESSAGE()],
            });
        }

        const user = users[0];

        request.currentUser = { ...user };

        nextFunction();
    } catch (error) {
        nextFunction(error);
    }
};

export default authenticationHandlerMiddleware;
