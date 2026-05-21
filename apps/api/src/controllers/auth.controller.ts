import type { CookieOptions, Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "@repo/utils";
import { ApiError } from "../utils/ApiError";
import { UserModel } from "../models/user.model";
import { env } from "../config/env";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// Secure cookie configuration
const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
};

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    // Validate request body
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(400, "Invalid input data");
    }

    const { name, email, password } = result.data;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      throw new ApiError(409, "An account with this email already exists");
    }

    // Create new user (password will be hashed automatically in model)
    const user = await UserModel.create({
      name,
      email,
      password,
    });

    const { accessToken, refreshToken } = user.generateTokens();

    // Remove sensitive fields before sending response
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Send response response with cookies + tokens
    return res
      .status(201)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
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
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = user.generateTokens();

  // Remove sensitive fields before sending response
  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  // Send response response with cookies + tokens
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
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
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});
