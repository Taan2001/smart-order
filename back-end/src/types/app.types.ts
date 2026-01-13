// libs
import { Request, Response, NextFunction } from "express";

// interfaces
import { IAppResponseError, IAppResponseSuccess, ICurrentUser } from "../interfaces/app.interfaces";

export type AsyncHandler = (request: Request, response: Response, nextFunction: NextFunction) => Promise<void>;

export type AppResponseSuccess<D> = { status: "success" } & IAppResponseSuccess<D>;

export type AppResponseError = { status: "error" } & IAppResponseError;

export type CurrentUser = ICurrentUser;
