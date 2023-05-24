import { Injectable } from '@angular/core';
import { Apollo, QueryRef, gql } from 'apollo-angular';
import { MARKETING_PAGE_QUERY_FULL } from '../../../../common/services/strapi/marketing-page/marketing-page.constants';
import { MarketingAttributes } from '../../../../common/services/strapi/marketing-page/marketing-page.types';

// query to get page copy.
export const TOKEN_MARKETING_PAGE_QUERY = gql`
  {
    tokenMarketingPage {
      ${MARKETING_PAGE_QUERY_FULL}
    }
  }
`;

export type TokenMarketingPageResponse = {
  tokenMarketingPage: {
    data: {
      attributes: MarketingAttributes;
    };
  };
};

/**
 * Service for the getting content from our CMS.
 */
@Injectable({ providedIn: 'root' })
export class TokenMarketingService {
  public readonly copyData: QueryRef<
    TokenMarketingPageResponse
  > = this.apollo.watchQuery<TokenMarketingPageResponse>({
    query: TOKEN_MARKETING_PAGE_QUERY,
  });

  constructor(private apollo: Apollo) {}
}
