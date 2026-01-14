// libs
import { PoolConnection } from "mysql2/typings/mysql/lib/PoolConnection";

// utils
import { ResponseError } from "../../utils/common";

// constants
import { ERRORS } from "../../constants/error.constants";

// database connection
import { queryPoolPromise, transactionQueryPoolPromise } from "../connection-pool";

// dtos
import {
    GetUserByUserIdValues,
    GetUserByUserIdDTO,
    IGetUserByUserId,
    InsertUserInformationByAdminValues,
    InsertUserInformationByAdminDTO,
    IInsertUserInformationByAdmin,
    IGetUserInformationByUsernameAndPassword,
    GetUserInformationByUsernameAndPasswordDTO,
    GetUserInformationByUsernameAndPasswordValues,
} from "../dtos/auth.dtos";

/**
 * Query insert the user information by userId
 * @param {PoolConnection} transaction - Pool Connection
 * @param {IInsertUserInformationByAdmin} payload - data to insert
 * @returns {Promise<InsertUserInformationByAdminDTO>} - Promise resolving to user information
 * @throws Will throw an error if the database query fails
 */
export const getUserInformationByUsernameAndPassword = async ({
    username,
    password,
}: IGetUserInformationByUsernameAndPassword): Promise<GetUserInformationByUsernameAndPasswordDTO[]> => {
    try {
        // create sqlInsert
        const sqlSelect = `
            SELECT 
                USER_ID AS userId,
                USER_FULLNAME AS fullname,
                USER_NAME AS name,
                USER_PHONE AS phone,
                USER_TYPE AS type,
                USER_DELETE_FLG AS deleteFlg
            FROM 	
                M_USERS
            WHERE	
                USER_NAME = ?
                AND USER_PASSWORD = SHA2(?, 256)
                AND USER_DELETE_FLG = 0
        `;

        // create query parameters
        const queryParams = [username, password];

        const rows = await queryPoolPromise<GetUserInformationByUsernameAndPasswordDTO, GetUserInformationByUsernameAndPasswordValues>(sqlSelect, queryParams);

        if (!rows) {
            return [];
        }
        return rows;
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERRORS.POST_TOKEN_QUERY_GET_USER_BY_USERNAME_AND_PASSWORD_ERROR.ERROR_CODE,
            errorMessages: [ERRORS.POST_TOKEN_QUERY_GET_USER_BY_USERNAME_AND_PASSWORD_ERROR.ERROR_MESSAGE()],
            errorDetails: [
                {
                    functionName: "getUserInformationByUsernameAndPassword",
                    params: [],
                    errorMessage: String(error),
                },
            ],
        });
    }
};

/**
 * Query insert the user information by userId
 * @param {PoolConnection} transaction - Pool Connection
 * @param {IInsertUserInformationByAdmin} payload - data to insert
 * @returns {Promise<InsertUserInformationByAdminDTO>} - Promise resolving to user information
 * @throws Will throw an error if the database query fails
 */
export const insertUserInformationByAdmin = async (
    transaction: PoolConnection,
    {
        userId,
        fullname,
        username,
        password,
        phone,
        address,
        type,
        createdBy,
        createdAt,
        createdDate,
        updatedBy,
        updatedAt,
        updatedDate,
    }: IInsertUserInformationByAdmin
): Promise<InsertUserInformationByAdminDTO[]> => {
    try {
        // create sqlInsert
        const sqlInsert = `
            INSERT INTO M_USERS (
                USER_ID, 
                USER_FULLNAME,
                USER_NAME, 
                USER_PASSWORD, 
                USER_PHONE, 
                USER_ADDRESS, 
                USER_TYPE,
                USER_DELETE_FLG,
                USER_CREATED_BY, 
                USER_CREATED_AT, 
                USER_CREATED_AT_SYSTEM, 
                USER_UPDATED_BY, 
                USER_UPDATED_AT, 
                USER_UPDATED_AT_SYSTEM
            )
            VALUES (?, ?, ?, SHA2(?, 256), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        // create query parameters
        const queryParams = [
            userId,
            fullname,
            username,
            password,
            phone,
            address,
            type,
            0,
            createdBy,
            createdAt,
            createdDate,
            updatedBy,
            updatedAt,
            updatedDate,
        ];

        const rows = await transactionQueryPoolPromise<InsertUserInformationByAdminDTO, InsertUserInformationByAdminValues>(
            transaction,
            sqlInsert,
            queryParams
        );

        if (!rows) {
            return [];
        }
        return rows;
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERRORS.POST_SIGN_UP_INSERT_USER_INFORMATION_BY_ADMIN_ERROR.ERROR_CODE,
            errorMessages: [ERRORS.POST_SIGN_UP_INSERT_USER_INFORMATION_BY_ADMIN_ERROR.ERROR_MESSAGE("M_USERS")],
            errorDetails: [
                {
                    functionName: "insertUserInformationByAdmin",
                    params: [],
                    errorMessage: String(error),
                },
            ],
        });
    }
};

/**
 * Query get the user information by userId
 * @param {IGetUserByUserId} {userId} - The ID of the user to retrieve
 * @returns {Promise<GetUserByUserIdDTO>} - Promise resolving to user information
 * @throws Will throw an error if the database query fails
 */
export const getUserByUserId = async ({ userId }: IGetUserByUserId): Promise<GetUserByUserIdDTO[]> => {
    try {
        // create sql query
        const sqlQuery = `
            SELECT
                USER_ID AS userId,
                USER_FULLNAME AS fullname,
                USER_NAME AS name,
                USER_PHONE AS phone,
                USER_TYPE AS type,
                USER_DELETE_FLG AS deleteFlg
            FROM
                M_USERS
            WHERE
                USER_ID = ?;
        `;

        // create query parameters
        const queryParams = [userId];

        // execute query
        const rows = await queryPoolPromise<GetUserByUserIdDTO, GetUserByUserIdValues>(sqlQuery, queryParams);

        if (!rows) {
            return [];
        }
        return rows;
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERRORS.POST_TOKEN_QUERY_GET_USER_BY_USER_ID_ERROR.ERROR_CODE,
            errorMessages: [ERRORS.POST_TOKEN_QUERY_GET_USER_BY_USER_ID_ERROR.ERROR_MESSAGE()],
            errorDetails: [
                {
                    functionName: "getUserByUserId",
                    params: [userId],
                    errorMessage: String(error),
                },
            ],
        });
    }
};
