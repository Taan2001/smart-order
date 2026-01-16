export interface IPostUserRequestBody {
    fullname: string;
    address: string;
    phone?: string;
}

export interface IPostUserResponse {
    messages: string[];
}
