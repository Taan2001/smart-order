// libs
import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";

// utils
import { ResponseError } from "../utils/common";

// constants
import { ERRORS } from "../constants/error.constants";

// interfaces
import { ILimiterHandlerMiddleware } from "../interfaces/app.interfaces";

const limiterHandlerMiddleware = ({
    windowMinutes = 5,
    max = 10,
    standardHeaders = "draft-8",
    legacyHeaders = false,
    message = "",
}: ILimiterHandlerMiddleware) =>
    rateLimit({
        windowMs: windowMinutes * 60 * 1000,
        max: max,
        standardHeaders: standardHeaders,
        legacyHeaders: legacyHeaders,
        message: message,
        handler: (request: Request, response: Response, nextFunction: NextFunction) => {
            throw ResponseError({
                statusCode: 429,
                errorCode: "E000xx",
                errorMessages: [`Temporarily unable to sign in. Please try again in ${windowMinutes} minute(s).`],
            });
        },
    });

export default limiterHandlerMiddleware;
