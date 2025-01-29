import { NextFunction, Request, Response } from "express";
import { validateToken } from "../utils/validateToken";
import { UserTokenPayload } from "../types-ts/general-types";

declare global {
  namespace Express {
    interface Request {
      user?: UserTokenPayload;
    }
  }
}
