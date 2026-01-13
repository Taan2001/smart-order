// libs
import { Request, Response, NextFunction } from "express";

// utils
import logger from "../utils/logger";

// interfaces
import { IAppResponseError, IExceptionResponseError } from "../interfaces/app.interfaces";

// types
import { AppResponseError } from "../types/app.types";

/**
 * Error Handler Function
 * @param {IAppResponseError} error - IAppResponseError custom
 * @param {Request} request - Express Request
 * @param {Response} response - Express Response
 * @param {nextFunction} nextFunction - Express Next Function
 * @returns
 */
const errorHandleMiddleware = async (error: IAppResponseError, request: Request, response: Response, nextFunction: NextFunction) => {
    const status = "error";
    const statusCode = error.statusCode || 500;
    const errorCode = error.errorCode || "E9999";
    const apiName = request.apiName || "Unknown API";
    const errorMessages = error.errorMessages || ["Internal Server Error"];
    const errorParams = error.errorParams || [];
    const errorDetails = error.errorDetails || [];
    const responseError: Omit<AppResponseError, "statusCode"> & { apiName: string } = { status, apiName, errorCode, errorMessages, errorParams, errorDetails };
    try {
        console.log("error-try:", error);

        // =================== Start To do =======================

        // ==================== End To do ========================

        logger.newError(request.requestId, request.apiName, responseError);
        response.status(statusCode).send(responseError);
        return;
    } catch (exceptionError) {
        console.log("error-try:", exceptionError);

        const exceptionResponseError: IExceptionResponseError = { ...responseError, errorException: exceptionError as Error };

        logger.newError(request.requestId, request.apiName, exceptionResponseError);
        response.status(400).send(exceptionResponseError);
        return;
    }
};

export default errorHandleMiddleware;
