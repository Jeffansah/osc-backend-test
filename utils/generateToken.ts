import jwt from "jsonwebtoken";
import { UserTokenPayload } from "../types-ts/general-types";

export const generateToken = (payload: UserTokenPayload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  return token;
};
