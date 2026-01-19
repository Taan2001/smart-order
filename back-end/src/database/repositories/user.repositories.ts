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
    InsertUserInformationByEndUserValues,
    InsertUserInformationByEndUserDTO,
    IInsertUserInformationByEndUser,
    IUpdateUserInformationByAdminWithUserId,
    UpdateUserInformationByAdminWithUserIdDTO,
} from "../dtos/user.dto";

export const updateUserInformationByAdminWithUserId = async (
    transaction: PoolConnection,
    { userId, fullname, phone, address, type, deleteFlg, updatedBy, updatedAt, updatedDate }: IUpdateUserInformationByAdminWithUserId
): Promise<UpdateUserInformationByAdminWithUserIdDTO[]> => {
    try {
        // create sqlUpdateField
        const sqlUpdateField = [];

        // create query parameters
        const queryParams = [];

        // fullname
        if (fullname !== undefined) {
            sqlUpdateField.push("USER_FULLNAME");
            queryParams.push(fullname);
        }

        // phone
        if (phone !== undefined) {
            sqlUpdateField.push("USER_PHONE");
            queryParams.push(phone);
        }

        // address
        if (address !== undefined) {
            sqlUpdateField.push("USER_ADDRESS");
            queryParams.push(address);
        }

        // type
        if (type !== undefined) {
            sqlUpdateField.push("USER_TYPE");
            queryParams.push(type);
        }

        // deleteFlg
        if (deleteFlg !== undefined) {
            sqlUpdateField.push("USER_DELETE_FLG");
            queryParams.push(deleteFlg);
        }

        // updatedBy
        if (updatedBy !== undefined) {
            sqlUpdateField.push("USER_UPDATED_BY");
            queryParams.push(updatedBy);
        }

        // updatedAt
        if (updatedAt !== undefined) {
            sqlUpdateField.push("USER_UPDATED_AT");
            queryParams.push(updatedAt);
        }

        // updatedDate
        if (updatedDate !== undefined) {
            sqlUpdateField.push("USER_UPDATED_AT_SYSTEM");
            queryParams.push(updatedDate);
        }

        // create sqlUpdate
        const sqlUpdate = `
            UPDATE M_USERS
            SET
                ${sqlUpdateField.map((field) => `${field} = ?`).join(", ")}
            WHERE
                USER_ID = ?
        `;
        queryParams.push(userId);

        const rows = await transactionQueryPoolPromise<InsertUserInformationByEndUserDTO, InsertUserInformationByEndUserValues>(
            transaction,
            sqlUpdate,
            queryParams
        );

        if (!rows) {
            return [];
        }
        return rows;
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERRORS.POST_USER_INSERT_USER_INFORMATION_BY_END_USER_ERROR.ERROR_CODE,
            errorMessages: [ERRORS.POST_USER_INSERT_USER_INFORMATION_BY_END_USER_ERROR.ERROR_MESSAGE("M_USERS")],
            errorDetails: [
                {
                    functionName: "insertUserInformationByEndUser",
                    params: [userId],
                    errorMessage: String(error),
                },
            ],
        });
    }
};

/**
 * Query insert the user information by userId
 * @param {PoolConnection} transaction - Pool Connection
 * @param {IInsertUserInformationByEndUser} payload - data to insert
 * @returns {Promise<InsertUserInformationByEndUserDTO>} - Promise resolving to user information
 * @throws Will throw an error if the database query fails
 */
export const insertUserInformationByEndUser = async (
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
    }: IInsertUserInformationByEndUser
): Promise<InsertUserInformationByEndUserDTO[]> => {
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

        const rows = await transactionQueryPoolPromise<InsertUserInformationByEndUserDTO, InsertUserInformationByEndUserValues>(
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
            errorCode: ERRORS.POST_USER_INSERT_USER_INFORMATION_BY_END_USER_ERROR.ERROR_CODE,
            errorMessages: [ERRORS.POST_USER_INSERT_USER_INFORMATION_BY_END_USER_ERROR.ERROR_MESSAGE("M_USERS")],
            errorDetails: [
                {
                    functionName: "insertUserInformationByEndUser",
                    params: [],
                    errorMessage: String(error),
                },
            ],
        });
    }
};
