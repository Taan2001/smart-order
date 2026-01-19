// libs
import { Router } from "express";

// middlewares
import headerHandlerMiddleware from "../middlewares/header-handler.middlerware";
import limiterHandlerMiddleware from "../middlewares/limiter-handler.middleware";
import authenticationHandlerMiddleware from "../middlewares/authentication-handler.middleware";
import authorizationHandlerMiddleware from "../middlewares/authorization-handler.middleware";

// controllers
import { postUserController, postUserDetailController } from "../controllers/user.controllers";

// create router
const userRouters = Router();

// [POST] /users/user
userRouters.post("/user", headerHandlerMiddleware, limiterHandlerMiddleware({ windowMinutes: 60 * 4, max: 2 }), postUserController);

// [POST] /users/:userId
userRouters.post("/:userId", headerHandlerMiddleware, authenticationHandlerMiddleware, authorizationHandlerMiddleware(["ADMIN"]), postUserDetailController);

// [GET] /users
// userRouters.get("/", headerHandlerMiddleware, authenticationHandlerMiddleware, authorizationHandlerMiddleware, getUsersController);

// [GET] /users/:userId
// userRouters.get("/:userId", headerHandlerMiddleware, authenticationHandlerMiddleware, authorizationHandlerMiddleware, getUserDetailController);

export default userRouters;
