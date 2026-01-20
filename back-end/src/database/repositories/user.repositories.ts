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
    CountSelectUsersDTO,
    CountSelectUsersValues,
    ICountSelectUsers,
    ISelectUsers,
    SelectUsersDTO,
    SelectUsersValues,
} from "../dtos/user.dto";

/**
 * Query count the user by condition
 * @param {ISelectUsers} payload - data to insert
 * @returns {Promise<SelectUsersDTO>} - Promise resolving to user information
 * @throws Will throw an error if the database query fails
 */
export const selectUsers = async ({
    limit,
    offset,
    filterField,
    filterFields,
    filterValue,
    sortField,
    sortFields,
    sortType,
    sortTypes,
}: ISelectUsers): Promise<SelectUsersDTO[]> => {
    try {
        // create selectCondition
        const sqlParams = [];

        // create where clause
        let filterClause = "";
        if (filterField && filterValue && filterFields.includes(filterField)) {
            filterClause = `
            WHERE 
                ${filterField} LIKE ?
            `;
            sqlParams.push(`%${filterValue}%`);
        }

        // create order by clause
        let orderByClause = "";
        if (sortField && sortType && sortFields.includes(sortField) && sortTypes.includes(sortType)) {
            orderByClause = `
            ORDER BY ${sortField} ${sortType}
            `;
        }

        // create sqlSelect
        const sqlSelect = `
            SELECT
                USER_ID AS userId,
                USER_FULLNAME AS fullname,
                USER_PHONE AS phone, 
                USER_ADDRESS AS address,
                USER_TYPE AS type,
                USER_DELETE_FLG AS deleteFlg
            FROM
                M_USERS
            ${filterClause}
            ${orderByClause}
            LIMIT ?
            OFFSET ?;
        `;
        sqlParams.push(limit, offset);

        const rows = await queryPoolPromise<SelectUsersDTO, SelectUsersValues>(sqlSelect, sqlParams);

        if (!rows) {
            return [];
        }
        return rows;
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERRORS.GET_USERS_SELECT_USERS_ERROR.ERROR_CODE,
            errorMessages: [ERRORS.GET_USERS_SELECT_USERS_ERROR.ERROR_MESSAGE("M_USERS")],
            errorDetails: [
                {
                    functionName: "selectUsers",
                    params: [],
                    errorMessage: String(error),
                },
            ],
        });
    }
};

/**
 * Query count the user by condition
 * @param {ICountSelectUsers} payload - data to insert
 * @returns {Promise<number>} - Promise resolving to user information
 * @throws Will throw an error if the database query fails
 */
export const selectCountSelectUsers = async ({ filterField, filterFields, filterValue }: ICountSelectUsers): Promise<number> => {
    try {
        // create selectCondition
        const sqlParams = [];

        // create where clause
        let filterClause = "";
        if (filterField && filterValue && filterFields.includes(filterField)) {
            filterClause = `
            WHERE 
                ${filterField} LIKE ?
            `;
            sqlParams.push(`%${filterValue}%`);
        }

        // create sqlSelect
        const sqlSelect = `
            SELECT
                COUNT(*) AS totalUsers
            FROM
                M_USERS
            ${filterClause}
        `;

        const rows = await queryPoolPromise<CountSelectUsersDTO, CountSelectUsersValues>(sqlSelect, sqlParams);

        if (!rows) {
            return 0;
        }
        return rows[0].totalUsers;
    } catch (error) {
        throw ResponseError({
            statusCode: 500,
            errorCode: ERRORS.GET_USERS_SELECT_COUNT_USERS_ERROR.ERROR_CODE,
            errorMessages: [ERRORS.GET_USERS_SELECT_COUNT_USERS_ERROR.ERROR_MESSAGE("M_USERS")],
            errorDetails: [
                {
                    functionName: "CountSelectUsers",
                    params: [],
                    errorMessage: String(error),
                },
            ],
        });
    }
};

/**
 * Query update the user information by userId
 * @param {PoolConnection} transaction - Pool Connection
 * @param {IUpdateUserInformationByAdminWithUserId} payload - data to insert
 * @returns {Promise<UpdateUserInformationByAdminWithUserIdDTO>} - Promise resolving to user information
 * @throws Will throw an error if the database query fails
 */
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
            errorCode: ERRORS.POST_USER_DETAIL_UPDATE_USER_INFORMATION_BY_ADMIN_WITH_USER_ID_ERROR.ERROR_CODE,
            errorMessages: [ERRORS.POST_USER_DETAIL_UPDATE_USER_INFORMATION_BY_ADMIN_WITH_USER_ID_ERROR.ERROR_MESSAGE("M_USERS")],
            errorDetails: [
                {
                    functionName: "updateUserInformationByAdminWithUserId",
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
