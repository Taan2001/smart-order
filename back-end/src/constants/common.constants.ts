export const TYPES = {
    END_USER: 0,
    ADMIN: 1,
};

export type TypeKeys = keyof typeof TYPES;

export const LIMITS = [10, 30, 50, 100];

export const SORT_TYPE = ["", "DESC", "ASC"];

export const SORT_FIELD_GET_USERS = ["", "USER_FULLNAME", "USER_ADDRESS", "USER_PHONE", "USER_TYPE"];

export const FILTER_FIELD_GET_USERS = ["", "USER_FULLNAME", "USER_ADDRESS", "USER_PHONE", "USER_TYPE", "USER_DELETE_FLG"];

export const FILTER_TYPE_VALUE_GET_USERS = {
    "": "string",
    USER_FULLNAME: "string",
    USER_ADDRESS: "string",
    USER_PHONE: "string",
    USER_TYPE: "number",
    USER_DELETE_FLG: "number",
};
