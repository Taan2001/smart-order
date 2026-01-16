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

export interface ICurrentUser {
    userId: string;
    name: string;
    phone: string;
    type: number;
    deleteFlg: number;
}

export interface ILimiterHandlerMiddleware {
    windowMinutes: number;
    max: number;
    standardHeaders?: boolean | "draft-8" | "draft-6" | "draft-7" | undefined;
    legacyHeaders?: boolean;
    message?: string;
}
