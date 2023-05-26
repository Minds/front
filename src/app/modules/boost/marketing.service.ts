import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { PRODUCT_PAGE_QUERY_FULL } from '../../common/services/strapi/marketing-page/marketing-page.constants';
import { ProductMarketingResponse } from '../../common/services/strapi/marketing-page/marketing-page.types';

/**
 * Service for the getting content from our CMS.
 */
@Injectable({ providedIn: 'root' })
export class BoostMarketingService {
  public readonly copyData: QueryRef<
    ProductMarketingResponse
  > = this.apollo.watchQuery<ProductMarketingResponse>({
    query: PRODUCT_PAGE_QUERY_FULL,
    variables: {
      slug: 'boost',
    },
  });

  constructor(private apollo: Apollo) {}
}
