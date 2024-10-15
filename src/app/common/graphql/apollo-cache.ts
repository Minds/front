import { InMemoryCache } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';
import * as _ from 'lodash';

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        newsfeed: relayStylePagination(['limit', 'algorithm']),
        giftCards: relayStylePagination([
          // Immutable fields used to derive a common cache key.
          'first',
          'ordering',
        ]),
        giftCardTransactionLedger: relayStylePagination(['giftCardGuid']),
        search: relayStylePagination([
          'limit',
          'query',
          'filter',
          'mediaType',
          'nsfw',
        ]),
        boosts: relayStylePagination(['targetLocation', 'first']),
        featuredEntities: relayStylePagination(['type', 'first']),
        reports: relayStylePagination(['first']),
        hashtagExclusions: relayStylePagination(['first']),
        usersByRole: relayStylePagination(['first', 'roleId']),
        invites: relayStylePagination(['first']),
        checkoutPage: relayStylePagination([
          'planId',
          'page',
          'timePeriod',
          'addonIds',
        ]),
        tenantAdminAnalyticsTable: relayStylePagination(['table']),
        chatRoomList: relayStylePagination(['first']),
        chatRoomInviteRequests: relayStylePagination(['first']),
        chatMessages: relayStylePagination(['first', 'roomId']),
        chatRoomMembers: relayStylePagination([
          'first',
          'roomId',
          'excludeSelf',
        ]),
      },
    },
  },
});
