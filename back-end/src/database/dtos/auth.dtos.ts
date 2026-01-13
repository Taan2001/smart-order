import { DefaultValues } from ".";

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
