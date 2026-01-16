// libs
import { Router } from "express";

// routes
import authRouters from "./auth.routes";
import userRouters from "./user.routes";

const routes = Router();

// auth routes
routes.use("/auth", authRouters);
routes.use("/users", userRouters);

export default routes;
