import "dotenv/config"; // Load environment variables from .env file immediately
import express from "express";

import { applyGlobalMiddlewares } from "./src/middlewares/setup.js";
import {
  notFoundMiddleware,
  globalErrorMiddleware,
} from "./src/middlewares/errorHandler.js";

import userRoutes from "./src/routes/userRoutes.js";

const app = express();

// 1. Apply all global configuration/middlewares in one elegant sweep!
applyGlobalMiddlewares(app);

// 2. Root healthcheck endpoint
app.get("/", (req, res) => {
  res.send("WELCOME TO NODE API");
});

// 3. Register your modular routes/controllers
app.use("/users", userRoutes);

// 4. Catch invalid routes (404)
app.use(notFoundMiddleware);

// 5. Catch application crashes (Global Exception Handler)
app.use(globalErrorMiddleware);

// 6. Mount the server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
