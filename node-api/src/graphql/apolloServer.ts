import { ApolloServer } from '@apollo/server';
// @ts-ignore
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { schema } from './schema.js';
import jwt from 'jsonwebtoken';

// We isolate Apollo Startup to prevent breaking Supertest execution natively
export const startApolloServer = async (app: express.Application) => {
  const server = new ApolloServer({
    // We completely deleted typeDefs and resolvers! 
    // We literally just hand Apollo the compiled Pothos RAM map!
    schema,
  });

  await server.start();
  
  // Attach GraphQL Endpoint onto Express pipeline and forward physical HTTP objects
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req, res }: { req: express.Request; res: express.Response }) => {
      let currentUser = null;

      // 1. The industry standard "Bearer" token extraction
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          // If the token is valid, we inject the decoded JWT payload into the Context!
          currentUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        } catch (err) {
          // If the token is expired/invalid, we silently ignore it and leave currentUser as null.
          // This elegantly allows them to still use public queries like login!
        }
      }

      // 2. The entire GraphQL API now perfectly understands who is making the request globally!
      return { req, res, user: currentUser };
    }
  }));
  
  return server;
};
