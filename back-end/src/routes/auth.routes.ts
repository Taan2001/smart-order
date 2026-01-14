// libs
import { Router } from "express";

// controllers
import { postSignUpController, postRefreshTokenController, postTokenController, postSignInController } from "../controllers/auth.controllers";

// middlewares
import headerHandlerMiddleware from "../middlewares/header-handler.middlerware";
import authenticationHandlerMiddleware from "../middlewares/authentication-handler.middleware";
import authorizationHandlerMiddleware from "../middlewares/authorization-handler.middleware";

// create router
const authRouter = Router();

// [POST] /auth/token
authRouter.post("/token", headerHandlerMiddleware, postTokenController);

// [POST] /auth/refresh-token
authRouter.post("/refresh-token", headerHandlerMiddleware, postRefreshTokenController);

// [POST] /auth/sign-up
authRouter.post("/sign-up", headerHandlerMiddleware, authenticationHandlerMiddleware, authorizationHandlerMiddleware(["ADMIN"]), postSignUpController);

// [POST] /auth/sign-in
authRouter.post("/sign-in", headerHandlerMiddleware, postSignInController);

export default authRouter;
