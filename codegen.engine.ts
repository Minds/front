import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'https://feat-tenant-domain-e2651.oke.minds.io/api/graphql',
  // schema: 'http://localhost:8080/api/graphql', ojm
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
