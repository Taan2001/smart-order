// libs
import { Router } from "express";

// routes
import authRouter from "./auth.routes";

const routes = Router();

// auth routes
routes.use("/auth", authRouter);

export default routes;
