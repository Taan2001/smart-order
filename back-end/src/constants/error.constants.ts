export const ERRORS = {
    // common error
    ENVIRONMENT_VARIABLE_ERROR: {
        ERROR_CODE: "E00001",
        ERROR_MESSAGE: (variableName: string) => `The environment variable ${variableName} is not set or invalid.`,
    },

    // common error
    MISSING_AUTHORIZATION_HEADER_ERROR: {
        ERROR_CODE: "E00002",
        ERROR_MESSAGE: () => "Missing Authorization Header!",
    },

    // common error
    VERIFY_ACCESS_TOKEN_ERROR: {
        ERROR_CODE: "E00003",
        ERROR_MESSAGE: () => "Unauthorized Access Token!",
    },

    // E00004 - not used

    // common error
    UNABLE_AUTHENTICATION_USER_ERROR: {
        ERROR_CODE: "E00005",
        ERROR_MESSAGE: () => "Unable to authenticate user!",
    },

    // common error
    UNAVAILABLE_AUTHENTICATION_USER_ERROR: {
        ERROR_CODE: "E00006",
        ERROR_MESSAGE: () => "The current user account is unavailable!",
    },

    // E00007 - not used

    // common error
    UNAVAILABLE_TYPE_ERROR: {
        ERROR_CODE: "E00008",
        ERROR_MESSAGE: () => "The user is not allowed to access resource.",
    },

    // common error
    JWT_GENERATE_ACCESS_TOKEN_ERROR: {
        ERROR_CODE: "E00009",
        ERROR_MESSAGE: () => "An error occurred while generating the access token.",
    },

    // common error
    JWT_GENERATE_REFRESH_TOKEN_ERROR: {
        ERROR_CODE: "E00010",
        ERROR_MESSAGE: () => "An error occurred while generating the refresh token.",
    },

    POST_TOKEN_REQUIRED_FIELD_ERROR: {
        ERROR_CODE: "E00011",
        ERROR_MESSAGE: (requiredField: string) => `The ${requiredField} is required!`,
    },

    // common error
    POST_TOKEN_QUERY_GET_USER_BY_USER_ID_ERROR: {
        ERROR_CODE: "E00012",
        ERROR_MESSAGE: () => "An error occurred while querying user information in database!",
    },

    // common error
    POST_TOKEN_USER_INFORMATION_NOT_FOUND_ERROR: {
        ERROR_CODE: "E00013",
        ERROR_MESSAGE: () => "The user information not found!",
    },

    // common error
    POST_TOKEN_USER_INFORMATION_UNAVAILABLE_ERROR: {
        ERROR_CODE: "E00014",
        ERROR_MESSAGE: () => "The current user account is unavailable!",
    },

    POST_REFRESH_TOKEN_REQUIRED_FIELD_ERROR: {
        ERROR_CODE: "E00015",
        ERROR_MESSAGE: (requiredField: string) => `The ${requiredField} is required!`,
    },

    // common error
    VERIFY_REFRESH_TOKEN_ERROR: {
        ERROR_CODE: "E00016",
        ERROR_MESSAGE: () => "Unauthorized Refresh Token!",
    },

    POST_SIGN_UP_REQUIRED_FIELD_ERROR: {
        ERROR_CODE: "E00017",
        ERROR_MESSAGE: (requiredField: string) => `The ${requiredField} is required!`,
    },

    POST_SIGN_UP_DATA_TYPE_ERROR: {
        ERROR_CODE: "E00018",
        ERROR_MESSAGE: (
            fieldName: string,
            errorName: "data types" | "maximum length" | "minimum length" | "space in string" | "phone number" | "input value"
        ) => `The ${fieldName} has an error regarding its ${errorName}.`,
    },

    POST_SIGN_UP_INSERT_USER_INFORMATION_BY_ADMIN_ERROR: {
        ERROR_CODE: "E00019",
        ERROR_MESSAGE: (tableName: string) => `An error occurred while inserting data into the ${tableName} table.`,
    },

    POST_SIGN_IN_REQUIRED_FIELD_ERROR: {
        ERROR_CODE: "E00020",
        ERROR_MESSAGE: (requiredField: string) => `The ${requiredField} is required!`,
    },

    POST_SIGN_IN_DATA_TYPE_ERROR: {
        ERROR_CODE: "E00021",
        ERROR_MESSAGE: (
            fieldName: string,
            errorName: "data types" | "maximum length" | "minimum length" | "space in string" | "phone number" | "input value"
        ) => `The ${fieldName} has an error regarding its ${errorName}.`,
    },

    POST_TOKEN_QUERY_GET_USER_BY_USERNAME_AND_PASSWORD_ERROR: {
        ERROR_CODE: "E00022",
        ERROR_MESSAGE: () => "An error occurred while querying user information in database!",
    },

    POST_SIGN_IN_USER_INFORMATION_NOT_FOUND_ERROR: {
        ERROR_CODE: "E00023",
        ERROR_MESSAGE: () => "The user information not found!",
    },

    POST_USER_REQUIRED_FIELD_ERROR: {
        ERROR_CODE: "E00024",
        ERROR_MESSAGE: (requiredField: string) => `The ${requiredField} is required!`,
    },

    POST_USER_DATA_TYPE_ERROR: {
        ERROR_CODE: "E00025",
        ERROR_MESSAGE: (
            fieldName: string,
            errorName: "data types" | "maximum length" | "minimum length" | "space in string" | "phone number" | "input value"
        ) => `The ${fieldName} has an error regarding its ${errorName}.`,
    },

    POST_USER_INSERT_USER_INFORMATION_BY_END_USER_ERROR: {
        ERROR_CODE: "E00026",
        ERROR_MESSAGE: (tableName: string) => `An error occurred while inserting data into the ${tableName} table.`,
    },

    POST_USER_DETAIL_REQUIRED_FIELD_ERROR: {
        ERROR_CODE: "E00027",
        ERROR_MESSAGE: (requiredField: string) => `The ${requiredField} is required!`,
    },

    POST_USER_DETAIL_DATA_TYPE_ERROR: {
        ERROR_CODE: "E00028",
        ERROR_MESSAGE: (
            fieldName: string,
            errorName: "data types" | "maximum length" | "minimum length" | "space in string" | "phone number" | "input value"
        ) => `The ${fieldName} has an error regarding its ${errorName}.`,
    },

    POST_USER_DETAIL_UPDATE_USER_INFORMATION_BY_ADMIN_WITH_USER_ID_ERROR: {
        ERROR_CODE: "E00029",
        ERROR_MESSAGE: (tableName: string) => `An error occurred while updating data into the ${tableName} table.`,
    },

    GET_USERS_REQUIRED_FIELD_ERROR: {
        ERROR_CODE: "E00030",
        ERROR_MESSAGE: (requiredField: string) => `The ${requiredField} is required!`,
    },

    GET_USERS_DATA_TYPE_ERROR: {
        ERROR_CODE: "E00031",
        ERROR_MESSAGE: (
            fieldName: string,
            errorName: "data types" | "maximum length" | "minimum length" | "space in string" | "phone number" | "input value"
        ) => `The ${fieldName} has an error regarding its ${errorName}.`,
    },

    GET_USERS_SELECT_COUNT_USERS_ERROR: {
        ERROR_CODE: "E00032",
        ERROR_MESSAGE: (tableName: string) => `An error occurred while selecting data into the ${tableName} table.`,
    },

    // common error
    EMPTY_LIST_ERROR: {
        ERROR_CODE: "E00033",
        ERROR_MESSAGE: () => `Empty List.`,
    },

    // common error
    OFFSET_ERROR: {
        ERROR_CODE: "E00034",
        ERROR_MESSAGE: () => `Page not found.`,
    },

    GET_USERS_SELECT_USERS_ERROR: {
        ERROR_CODE: "E00035",
        ERROR_MESSAGE: (tableName: string) => `An error occurred while selecting data into the ${tableName} table.`,
    },

    GET_USER_DETAIL_REQUIRED_FIELD_ERROR: {
        ERROR_CODE: "E00036",
        ERROR_MESSAGE: (requiredField: string) => `The ${requiredField} is required!`,
    },

    GET_USER_DETAIL_SELECT_USER_DETAIL_BY_USER_ID_ERROR: {
        ERROR_CODE: "E00037",
        ERROR_MESSAGE: (tableName: string) => `An error occurred while selecting data into the ${tableName} table.`,
    },

    // common
    USER_INFORMATION_NOT_FOUND_ERROR: {
        ERROR_CODE: "E00038",
        ERROR_MESSAGE: () => `The user information not found!`,
    },
};
