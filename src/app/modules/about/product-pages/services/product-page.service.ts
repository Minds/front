import { Injectable } from '@angular/core';
import {
  GetV2ProductPageBySlugGQL,
  GetV2ProductPageBySlugQuery,
  V2ProductPage,
  V2ProductPageProductPageDynamicZone,
} from '../../../../../graphql/generated.strapi';
import { Observable, catchError, map, of } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';

@Injectable({ providedIn: 'root' })
export class ProductPageService {
  constructor(private getV2ProductPageBySlugGQL: GetV2ProductPageBySlugGQL) {}

  public getProductPageBySlug(
    slug: string
  ): Observable<V2ProductPageProductPageDynamicZone[]> {
    return this.getV2ProductPageBySlugGQL.fetch({ slug: slug }).pipe(
      map(
        (
          result: ApolloQueryResult<GetV2ProductPageBySlugQuery>
        ): V2ProductPageProductPageDynamicZone[] => {
          return result.data.v2ProductPages?.data?.[0]?.attributes
            ?.productPage as V2ProductPageProductPageDynamicZone[];
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
