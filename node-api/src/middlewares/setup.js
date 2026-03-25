import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import compression from "compression";

export const applyGlobalMiddlewares = (app) => {
  // HTTP request logger middleware
  const isProduction = process.env.NODE_ENV === "production";
  app.use(morgan(isProduction ? "combined" : "dev"));

  // Helmet helps secure your Node.js application by setting various HTTP headers.
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
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
      message:
        "Too many requests from this IP, please try again after 15 minutes",
    },
  });
  app.use(limiter);

  // Enable Cross-Origin requests
  app.use(cors());

  // Parse incoming JSON payloads
  app.use(express.json());

  // Compress responses over 1KB
  app.use(
    compression({
      threshold: 1024,
    }),
  );
};
