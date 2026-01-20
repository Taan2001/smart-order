import { DefaultInsertedDTO, DefaultUpdatedDTO, DefaultValues } from ".";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SelectUserDetailByUserIdValues extends DefaultValues {}

export type SelectUserDetailByUserIdDTO = {
    userId: string;
    fullname: string;
    phone: string;
    address: string;
    type: number;
    deleteFlg: number;
    createdBy: string;
    createdAt: number;
};

export interface ISelectUserDetailByUserId {
    userId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SelectUsersValues extends DefaultValues {}

export type SelectUsersDTO = {
    userId: string;
    fullname: string;
    phone: string;
    address: string;
    type: number;
    deleteFlg: number;
};

export interface ISelectUsers {
    filterField: string;
    filterFields: string[];
    filterValue: string | number;
    sortField: string;
    sortFields: string[];
    sortType: string | "" | "ASC" | "DESC";
    sortTypes: string[];
    limit: number;
    offset: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CountSelectUsersValues extends DefaultValues {}

export type CountSelectUsersDTO = {
    totalUsers: number;
};

export interface ICountSelectUsers {
    filterField: string;
    filterFields: string[];
    filterValue: string | number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateUserInformationByAdminWithUserIdValues extends DefaultValues {}

export interface IUpdateUserInformationByAdminWithUserId {
    userId: string;
    fullname?: string;
    phone?: string;
    address?: string;
    type?: number;
    deleteFlg?: number;
    updatedBy: string;
    updatedAt: number;
    updatedDate: string;
}

export type UpdateUserInformationByAdminWithUserIdDTO = DefaultUpdatedDTO;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InsertUserInformationByEndUserValues extends DefaultValues {}

export type InsertUserInformationByEndUserDTO = DefaultInsertedDTO;

export interface IInsertUserInformationByEndUser {
    userId: string;
    fullname: string;
    username: string;
    password: string;
    phone: string;
    address: string;
    type: number;
    createdBy: string;
    createdAt: number;
    createdDate: string;
    updatedBy: string;
    updatedAt: number;
    updatedDate: string;
}
