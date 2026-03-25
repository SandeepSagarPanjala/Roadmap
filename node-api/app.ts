import "dotenv/config";
import express from "express";

import { applyGlobalMiddlewares } from "./src/middlewares/setup.js";
import {
  notFoundMiddleware,
  globalErrorMiddleware,
} from "./src/middlewares/errorHandler.js";

import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

export const app = express();

// 1. Apply all global configuration/middlewares in one elegant sweep!
applyGlobalMiddlewares(app);

// 2. Root healthcheck endpoint
app.get("/", (req, res) => {
  res.send("WELCOME TO NODE API");
});

// 3. Register your modular routes/controllers under the /api prefix
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// 4. Catch invalid routes (404)
app.use(notFoundMiddleware);

// 5. Catch application crashes (Global Exception Handler)
app.use(globalErrorMiddleware);
