import { InMemoryCache } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';
import * as _ from 'lodash';

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        newsfeed: relayStylePagination(['limit', 'algorithm']),
      },
    },
  },
});
