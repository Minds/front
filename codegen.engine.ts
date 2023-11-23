import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'https://c9f0f895fb98ab9159f51fd0297e236d.networks.oke.minds.io/api/graphql',
  // ojm schema: 'http://localhost:8080/api/graphql',
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
