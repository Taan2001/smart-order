// libs
import { Router } from "express";

// create router
const userRouter = Router();

// [POST] /user
// userRouter.post("/user", headerHandlerMiddleware, postUserController);

// [POST] /users/:userId
// userRouter.post("/users/:userId", headerHandlerMiddleware, authenticationHandlerMiddleware, authorizationHandlerMiddleware, postUserDetailController);

// [GET] /users
// userRouter.get("/users", headerHandlerMiddleware, authenticationHandlerMiddleware, authorizationHandlerMiddleware, getUsersController);

// [GET] /users/:userId
// userRouter.get("/users/:userId", headerHandlerMiddleware, authenticationHandlerMiddleware, authorizationHandlerMiddleware, getUserDetailController);

export default userRouter;
