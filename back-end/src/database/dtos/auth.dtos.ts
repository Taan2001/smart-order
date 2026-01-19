import { DefaultInsertedDTO, DefaultValues } from ".";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetUserInformationByUsernameAndPasswordValues extends DefaultValues {}

export type GetUserInformationByUsernameAndPasswordDTO = GetUserByUserIdDTO;

export interface IGetUserInformationByUsernameAndPassword {
    username: string;
    password: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InsertUserInformationByAdminValues extends DefaultValues {}

export type InsertUserInformationByAdminDTO = DefaultInsertedDTO;

export interface IInsertUserInformationByAdmin {
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetUserByUserIdValues extends DefaultValues {}

export type GetUserByUserIdDTO = {
    userId: string;
    fullname: string;
    username: string;
    phone: string;
    type: number;
    deleteFlg: number;
};

export interface IGetUserByUserId {
    userId: string;
}
