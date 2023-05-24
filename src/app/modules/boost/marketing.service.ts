import { Injectable } from '@angular/core';
import { Apollo, QueryRef, gql } from 'apollo-angular';
import { MARKETING_PAGE_QUERY_FULL } from '../../common/services/strapi/marketing-page/marketing-page.constants';
import { MarketingAttributes } from '../../common/services/strapi/marketing-page/marketing-page.types';

// query to get page copy.
export const BOOST_MARKETING_PAGE_QUERY = gql`
  {
    boostMarketingPage {
      ${MARKETING_PAGE_QUERY_FULL}
    }
  }
`;

export type BoostMarketingPageResponse = {
  boostMarketingPage: {
    data: {
      attributes: MarketingAttributes;
    };
  };
};

/**
 * Service for the getting content from our CMS.
 */
@Injectable({ providedIn: 'root' })
export class BoostMarketingService {
  public readonly copyData: QueryRef<
    BoostMarketingPageResponse
  > = this.apollo.watchQuery<BoostMarketingPageResponse>({
    query: BOOST_MARKETING_PAGE_QUERY,
  });

  constructor(private apollo: Apollo) {}
}
