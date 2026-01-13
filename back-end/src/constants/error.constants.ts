export const ERRORS = {
    // common error
    ENVIRONMENT_VARIABLE_ERROR: {
        ERROR_CODE: "E00001",
        ERROR_MESSAGE: (variableName: string) => `The environment variable ${variableName} is not set or invalid.`,
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

    POST_TOKEN_QUERY_GET_USER_BY_USER_ID_ERROR: {
        ERROR_CODE: "E00012",
        ERROR_MESSAGE: () => "An error occurred while querying user information in database!",
    },
};
