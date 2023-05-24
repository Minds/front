import { Injectable } from '@angular/core';
import { Apollo, QueryRef, gql } from 'apollo-angular';
import { MARKETING_PAGE_QUERY_FULL } from '../../common/services/strapi/marketing-page/marketing-page.constants';
import { MarketingAttributes } from '../../common/services/strapi/marketing-page/marketing-page.types';

// query to get page copy.
export const PRO_MARKETING_PAGE_QUERY = gql`
  {
    proMarketingPage {
      ${MARKETING_PAGE_QUERY_FULL}
    }
  }
`;

export type ProMarketingPageResponse = {
  proMarketingPage: {
    data: {
      attributes: MarketingAttributes;
    };
  };
};

/**
 * Service for the getting of content from our CMS.
 */
@Injectable({ providedIn: 'root' })
export class ProMarketingService {
  public readonly copyData: QueryRef<
    ProMarketingPageResponse
  > = this.apollo.watchQuery<ProMarketingPageResponse>({
    query: PRO_MARKETING_PAGE_QUERY,
  });

  constructor(private apollo: Apollo) {}
}
