import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'https://feat-rbac-2663.oke.minds.io/api/graphql',
  // schema: 'http://localhost:8080/api/graphql', ojm put back
  documents: './src/**/*.engine.graphql',
  generates: {
    './src/graphql/generated.engine.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-apollo-angular'],
      config: {
        namedClient: 'default'
      }
    }
  }
}

export default config
