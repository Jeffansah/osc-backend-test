import { Request } from "express";
import jwt from "jsonwebtoken";
import { UserTokenPayload } from "../types-ts/general-types";

// Extending the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: UserTokenPayload;
    }
  }
}

export const validateToken = async (req: Request) => {
  const token = req.cookies?.token;

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as UserTokenPayload;

    req.user = payload;

    return true;
  } catch (error) {
    console.error("Token verification failed", error);
    return false;
  }
};
