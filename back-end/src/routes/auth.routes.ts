// libs
import { Router } from "express";

// controllers
import { postSignInController } from "../controllers/auth.controllers";

// middlewares
import headerHandlerMiddleware from "../middlewares/header-handler.middlerware";

// create router
const authRouter = Router();

// [POST] /auth/token
// authRouter.post("/token", headerHandlerMiddleware, postTokenController);

// [POST] /auth/refresh-token
// authRouter.post("/refresh-token", headerHandlerMiddleware, postRefreshTokenController);

// [POST] /auth/sign-up
// authRouter.post("/sign-up", headerHandlerMiddleware, authenticationHandlerMiddleware, authorizationHandlerMiddleware, postSignUpController);

// [POST] /auth/sign-in
// authRouter.post("/sign-in", headerHandlerMiddleware, postSignInController);

export default authRouter;
