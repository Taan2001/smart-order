// libs
import { Router } from "express";

// controllers
import { postSignInController } from "../controllers/auth.controllers";

// middlewares
import headerHandlerMiddleware from "../middlewares/header-handler.middlerware";

// create router
const authRouter = Router();

// example
authRouter.get("/", headerHandlerMiddleware, postSignInController);

export default authRouter;
