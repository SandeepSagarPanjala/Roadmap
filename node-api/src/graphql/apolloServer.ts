import { ApolloServer } from '@apollo/server';
// @ts-ignore
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { typeDefs } from './typeDefs.js';
import { resolvers } from './resolvers.js';

// We isolate Apollo Startup to prevent breaking Supertest execution natively
export const startApolloServer = async (app: express.Application) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  
  // Attach GraphQL Endpoint onto Express pipeline
  app.use('/graphql', expressMiddleware(server));
  
  return server;
};
