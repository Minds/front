import {
  APOLLO_NAMED_OPTIONS,
  APOLLO_OPTIONS,
  provideApollo,
  provideNamedApollo,
} from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { cache } from './apollo-cache';

import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { TransferState, makeStateKey } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { STRAPI_URL } from '../injection-tokens/url-injection-tokens';

const APOLLO_CACHE = new InjectionToken<InMemoryCache>('apollo-cache');
const STATE_KEY = makeStateKey<any>('apollo.state');

export const APOLLO_PROIVDERS = [
  {
    provide: APOLLO_CACHE,
    useValue: cache,
  },

  provideNamedApollo(() => {
    const httpLink = inject(HttpLink);
    const transferState = inject(TransferState);
    const platformId = inject(PLATFORM_ID);
    const strapiUrl = inject(STRAPI_URL);
    const cache = inject(APOLLO_CACHE);

    const isBrowser = isPlatformBrowser(platformId);

    if (isBrowser) {
      const state = transferState.get<any>(STATE_KEY, null);
      cache.restore(state);
    } else {
      transferState.onSerialize(STATE_KEY, () => {
        return cache.extract();
      });
      // Reset cache after extraction to avoid sharing between requests
      cache.reset();
    }

    return {
      strapi: {
        cache,
        link: httpLink.create({
          uri: strapiUrl + '/graphql',
        }),
        shouldBatch: true,
        ...(isBrowser ? { ssrForceFetchDelay: 200 } : { ssrMode: true }),
      },
      default: {
        cache,
        link: httpLink.create({
          uri: '/api/graphql',
        }),
        shouldBatch: true,
        ...(isBrowser ? { ssrForceFetchDelay: 200 } : { ssrMode: true }),
      },
    };
  }),
];
