import { IPageInfo, ISearchQuery } from "./app.interfaces";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IGetUsersRequestQuery extends ISearchQuery {}

export interface IGetUsersResponse {
    users: { userId: string; fullname: string; address: string; phone: string; type: number; deleteFlg: number }[];
    pageInfo: IPageInfo;
}

export interface IPostUserDetailRequestBody {
    fullname?: string;
    phone?: string;
    address?: string;
    type?: number;
    deleteFlg?: number;
}

export interface IPostUserDetailRequestPath {
    userId: string;
}

export interface IPostUserDetailResponse {
    messages: string[];
}

export interface IPostUserRequestBody {
    fullname: string;
    address: string;
    phone?: string;
}

export interface IPostUserResponse {
    messages: string[];
}
