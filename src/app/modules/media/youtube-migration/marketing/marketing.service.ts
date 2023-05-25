import { Injectable } from '@angular/core';
import { Apollo, QueryRef, gql } from 'apollo-angular';
import { PRODUCT_MARKETING_PAGE_QUERY_FULL } from '../../../../common/services/strapi/marketing-page/marketing-page.constants';
import { ProductMarketingAttributes } from '../../../../common/services/strapi/marketing-page/marketing-page.types';

// query to get page copy.
export const YOUTUBE_MIGRATION_MARKETING_PAGE_QUERY = gql`
  {
    youtubeMigrationMarketingPage {
      ${PRODUCT_MARKETING_PAGE_QUERY_FULL}
    }
  }
`;

export type YoutubeMigrationMarketingPageResponse = {
  youtubeMigrationMarketingPage: {
    data: {
      attributes: ProductMarketingAttributes;
    };
  };
};

/**
 * Service for the getting of content from our CMS.
 */
@Injectable({ providedIn: 'root' })
export class YoutubeMigrationMarketingService {
  public readonly copyData: QueryRef<
    YoutubeMigrationMarketingPageResponse
  > = this.apollo.watchQuery<YoutubeMigrationMarketingPageResponse>({
    query: YOUTUBE_MIGRATION_MARKETING_PAGE_QUERY,
  });

  constructor(private apollo: Apollo) {}
}
