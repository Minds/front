import { Injectable } from '@angular/core';
import {
  GetV2ProductPageBySlugGQL,
  GetV2ProductPageBySlugQuery,
  V2ProductPage,
} from '../../../../../graphql/generated.strapi';
import { Observable, catchError, map, of } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';

/**
 * Service for product pages - contains call to get a product page by a given URL slug.
 */
@Injectable({ providedIn: 'root' })
export class ProductPageService {
  constructor(private getV2ProductPageBySlugGQL: GetV2ProductPageBySlugGQL) {}

  /**
   * Gets a product page by a given URL slug.
   * @param { string } slug - URL slug.
   * @returns { Observable<V2ProductPage> } - product page - null if no matching page was found.
   */
  public getProductPageBySlug(slug: string): Observable<V2ProductPage> {
    return this.getV2ProductPageBySlugGQL.fetch({ slug: slug }).pipe(
      map(
        (
          result: ApolloQueryResult<GetV2ProductPageBySlugQuery>
        ): V2ProductPage => {
          return result?.data?.v2ProductPages?.data?.[0]
            ?.attributes as V2ProductPage;
        }
      ),
      catchError(
        (e: unknown): Observable<null> => {
          console.error(e);
          return of(null);
        }
      )
    );
  }
}
