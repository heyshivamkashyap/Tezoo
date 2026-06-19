import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error.middleware";

// import routes
import healthRoutes from "./routes/health.route";
import authRoutes from "./routes/auth.routes";
import { rateLimitMiddleware } from "./middleware/rate-limit.middleware";

const app: Express = express();

// Sets various HTTP headers for security
app.use(helmet());
app.use(hpp());

// Rate Limiting - Prevents brute-force & DDoS attacks
app.use(rateLimitMiddleware);

// Cors: Allow only your frontend
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(",").map((origin) => origin),
    credentials: true,
  }),
);

// parse request body
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// parse cookies
app.use(cookieParser());

// logging (dev only)
if (env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// compress response
app.use(compression());

// routes declaration
app.use("/api/v1/healthcheck", healthRoutes);
app.use("/api/v1/auth", authRoutes);

// Global Error Handler (Must be the last middleware)
app.use(errorHandler);

export default app;
