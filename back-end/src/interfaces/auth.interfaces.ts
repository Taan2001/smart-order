export interface IPostTokenRequestBody {
    userId: string;
}
export interface IPostTokenResponse {
    user: { userId: string };
    accessToken: string;
    refreshToken: string;
}

export interface IPostSignInResponse {
    messages: string[];
}
