import { Injectable } from '@angular/core';
import {
  GetV2ProductPageBySlugGQL,
  GetV2ProductPageBySlugQuery,
  V2ProductPage,
} from '../../../../../graphql/generated.strapi';
import { Observable, catchError, map, of } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';

@Injectable({ providedIn: 'root' })
export class ProductPageService {
  constructor(private getV2ProductPageBySlugGQL: GetV2ProductPageBySlugGQL) {}

  public getProductPageBySlug(slug: string): Observable<V2ProductPage> {
    return this.getV2ProductPageBySlugGQL.fetch({ slug: slug }).pipe(
      map(
        (
          result: ApolloQueryResult<GetV2ProductPageBySlugQuery>
        ): V2ProductPage => {
          return result.data.v2ProductPages?.data?.[0]
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
