// libs
import { Request, NextFunction } from "express";

// interfaces
import { IPostSignInResponse } from "../interfaces/auth.interfaces";

// types
import { AppResponseSuccess } from "../types/app.types";

// utils
import { ResponseSuccess } from "../utils/common";

//constants
//database repositories

/**
 * Sign In Service
 * @param {Request} request - Express Request
 * @param {NextFunction} nextFunction - Express Next Function
 * @returns { Promise<AppResponseSuccess<IPostSignInResponse> | AppResponseError> } - Promise resolving to service result
 */
export const postSignInService = async (request: Request, nextFunction: NextFunction): Promise<AppResponseSuccess<IPostSignInResponse>> => {
    try {
        // logic here

        // return response
        return ResponseSuccess<IPostSignInResponse>({ statusCode: 200, data: { messages: ["Sign In successfully"] } });
    } catch (error) {
        throw error;
    }
};
