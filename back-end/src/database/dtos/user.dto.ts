import { DefaultInsertedDTO, DefaultUpdatedDTO, DefaultValues } from ".";
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
