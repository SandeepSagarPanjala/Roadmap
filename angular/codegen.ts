import type { CodegenConfig } from '@graphql-codegen/cli';

const graphQLUrl = 'http://localhost:3000/';

const config: CodegenConfig = {
  // 1. Connect straight to your running Pothos/Drizzle backend!
  schema: graphQLUrl + 'graphql',

  // 2. Discover all the hand-written decoupled UI Operation Files!
  documents: 'src/app/core/graphql/operations/**/*.graphql',

  // 3. Compile everything together into an enterprise-grade fully typed Angular SDK!
  generates: {
    'src/app/core/graphql/generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-apollo-angular'],
      config: {
        // We ensure strict Apollo class generation (GQL ending) that natively uses decorators
        // and provides the services at root (tree-shaking friendly in Angular!)
        addExplicitOverride: true,
        querySuffix: 'GQL',
        mutationSuffix: 'GQL',
        subscriptionSuffix: 'GQL',
      },
    },
  },
};

export default config;
