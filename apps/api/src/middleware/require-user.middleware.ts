import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";
import { UserModel } from "../models/user.model";

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const requireUser = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    // Extract token from cookies or header
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // If no token is found, return unauthorized response
    if (!accessToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decode = jwt.verify(
      accessToken,
      env.ACCESS_TOKEN_SECRET,
    ) as JwtPayload;

    // Checking token in valid
    // use lean method -> Don't return full Mongoose document, just give me a plain JavaScript object
    const user = await UserModel.findById(decode.id).select("-refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // Attach the user to the request
    req.user = user;
    next();
  },
);
