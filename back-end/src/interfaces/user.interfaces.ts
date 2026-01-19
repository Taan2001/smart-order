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
