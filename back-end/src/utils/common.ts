// libs
import { Request, Response, NextFunction } from "express";

// interfaces
import { IAppResponseError, IAppResponseSuccess } from "../interfaces/app.interfaces";

// types
import { AppResponseError, AppResponseSuccess, AsyncHandler } from "../types/app.types";

/**
 * Catch Async Function
 * @param {AsyncHandler} fn the async function
 * @returns (request: Request, response: Response, nextFunction: NextFunction) => void
 */
export const catchAsync = (fn: AsyncHandler) => (request: Request, response: Response, nextFunction: NextFunction) => {
    fn(request, response, nextFunction).catch((error) => nextFunction(error));
};

/**
 * Response Success Function
 * @param {number} statusCode status code http
 * @param {D} data the data return to client
 * @returns AppResponseSuccess<D>
 */
export const ResponseSuccess = <D>({ statusCode, data }: IAppResponseSuccess<D>): AppResponseSuccess<D> => ({
    status: "success",
    statusCode,
    data,
});

/**
 * Response Error Function
 * @param {string} apiName the api name
 * @param {number} statusCode status code http
 * @param {string} errrorCode error code
 * @param {string[]} errorMessage error message
 * @param {string[]} errorParams the params cause request error
 * @param {ErrorDetail[]} errorDetails the details of error
 * @returns {AppResponseError} AppResponseError
 */
export const ResponseError = ({ statusCode, errorCode, errorMessages, errorParams = [], errorDetails = [] }: IAppResponseError): AppResponseError => ({
    status: "error",
    statusCode,
    errorCode,
    errorMessages,
    errorParams,
    errorDetails,
});
