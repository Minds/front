import { Injectable } from '@angular/core';
import { Apollo, QueryRef, gql } from 'apollo-angular';
import { MARKETING_PAGE_QUERY_FULL } from '../../../../common/services/strapi/marketing-page/marketing-page.constants';
import { MarketingAttributes } from '../../../../common/services/strapi/marketing-page/marketing-page.types';

// query to get page copy.
export const REWARDS_MARKETING_PAGE_QUERY = gql`
  {
    rewardsMarketingPage {
      ${MARKETING_PAGE_QUERY_FULL}
    }
  }
`;

export type RewardsMarketingPageResponse = {
  rewardsMarketingPage: {
    data: {
      attributes: MarketingAttributes;
    };
  };
};

/**
 * Service for the getting content from our CMS.
 */
@Injectable({ providedIn: 'root' })
export class RewardsMarketingService {
  public readonly copyData: QueryRef<
    RewardsMarketingPageResponse
  > = this.apollo.watchQuery<RewardsMarketingPageResponse>({
    query: REWARDS_MARKETING_PAGE_QUERY,
  });

  constructor(private apollo: Apollo) {}
}
