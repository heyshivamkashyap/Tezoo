import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("Error:", error);

  // Known application errors
  if (error instanceof ApiError) {
    return res
      .status(error.statusCode)
      .json(new ApiResponse(error.statusCode, null, error.message));
  }

  // Unknown server errors
  return res
    .status(500)
    .json(new ApiResponse(500, null, "Internal Server Error"));
};
