// libs
import { Request, Response, NextFunction } from "express";

// services
import { postTokenService, postRefreshTokenService, postSignUpService } from "../services/auth.services";

// utils
import { catchAsync } from "../utils/common";
import logger from "../utils/logger";

export const postSignUpController = catchAsync(async (request: Request, response: Response, nextFunction: NextFunction) => {
    // get payload
    request.payload = { ...request.body, password: "" };

    // log request
    logger.request(request.requestId, request.apiName, request.payload);

    // Implement the refresh token logic here
    const result = await postSignUpService(request, nextFunction);

    // log response
    logger.response(request.requestId, request.apiName, result);

    // send response
    response.status(result.statusCode).send(result);
});

/**
 * postRefreshToken Controller
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {NextFunction} nextFunction - Express Next Function
 */
export const postRefreshTokenController = catchAsync(async (request: Request, response: Response, nextFunction: NextFunction) => {
    // get payload
    request.payload = { ...request.body };

    // log request
    logger.request(request.requestId, request.apiName, request.payload);

    // Implement the refresh token logic here
    const result = await postRefreshTokenService(request, nextFunction);

    // log response
    logger.response(request.requestId, request.apiName, result);

    // send response
    response.status(result.statusCode).send(result);
});

/**
 * postToken Controller
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {NextFunction} nextFunction - Express Next Function
 */
export const postTokenController = catchAsync(async (request: Request, response: Response, nextFunction: NextFunction) => {
    // get payload
    request.payload = { ...request.body };

    // log request
    logger.request(request.requestId, request.apiName, request.payload);

    // Implement the token logic here
    const result = await postTokenService(request, nextFunction);

    // log response
    logger.response(request.requestId, request.apiName, result);

    // send response
    response.status(result.statusCode).send(result);
});

// /**
//  * Sign In Controller
//  * @param {Request} request - Express Request
//  * @param {Response} response - Express Response
//  * @param {NextFunction} nextFunction - Express Next Function
//  */
// export const postSignInController = catchAsync(async (request: Request, response: Response, nextFunction: NextFunction) => {
//     // get payload
//     request.payload = {};

//     // log request
//     logger.request(request.requestId, request.apiName, request.payload);

//     const result = await postSignInService(request, nextFunction);

//     // log response
//     logger.response(request.requestId, request.apiName, result);

//     // send response
//     response.status(result.statusCode).send(result);
// });
