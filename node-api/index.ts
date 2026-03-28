import { app } from "./app.js";
import { startApolloServer } from "./src/graphql/apolloServer.js";

const port = process.env.PORT || 3000;

const startServer = async () => {
  // Bind GraphQL to the existing Express App safely
  await startApolloServer(app);

  app.listen(port, () => {
    console.log(`🚀 Base Server is running on port ${port}`);
    console.log(`🚀 GraphQL API perfectly live at http://localhost:${port}/graphql`);
  });
};

startServer().catch((err) => console.error("Critical Failure Booting Server:", err));
