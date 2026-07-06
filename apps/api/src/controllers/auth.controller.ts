import type { CookieOptions, Request, Response } from "express";
import { registerSchema, loginSchema } from "@repo/utils";
import { ApiError } from "../utils/ApiError";
import { UserModel } from "../modules/user/user.model";
import { env } from "../config/env";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

// Secure cookie configuration
const accessTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

interface RefreshTokenPayload {
  id: string;
}

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    // Validate request body
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(400, "Invalid input data");
    }

    const { fullName, email, password } = result.data;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      throw new ApiError(409, "An account with this email already exists");
    }

    // Create new user (password will be hashed automatically in model)
    const user = await UserModel.create({
      fullName,
      email,
      password,
    });

    const { accessToken, refreshToken } = user.generateTokens();

    // Remove sensitive fields before sending response
    const safeUser = {
      _id: user._id,
      name: user.fullName,
      email: user.email,
      role: user.roles,
    };

    // Send response response with cookies + tokens
    return res
      .status(201)
      .cookie("accessToken", accessToken, accessTokenCookieOptions)
      .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
      .json(
        new ApiResponse(
          201,
          {
            user: safeUser,
            accessToken,
            refreshToken,
          },
          "Account Created Successfully",
        ),
      );
  },
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(400, "Invalid input data");
  }

  const { identifier, password } = result.data;

  // Find user by email or phone
  // Include password field explicitly
  const user = await UserModel.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
  }).select("+password");

  // Check if user exists
  if (!user) {
    throw new ApiError(404, "No user found with this email or phone");
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = user.generateTokens();

  // Remove sensitive fields before sending response
  const safeUser = {
    _id: user._id,
    name: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.roles,
  };

  // Send response response with cookies + tokens
  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: safeUser,
          accessToken,
          refreshToken,
        },
        "Loggin Successfully",
      ),
    );
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  return res
    .status(200)
    .clearCookie("accessToken", accessTokenCookieOptions)
    .clearCookie("refreshToken", refreshTokenCookieOptions)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const incomingRefreshToken =
      req.cookies?.refreshToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Refresh token is required");
    }

    let decoded: RefreshTokenPayload;

    try {
      decoded = jwt.verify(
        incomingRefreshToken,
        env.REFRESH_TOKEN_SECRET,
      ) as RefreshTokenPayload;
    } catch (error) {
      console.log("verify jwt error", error);
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const { accessToken, refreshToken } = user.generateTokens();

    return res
      .status(200)
      .cookie("accessToken", accessToken, accessTokenCookieOptions)
      .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "Access token refreshed successfully",
        ),
      );
  },
);
