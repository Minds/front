import { Injectable } from '@angular/core';
import { Apollo, QueryRef, gql } from 'apollo-angular';
import { PRODUCT_MARKETING_PAGE_QUERY_FULL } from '../../../common/services/strapi/marketing-page/marketing-page.constants';
import { ProductMarketingAttributes } from '../../../common/services/strapi/marketing-page/marketing-page.types';

// query to get page copy.
export const NODES_MARKETING_PAGE_QUERY = gql`
  {
    nodesMarketingPage {
      ${PRODUCT_MARKETING_PAGE_QUERY_FULL}
    }
  }
`;

export type NodesMarketingPageResponse = {
  nodesMarketingPage: {
    data: {
      attributes: ProductMarketingAttributes;
    };
  };
};

/**
 * Service for the getting content from our CMS.
 */
@Injectable({ providedIn: 'root' })
export class NodesMarketingService {
  public readonly copyData: QueryRef<
    NodesMarketingPageResponse
  > = this.apollo.watchQuery<NodesMarketingPageResponse>({
    query: NODES_MARKETING_PAGE_QUERY,
  });

  constructor(private apollo: Apollo) {}
}
