// libs
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { Request, NextFunction } from "express";

// utils
import { ResponseError } from "./common";

// constants
import { ERRORS } from "../constants/error.constants";

// interfaces

// types
import { CurrentUser } from "../types/app.types";

/**
 * Generate Access Token Function
 * @param {Request} request - Express Request
 * @param {string | object | Buffer} payload - payload to be signed
 * @returns {Promise<string>} - Promise resolving to generated access token
 */
export const generateAccessToken = async <T extends string | object | Buffer>(request: Request, payload: T): Promise<string> => {
    try {
        // Check if environment variables are set
        if (!process.env.JWT_ACCESS_TOKEN_SECRET) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.ENVIRONMENT_VARIABLE_ERROR.ERROR_CODE,
                errorMessages: [ERRORS.ENVIRONMENT_VARIABLE_ERROR.ERROR_MESSAGE("JWT_ACCESS_TOKEN_SECRET")],
                errorParams: ["JWT_ACCESS_TOKEN_SECRET"],
                errorDetails: [
                    {
                        functionName: "generateAccessToken",
                        params: ["JWT_ACCESS_TOKEN_SECRET"],
                        errorMessage: ERRORS.ENVIRONMENT_VARIABLE_ERROR.ERROR_MESSAGE("JWT_ACCESS_TOKEN_SECRET"),
                    },
                ],
            });
        }

        // Check if environment variables are set
        if (!process.env.JWT_ACCESS_TOKEN_EXPIRES_IN) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.ENVIRONMENT_VARIABLE_ERROR.ERROR_CODE,
                errorMessages: [ERRORS.ENVIRONMENT_VARIABLE_ERROR.ERROR_MESSAGE("JWT_ACCESS_TOKEN_EXPIRES_IN")],
                errorParams: ["JWT_ACCESS_TOKEN_EXPIRES_IN"],
                errorDetails: [
                    {
                        functionName: "generateAccessToken",
                        params: ["JWT_ACCESS_TOKEN_EXPIRES_IN"],
                        errorMessage: ERRORS.ENVIRONMENT_VARIABLE_ERROR.ERROR_MESSAGE("JWT_ACCESS_TOKEN_EXPIRES_IN"),
                    },
                ],
            });
        }
        return new Promise((resolve, reject) => {
            jwt.sign(
                payload,
                String(process.env.JWT_ACCESS_TOKEN_SECRET),
                {
                    expiresIn: String(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN) as StringValue,
                },
                (error, accessToken) => {
                    if (error || !accessToken) {
                        return reject(
                            ResponseError({
                                statusCode: 400,
                                errorCode: ERRORS.JWT_GENERATE_ACCESS_TOKEN_ERROR.ERROR_CODE,
                                errorMessages: [ERRORS.JWT_GENERATE_ACCESS_TOKEN_ERROR.ERROR_MESSAGE()],
                                errorDetails: [
                                    {
                                        functionName: "jwt.sign",
                                        params: [JSON.stringify(payload)],
                                        errorMessage: JSON.stringify(error),
                                    },
                                ],
                            })
                        );
                    }

                    return resolve(accessToken);
                }
            );
        });
    } catch (error) {
        throw error;
    }
};

/**
 * Generate Refresh Token Function
 * @param {Request} request - Express Request
 * @param {string | object | Buffer} payload - payload to be signed
 * @returns {Promise<string>} - Promise resolving to generated refresh token
 */
export const generateRefreshToken = async <T extends string | object | Buffer>(request: Request, payload: T): Promise<string> => {
    try {
        // Check if environment variables are set
        if (!process.env.JWT_REFRESH_TOKEN_SECRET) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.ENVIRONMENT_VARIABLE_ERROR.ERROR_CODE,
                errorMessages: [ERRORS.ENVIRONMENT_VARIABLE_ERROR.ERROR_MESSAGE("JWT_REFRESH_TOKEN_SECRET")],
                errorParams: ["JWT_REFRESH_TOKEN_SECRET"],
                errorDetails: [
                    {
                        functionName: "generateRefreshToken",
                        params: ["JWT_REFRESH_TOKEN_SECRET"],
                        errorMessage: ERRORS.ENVIRONMENT_VARIABLE_ERROR.ERROR_MESSAGE("JWT_REFRESH_TOKEN_SECRET"),
                    },
                ],
            });
        }

        // Check if environment variables are set
        if (!process.env.JWT_REFRESH_TOKEN_EXPIRES_IN) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.ENVIRONMENT_VARIABLE_ERROR.ERROR_CODE,
                errorMessages: [ERRORS.ENVIRONMENT_VARIABLE_ERROR.ERROR_MESSAGE("JWT_REFRESH_TOKEN_EXPIRES_IN")],
                errorParams: ["JWT_REFRESH_TOKEN_EXPIRES_IN"],
                errorDetails: [
                    {
                        functionName: "generateAccessToken",
                        params: ["JWT_REFRESH_TOKEN_EXPIRES_IN"],
                        errorMessage: ERRORS.ENVIRONMENT_VARIABLE_ERROR.ERROR_MESSAGE("JWT_REFRESH_TOKEN_EXPIRES_IN"),
                    },
                ],
            });
        }
        return new Promise((resolve, reject) => {
            jwt.sign(
                payload,
                String(process.env.JWT_REFRESH_TOKEN_SECRET),
                {
                    expiresIn: String(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN) as StringValue,
                },
                (error, accessToken) => {
                    if (error || !accessToken) {
                        return reject(
                            ResponseError({
                                statusCode: 400,
                                errorCode: ERRORS.JWT_GENERATE_REFRESH_TOKEN_ERROR.ERROR_CODE,
                                errorMessages: [ERRORS.JWT_GENERATE_REFRESH_TOKEN_ERROR.ERROR_MESSAGE()],
                                errorDetails: [
                                    {
                                        functionName: "jwt.sign",
                                        params: [JSON.stringify(payload)],
                                        errorMessage: JSON.stringify(error),
                                    },
                                ],
                            })
                        );
                    }

                    return resolve(accessToken);
                }
            );
        });
    } catch (error) {
        throw error;
    }
};

/**
 * Verify Access Token Function
 * @param {Request} request - Express Request
 * @param {string} accessToken - Access Token
 */
export const verifyAccessToken = async (request: Request, accessToken: string): Promise<CurrentUser> => {
    try {
        // Check if environment variables are set
        if (!process.env.JWT_ACCESS_TOKEN_SECRET) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.ENVIRONMENT_VARIABLE_ERROR.ERROR_CODE,
                errorMessages: [ERRORS.ENVIRONMENT_VARIABLE_ERROR.ERROR_MESSAGE("JWT_ACCESS_TOKEN_SECRET")],
                errorParams: ["JWT_ACCESS_TOKEN_SECRET"],
                errorDetails: [
                    {
                        functionName: "verifyToken",
                        params: ["JWT_ACCESS_TOKEN_SECRET"],
                        errorMessage: `The environment variable JWT_ACCESS_TOKEN_SECRET does not exist or has no data.`,
                    },
                ],
            });
        }

        // Verify token
        return await new Promise((resolve, reject) => {
            jwt.verify(accessToken, String(process.env.JWT_ACCESS_TOKEN_SECRET), async (error, decoded) => {
                if (error) {
                    reject(
                        ResponseError({
                            statusCode: 401,
                            errorCode: ERRORS.VERIFY_ACCESS_TOKEN_ERROR.ERROR_CODE,
                            errorMessages: [ERRORS.VERIFY_ACCESS_TOKEN_ERROR.ERROR_MESSAGE()],
                            errorParams: ["accessToken"],
                            errorDetails: [
                                {
                                    functionName: "verifyAccessToken",
                                    params: [accessToken],
                                    errorMessage: String(error),
                                },
                            ],
                        })
                    );
                }
                // TO DO
                const currentUser = decoded as CurrentUser;
                // =====

                resolve(currentUser);
            });
        });
    } catch (error) {
        throw error;
    }
};

/**
 * Verify Refresh Token Function
 * @param {Request} request - Express Request
 * @param {string} refreshToken - Refresh Token
 * @returns {boolean} -
 */
export const verifyRefreshToken = async (request: Request, refreshToken: string): Promise<CurrentUser> => {
    try {
        // Check if environment variables are set
        if (!process.env.JWT_REFRESH_TOKEN_SECRET) {
            throw ResponseError({
                statusCode: 400,
                errorCode: ERRORS.ENVIRONMENT_VARIABLE_ERROR.ERROR_CODE,
                errorMessages: [ERRORS.ENVIRONMENT_VARIABLE_ERROR.ERROR_MESSAGE("JWT_REFRESH_TOKEN_SECRET")],
                errorParams: ["JWT_REFRESH_TOKEN_SECRET"],
                errorDetails: [
                    {
                        functionName: "verifyToken",
                        params: ["JWT_REFRESH_TOKEN_SECRET"],
                        errorMessage: `The environment variable '${"JWT_REFRESH_TOKEN_SECRET"}' does not exist or has no data.`,
                    },
                ],
            });
        }

        // Verify token
        return await new Promise<CurrentUser>((resolve, reject) => {
            jwt.verify(refreshToken, String(process.env.JWT_REFRESH_TOKEN_SECRET), async (error, decoded) => {
                if (error) {
                    reject(
                        ResponseError({
                            statusCode: 401,
                            errorCode: ERRORS.VERIFY_REFRESH_TOKEN_ERROR.ERROR_CODE,
                            errorMessages: [ERRORS.VERIFY_REFRESH_TOKEN_ERROR.ERROR_MESSAGE()],
                            errorParams: ["refreshToken"],
                            errorDetails: [
                                {
                                    functionName: "verifyRefreshToken",
                                    params: [refreshToken],
                                    errorMessage: String(error),
                                },
                            ],
                        })
                    );
                }
                // TO DO
                const currentUser = decoded as CurrentUser;
                // =====

                resolve(currentUser);
            });
        });
    } catch (error) {
        throw error;
    }
};
