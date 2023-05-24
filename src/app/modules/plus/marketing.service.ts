import { Injectable } from '@angular/core';
import { Apollo, QueryRef, gql } from 'apollo-angular';
import { MARKETING_PAGE_QUERY_FULL } from '../../common/services/strapi/marketing-page/marketing-page.constants';
import { MarketingAttributes } from '../../common/services/strapi/marketing-page/marketing-page.types';

// query to get page copy.
export const PLUS_MARKETING_PAGE_QUERY = gql`
  {
    plusMarketingPage {
      ${MARKETING_PAGE_QUERY_FULL}
    }
  }
`;

export type PlusMarketingPageResponse = {
  plusMarketingPage: {
    data: {
      attributes: MarketingAttributes;
    };
  };
};

/**
 * Service for the getting content from our CMS.
 */
@Injectable({ providedIn: 'root' })
export class PlusMarketingService {
  public readonly copyData: QueryRef<
    PlusMarketingPageResponse
  > = this.apollo.watchQuery<PlusMarketingPageResponse>({
    query: PLUS_MARKETING_PAGE_QUERY,
  });

  constructor(private apollo: Apollo) {}
}
