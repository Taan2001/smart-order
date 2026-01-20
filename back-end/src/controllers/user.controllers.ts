// libs
import { Request, Response, NextFunction } from "express";

// services
import { postUserDetailService, postUserService, getUsersService, getUserDetailService } from "../services/user.services";

// utils
import { catchAsync } from "../utils/common";
import logger from "../utils/logger";

/**
 * getUser Controller
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {NextFunction} nextFunction - Express Next Function
 */
export const getUserDetailController = catchAsync(async (request: Request, response: Response, nextFunction: NextFunction) => {
    // get payload
    request.payload = { ...request.params };

    // log request
    logger.request(request.requestId, request.apiName, request.payload);

    // Implement the get user detail logic here
    const result = await getUserDetailService(request, nextFunction);

    // log response
    logger.response(request.requestId, request.apiName, result);

    // send response
    response.status(result.statusCode).send(result);
});

/**
 * getUser Controller
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {NextFunction} nextFunction - Express Next Function
 */
export const getUsersController = catchAsync(async (request: Request, response: Response, nextFunction: NextFunction) => {
    // get payload
    request.payload = { ...request.query };

    // log request
    logger.request(request.requestId, request.apiName, request.payload);

    // Implement get users token logic here
    const result = await getUsersService(request, nextFunction);

    // log response
    logger.response(request.requestId, request.apiName, result);

    // send response
    response.status(result.statusCode).send(result);
});

/**
 * postUserDetail Controller
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {NextFunction} nextFunction - Express Next Function
 */
export const postUserDetailController = catchAsync(async (request: Request, response: Response, nextFunction: NextFunction) => {
    // get payload
    request.payload = { ...request.params, ...request.body };

    // log request
    logger.request(request.requestId, request.apiName, request.payload);

    // Implement the post user detail logic here
    const result = await postUserDetailService(request, nextFunction);

    // log response
    logger.response(request.requestId, request.apiName, result);

    // send response
    response.status(result.statusCode).send(result);
});

/**
 * postUser Controller
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {NextFunction} nextFunction - Express Next Function
 */
export const postUserController = catchAsync(async (request: Request, response: Response, nextFunction: NextFunction) => {
    // get payload
    request.payload = { ...request.body, password: "" };

    // log request
    logger.request(request.requestId, request.apiName, request.payload);

    // Implement the post user logic here
    const result = await postUserService(request, nextFunction);

    // log response
    logger.response(request.requestId, request.apiName, result);

    // send response
    response.status(result.statusCode).send(result);
});
