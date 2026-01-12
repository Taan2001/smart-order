// libs
import { Request, Response, NextFunction } from "express";

// services
import { postSignInService } from "../services/auth.services";

// utils
import { catchAsync } from "../utils/common";
import logger from "../utils/logger";

/**
 * Sign In Controller
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {NextFunction} nextFunction - Express Next Function
 */
export const postSignInController = catchAsync(async (request: Request, response: Response, nextFunction: NextFunction) => {
    // get payload
    request.payload = {};

    // log request
    logger.request(request.requestId, request.apiName, request.payload);

    const result = await postSignInService(request, nextFunction);

    // log response
    logger.response(request.requestId, request.apiName, result);

    // send response
    response.status(result.statusCode).send(result);
});
