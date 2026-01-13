// libs

// utils
import { ResponseError } from "../../utils/common";

// constants
import { ERRORS } from "../../constants/error.constants";

// database connection
import { queryPoolPromise } from "../connection-pool";

// dtos
import { GetUserByUserIdDTO, GetUserByUserIdValues, IGetUserByUserId } from "../dtos/auth.dtos";

/**
 * Query the user information by userId
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
