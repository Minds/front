import type { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
  schema: 'http://localhost:1337/graphql',
  documents: [
    './src/**/*.strapi.graphql'
  ],
  generates: {
    './src/graphql/generated.strapi.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-apollo-angular'],
      config: {
        namedClient: 'strapi'
      }
    }
  }
}

export default config
