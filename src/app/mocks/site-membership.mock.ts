import {
  SiteMembership,
  SiteMembershipBillingPeriodEnum,
  SiteMembershipPricingModelEnum,
} from '../../graphql/generated.engine';
import { groupMock } from './responses/group.mock';

export const siteMembershipMock: SiteMembership = {
  __typename: 'SiteMembership',
  id: 'mockId',
  membershipBillingPeriod: SiteMembershipBillingPeriodEnum.Monthly,
  membershipGuid: '12313123213123123',
  membershipName: 'mockMembershipName',
  membershipPriceInCents: 100,
  membershipPricingModel: SiteMembershipPricingModelEnum.OneTime,
  priceCurrency: 'USD',
  archived: false,
  groups: [
    {
      guid: '1231',
      name: 'name1',
      urn: 'urn:group:1231',
      id: '1231',
      legacy: JSON.stringify(groupMock),
      nsfw: [],
      nsfwLock: [],
      membersCount: 0,
      timeCreated: Date.now(),
      timeCreatedISO8601: Date.now().toString(),
    },
    {
      guid: '1232',
      name: 'name2',
      urn: 'urn:group:1232',
      id: '1232',
      legacy: JSON.stringify({
        ...groupMock,
        guid: '1232',
        name: 'name2',
        urn: 'urn:group:1232',
      }),
      nsfw: [],
      nsfwLock: [],
      membersCount: 0,
      timeCreated: Date.now(),
      timeCreatedISO8601: Date.now().toString(),
    },
  ],
  roles: [
    { name: 'MODERATOR', id: 2, permissions: [] },
    { name: 'VERIFIED', id: 3, permissions: [] },
  ],
  membershipDescription: 'mockMembershipDescription',
  isExternal: false,
};
