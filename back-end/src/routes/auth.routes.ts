// libs
import { Router } from "express";

// controllers
import { postSignUpController, postRefreshTokenController, postTokenController, postSignInController } from "../controllers/auth.controllers";

// middlewares
import headerHandlerMiddleware from "../middlewares/header-handler.middlerware";
import authenticationHandlerMiddleware from "../middlewares/authentication-handler.middleware";
import authorizationHandlerMiddleware from "../middlewares/authorization-handler.middleware";

// create router
const authRouters = Router();

// [POST] /auth/token
authRouters.post("/token", headerHandlerMiddleware, postTokenController);

// [POST] /auth/refresh-token
authRouters.post("/refresh-token", headerHandlerMiddleware, postRefreshTokenController);

// [POST] /auth/sign-up
authRouters.post("/sign-up", headerHandlerMiddleware, authenticationHandlerMiddleware, authorizationHandlerMiddleware(["ADMIN"]), postSignUpController);

// [POST] /auth/sign-in
authRouters.post("/sign-in", headerHandlerMiddleware, postSignInController);

export default authRouters;
