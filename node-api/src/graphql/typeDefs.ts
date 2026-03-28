export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    username: String!
    displayName: String
    isActive: Boolean!
    role: String!
  }

  type Query {
    hello: String!
    getUserByUsername(username: String!): User
    getAllUsers: [User]!
  }

  type Mutation {
    createUser(email: String!, username: String!, passwordHash: String!): User!
  }
`;
