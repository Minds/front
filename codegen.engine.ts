import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'https://olivia.oke.minds.io/api/graphql',
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
