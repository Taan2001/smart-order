// libs
import { Request, Response, NextFunction } from "express";

// database
import { getUserByUserId } from "../database/repositories/auth.repositories";

// utils
import { ResponseError } from "../utils/common";

// constants
import { ERRORS } from "../constants/error.constants";
import { TypeKeys, TYPES } from "../constants/common.constants";

/**
 * Authorization Handler
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {nextFunction} nextFunction - Express Next Function
 */
const authorizationHandlerMiddleware = (alowedRoles: TypeKeys[]) => {
    return async (request: Request, response: Response, nextFunction: NextFunction) => {
        try {
            // Step 1: Get the type information in database
            const users = await getUserByUserId({ userId: request.currentUser.userId });

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

            // Step 2: Check role
            if (!alowedRoles.map((roleName) => TYPES[roleName]).includes(user.type)) {
                throw ResponseError({
                    statusCode: 401,
                    errorCode: ERRORS.UNAVAILABLE_TYPE_ERROR.ERROR_CODE,
                    errorMessages: [ERRORS.UNAVAILABLE_TYPE_ERROR.ERROR_MESSAGE()],
                    errorDetails: [
                        {
                            functionName: "authorizationHandlerMiddleware",
                            params: [user.userId],
                            errorMessage: "The user does not have sufficient rights to access.",
                        },
                    ],
                });
            }

            nextFunction();
        } catch (error) {
            nextFunction(error);
        }
    };
};

export default authorizationHandlerMiddleware;
