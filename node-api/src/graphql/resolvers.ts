import { getAllUsers, addUser, getUserByUsername } from "../services/userService.js";
import { GraphQLResolveInfo } from "graphql";

export const resolvers = {
  Query: {
    hello: () => "Welcome to the Roadmap GraphQL API!",
    
    // The famous 4 Parameters: Parent, Args, Context, and INFO!
    getAllUsers: async (_parent: any, _args: any, _context: any, info: GraphQLResolveInfo) => {
      const requestedFields = info.fieldNodes[0].selectionSet?.selections.map(
        (selection: any) => selection.name.value
      ) || [];

      const users = await getAllUsers(requestedFields);
      return users;
    },
    
    // The newly exposed, perfectly optimized Query using the AST Info parameter!
    getUserByUsername: async (_parent: any, args: { username: string }, _context: any, info: GraphQLResolveInfo) => {
      // 1. We read the Angular App's exact shopping list from the AST tree
      const requestedFields = info.fieldNodes[0].selectionSet?.selections.map(
        (selection: any) => selection.name.value
      ) || [];
      
      // 2. We hand both the Username AND the Shopping List securely down to Drizzle
      return await getUserByUsername(args.username, requestedFields);
    }
  },
  
  Mutation: {
    createUser: async (_: any, args: any) => {
      // Map GraphQL arguments straight down into Postgres columns sequentially
      // addUser(displayName, username, passwordHash, email)
      const newUser = await addUser(
        null, 
        args.username, 
        args.passwordHash, 
        args.email
      );
      
      return newUser;
    }
  }
};
