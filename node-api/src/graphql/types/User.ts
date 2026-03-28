import { builder } from '../builder.js';
import { users } from '../../db/schema.js';
import { getAllUsers, getUserByUsername, addUser } from '../../services/userService.js';
import { GraphQLResolveInfo } from 'graphql';

export type UserType = typeof users.$inferSelect;

// 1. We build the Secure Public Menu (Object)
export const UserObject = builder.objectRef<UserType>('User').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    username: t.exposeString('username'),
    email: t.exposeString('email', { nullable: true }),
    displayName: t.exposeString('displayName', { nullable: true }),
    role: t.exposeString('role', { nullable: true }),
    isActive: t.exposeBoolean('isActive', { nullable: true }),
  }),
});

// 2. We attach the Resolvers strictly tied to Users
builder.queryFields((t) => ({
  getAllUsers: t.field({
    type: [UserObject],
    authScopes: { auth: true }, // The Global Scope Wall natively blocking all Guests!
    resolve: async (parent, args, ctx, info: GraphQLResolveInfo) => {
      const requestedFields = info.fieldNodes[0].selectionSet?.selections.map(
        (selection: any) => selection.name.value
      ) || [];
      const data = await getAllUsers(requestedFields);
      return data as UserType[];
    },
  }),
  
  getUserByUsername: t.field({
    type: UserObject,
    nullable: true,
    authScopes: { auth: true }, // The Global Scope Wall natively blocking all Guests!
    args: { username: t.arg.string({ required: true }) },
    resolve: async (parent, args, ctx, info: GraphQLResolveInfo) => {
      const requestedFields = info.fieldNodes[0].selectionSet?.selections.map(
        (selection: any) => selection.name.value
      ) || [];
      const data = await getUserByUsername(args.username, requestedFields);
      return data as UserType | null;
    },
  }),
}));

import { z } from 'zod'; // Zod is the modern, type-safe version of Joi!
import { VALIDATION_MESSAGES } from '../../constants/messages.js';

// 3. Attach Mutations (Creating Data)
builder.mutationFields((t) => ({
  addUser: t.field({
    type: UserObject,
    args: {
      // THE MAGIC OF POTHOS VALIDATION! 
      // Joi is completely dead! Validation strictly enforces mathematically robust Zod rules natively!
      username: t.arg.string({ 
        required: true, 
        validate: z.string().min(3, VALIDATION_MESSAGES.USER.USERNAME_MIN) 
      }),
      email: t.arg.string({ 
        required: true, 
        validate: z.string().email(VALIDATION_MESSAGES.USER.EMAIL_INVALID) 
      }),
      password: t.arg.string({ 
        required: true, 
        validate: z.string().min(6, VALIDATION_MESSAGES.USER.PASSWORD_MIN) 
      }),
      displayName: t.arg.string({ 
        required: false, 
        validate: z.string().min(3, VALIDATION_MESSAGES.USER.DISPLAY_NAME_MIN).optional() 
      }),
    },
    resolve: async (parent, args) => {
      // 1. Zod completely validated everything above independently!
      // If we reach this line of code, the Data is 100% mathematically flawless!

      // 2. We MUST cryptographically hash the perfectly validated password!
      const bcrypt = await import("bcrypt");
      const hashedPassword = await bcrypt.hash(args.password, 10);
      
      // 3. We insert perfectly strongly-typed attributes straight into Drizzle!
      const newUser = await addUser({
        username: args.username,
        email: args.email,
        displayName: args.displayName || args.username,
        passwordHash: hashedPassword,
      });
      
      return newUser as UserType;
    }
  })
}));
