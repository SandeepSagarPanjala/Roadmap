import "dotenv/config";
import express from "express";
import { applyMiddlewares } from "./src/middlewares/setup.js";
import {
  notFoundMiddleware,
  globalErrorMiddleware,
} from "./src/middlewares/errorHandler.js";
import { startApolloServer } from "./src/graphql/apolloServer.js";

// Exported explicitly for Supertest/Vitest architecture seamlessly without port collision!
export const app = express();
const port = process.env.PORT || 3000;

const startServer = async () => {
  // 1. Apply all global configuration/middlewares in one elegant sweep!
  applyMiddlewares(app);

  // 2. Root healthcheck endpoint
  app.get("/", (req, res) => {
    res.send("WELCOME TO NODE API - POWERED ENTIRELY BY GRAPHQL!");
  });

  // 3. Bind GraphQL to the existing Express App safely
  await startApolloServer(app);

  // 4. Catch invalid physical URL routes (404)
  app.use(notFoundMiddleware);

  // 5. Catch application crashes globally
  app.use(globalErrorMiddleware);

  // 6. Physically boot the listener exactly once!
  app.listen(port, () => {
    console.log(`🚀 Base Server is running on port ${port}`);
    console.log(
      `🚀 GraphQL API perfectly live at http://localhost:${port}/graphql`,
    );
  });
};

startServer().catch((err) =>
  console.error("Critical Failure Booting Server:", err),
);
