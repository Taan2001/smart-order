import { AppResponseError } from "../types/app.types";

export interface IAppResponseSuccess<D> {
    statusCode: number;
    data: D;
}

export interface IErrorDetail {
    functionName: string;
    params: string[];
    errorMessage: string;
}

export interface IAppResponseError {
    statusCode: number;
    errorCode: string;
    errorMessages: string[];
    errorParams?: string[];
    errorDetails?: IErrorDetail[];
}

export interface IExceptionResponseError extends Omit<AppResponseError, "statusCode"> {
    errorException: Error;
}
