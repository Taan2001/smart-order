export interface IPostSignInRequestBody {
    username: string;
    password: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IPostSignInResponse extends IPostRefreshTokenResponse {}

export interface IPostSignUpRequestBody {
    username: string;
    password: string;
    fullname: string;
    phone: string;
    address: string;
    type: number;
}

export interface IPostSignUpResponse {
    messages: string[];
}
export interface IPostRefreshTokenRequestBody {
    refreshToken: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IPostRefreshTokenResponse extends IPostTokenResponse {}

export interface IPostTokenRequestBody {
    userId: string;
}
export interface IPostTokenResponse {
    user: { userId: string };
    accessToken: string;
    refreshToken: string;
}
