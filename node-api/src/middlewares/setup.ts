import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import cookieParser from "cookie-parser";
import { MESSAGES } from "../constants/messages.js";
import morgan from "morgan";

export const applyMiddlewares = (app: express.Application) => {
  const isProduction = process.env.NODE_ENV === "production";

  // HTTP request logging with Morgan. In production, use the 'combined' format for detailed logs; in development, use 'dev' for concise output.
  app.use(morgan(isProduction ? "combined" : "dev"));

  // Helmet helps secure your Node.js application by setting various HTTP headers.
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: isProduction ? undefined : false,
    }),
  );

  // Apply rate limiting middleware to all requests.
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per window
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      status: 429,
      message: MESSAGES.RATE_LIMIT.TOO_MANY_REQUESTS,
    },
  });
  app.use(limiter);

  // Enable Cross-Origin requests decoupled completely from hardcoded domains
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:4200"];
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true, // Crucial for HttpOnly Cookies!
    }),
  );

  // Parse HttpOnly Cookies
  app.use(cookieParser());

  // Parse incoming JSON payloads
  app.use(express.json());

  // Compress responses over 1KB
  app.use(
    compression({
      threshold: 1024,
    }),
  );
};
