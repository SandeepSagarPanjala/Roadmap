import SchemaBuilder from '@pothos/core';
import ValidationPlugin from '@pothos/plugin-validation';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import { Request, Response } from 'express';

// We register exactly ONE instance of the Validation engine globally!
export const builder = new SchemaBuilder<{
  Context: { 
    req: Request; 
    res: Response;
    user?: any; // Informing Pothos that a JWT user payload might securely exist!
  };
  AuthScopes: {
    auth: boolean;
  };
}>({
  plugins: [ScopeAuthPlugin, ValidationPlugin],
  // @ts-ignore - Explicitly silencing SchemaBuilder plugin merging bugs
  authScopes: async (context) => ({
    // This executes on every request and perfectly binds 'auth' to whether extracting JWT succeeded!
    auth: !!context.user,
  }),
});
