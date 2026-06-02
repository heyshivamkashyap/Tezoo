import rateLimit from "express-rate-limit";
import { ApiResponse } from "../utils/ApiResponse";

export const rateLimitMiddleware = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // 100 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,

  handler: (_req, res) => {
    res
      .status(429)
      .json(
        new ApiResponse(
          429,
          null,
          "Too many requests. Please try again later.",
        ),
      );
  },
});
