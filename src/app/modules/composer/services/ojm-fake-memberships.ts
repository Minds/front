export const ojmFakeMembershipsQuery = {
  data: {
    __typename: 'Query',
    siteMemberships: [
      {
        __typename: 'SiteMembership',
        id: '1',
        membershipGuid: 'guid-12345',
        membershipName: 'Basic Plan',
        membershipDescription: 'Access to basic features.',
        membershipPriceInCents: 9900,
        priceCurrency: 'USD',
        membershipBillingPeriod: 'MONTHLY',
        membershipPricingModel: 'RECURRING',
        roles: [
          {
            __typename: 'Role',
            id: 1,
            name: 'User',
          },
        ],
        groups: [
          {
            __typename: 'GroupNode',
            guid: 'group-123',
            name: 'Basic Group',
            membersCount: 100,
            legacy: 'no',
          },
        ],
      },
      {
        __typename: 'SiteMembership',
        id: '2',
        membershipGuid: 'guid-67890',
        membershipName: 'Premium Plan',
        membershipDescription: 'Access to all premium features.',
        membershipPriceInCents: 19900,
        priceCurrency: 'USD',
        membershipBillingPeriod: 'YEARLY',
        membershipPricingModel: 'RECURRING',
        roles: [
          {
            __typename: 'Role',
            id: 2,
            name: 'Premium User',
          },
        ],
        groups: [
          {
            __typename: 'GroupNode',
            guid: 'group-456',
            name: 'Premium Group',
            membersCount: 250,
            legacy: 'no',
          },
        ],
      },
      {
        __typename: 'SiteMembership',
        id: '3',
        membershipGuid: 'guid-11223',
        membershipName: 'Pro Plan',
        membershipDescription: 'For the professionals.',
        membershipPriceInCents: 29900,
        priceCurrency: 'USD',
        membershipBillingPeriod: 'MONTHLY',
        membershipPricingModel: 'RECURRING',
        roles: [
          {
            __typename: 'Role',
            id: 3,
            name: 'Pro User',
          },
        ],
        groups: [
          {
            __typename: 'GroupNode',
            guid: 'group-789',
            name: 'Pro Group',
            membersCount: 500,
            legacy: 'no',
          },
        ],
      },
      {
        __typename: 'SiteMembership',
        id: '4',
        membershipGuid: 'guid-44556',
        membershipName: 'Elite Plan',
        membershipDescription: 'All-access pass to exclusive content.',
        membershipPriceInCents: 49900,
        priceCurrency: 'USD',
        membershipBillingPeriod: 'YEARLY',
        membershipPricingModel: 'RECURRING',
        roles: [
          {
            __typename: 'Role',
            id: 4,
            name: 'Elite Member',
          },
        ],
        groups: [
          {
            __typename: 'GroupNode',
            guid: 'group-101',
            name: 'Elite Circle',
            membersCount: 75,
            legacy: 'yes',
          },
        ],
      },
      {
        __typename: 'SiteMembership',
        id: '5',
        membershipGuid: 'guid-77889',
        membershipName: 'Starter Plan',
        membershipDescription: 'Entry-level membership for new users.',
        membershipPriceInCents: 4900,
        priceCurrency: 'USD',
        membershipBillingPeriod: 'MONTHLY',
        membershipPricingModel: 'RECURRING',
        roles: [
          {
            __typename: 'Role',
            id: 5,
            name: 'Starter Member',
          },
        ],
        groups: [
          {
            __typename: 'GroupNode',
            guid: 'group-202',
            name: 'Beginners Club',
            membersCount: 200,
            legacy: 'no',
          },
        ],
      },
    ],
  },
};
