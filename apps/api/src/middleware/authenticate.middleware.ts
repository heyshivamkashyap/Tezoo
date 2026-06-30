import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";
import { UserModel, UserRole } from "../modules/user/user.model";

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export const authenticate = (allowedRoles: UserRole[] = ["customer"]) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET) as JwtPayload;
    } catch {
      throw new ApiError(401, "Invalid or expired access token");
    }

    const user = await UserModel.findById(decoded.id).select("-refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    if (
      allowedRoles.length > 0 &&
      !user.roles.some((role) => allowedRoles.includes(role))
    ) {
      throw new ApiError(403, "Access denied");
    }

    req.user = user;

    next();
  });
