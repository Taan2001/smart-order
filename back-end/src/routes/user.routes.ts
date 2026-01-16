// libs
import { Router } from "express";

// middlewares
import limiterHandlerMiddleware from "../middlewares/limiter-handler.middleware";
import headerHandlerMiddleware from "../middlewares/header-handler.middlerware";

// controllers
import { postUserController } from "../controllers/user.controllers";

// create router
const userRouters = Router();

// [POST] /users/user
userRouters.post("/user", headerHandlerMiddleware, limiterHandlerMiddleware({ windowMinutes: 60 * 4, max: 2 }), postUserController);

// [POST] /users/:userId
// userRouters.post("/users/:userId", headerHandlerMiddleware, authenticationHandlerMiddleware, authorizationHandlerMiddleware, postUserDetailController);

// [GET] /users
// userRouters.get("/users", headerHandlerMiddleware, authenticationHandlerMiddleware, authorizationHandlerMiddleware, getUsersController);

// [GET] /users/:userId
// userRouters.get("/users/:userId", headerHandlerMiddleware, authenticationHandlerMiddleware, authorizationHandlerMiddleware, getUserDetailController);

export default userRouters;
