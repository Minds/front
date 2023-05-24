import { Injectable } from '@angular/core';
import { Apollo, QueryRef, gql } from 'apollo-angular';
import { MARKETING_PAGE_QUERY_FULL } from '../../../common/services/strapi/marketing-page/marketing-page.constants';
import { MarketingAttributes } from '../../../common/services/strapi/marketing-page/marketing-page.types';

// query to get page copy.
export const PAY_MARKETING_PAGE_QUERY = gql`
  {
    payMarketingPage {
      ${MARKETING_PAGE_QUERY_FULL}
    }
  }
`;

export type PayMarketingPageResponse = {
  payMarketingPage: {
    data: {
      attributes: MarketingAttributes;
    };
  };
};

/**
 * Service for the getting content from our CMS.
 */
@Injectable({ providedIn: 'root' })
export class PayMarketingService {
  public readonly copyData: QueryRef<
    PayMarketingPageResponse
  > = this.apollo.watchQuery<PayMarketingPageResponse>({
    query: PAY_MARKETING_PAGE_QUERY,
  });

  constructor(private apollo: Apollo) {}
}
