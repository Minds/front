import { Injectable } from '@angular/core';
import { Apollo, QueryRef, gql } from 'apollo-angular';
import { PRODUCT_MARKETING_PAGE_QUERY_FULL } from '../../common/services/strapi/marketing-page/marketing-page.constants';
import { ProductMarketingAttributes } from '../../common/services/strapi/marketing-page/marketing-page.types';

// query to get page copy.
export const BOOST_MARKETING_PAGE_QUERY = gql`
  {
    boostMarketingPage {
      ${PRODUCT_MARKETING_PAGE_QUERY_FULL}
    }
  }
`;

export type BoostMarketingPageResponse = {
  boostMarketingPage: {
    data: {
      attributes: ProductMarketingAttributes;
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
