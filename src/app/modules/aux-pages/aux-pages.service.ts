import { Inject, Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { STRAPI_URL } from '../../common/injection-tokens/url-injection-tokens';

// query to get aux page by url slug.
export const AUX_PAGE_QUERY = gql`
  query AuxPages($path: String!) {
    auxPages(filters: { slug: { eq: $path } }) {
      data {
        attributes {
          h1
          body
          slug
          updatedAt
          ogTitle
          ogDescription
          ogImage {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;

// image data input
export type ImageDataInput = {
  attributes: {
    url: string;
  };
};

// aux page input data.
export type AuxPageInput = {
  h1: string;
  body: string;
  slug: string;
  updatedAt: number;
  ogTitle: string;
  ogDescription: string;
  ogImage: {
    data: ImageDataInput[];
  };
};

/**
 * Service for the getting of aux page content from our CMS.
 */
@Injectable({ providedIn: 'root' })
export class AuxPagesService {
  // path to get aux page for.
  public readonly path$: BehaviorSubject<string> = new BehaviorSubject<string>(
    null
  );

  // whether request to CMS is mid-flight.
  public readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  // whether no data has been found in CMS.
  public readonly notFound$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  // Data from CMS - reload will be triggered on path change.
  private readonly copyData$: Observable<AuxPageInput> = this.path$.pipe(
    // filter out null paths, e.g. during init.
    filter(Boolean),
    // set loading state and reset not found state.
    tap(_ => {
      this.loading$.next(true);
      this.notFound$.next(false);
    }),
    // get content.
    switchMap(
      (path: string): Observable<ApolloQueryResult<any>> =>
        this.fetchContent(path)
    ),
    // parse result.
    map(
      (result: ApolloQueryResult<any>): AuxPageInput => {
        if (result.loading) {
          return null;
        }

        this.loading$.next(false);

        if (result.data.auxPages.data.length) {
          return result.data.auxPages.data[0].attributes ?? null;
        } else {
          this.notFound$.next(true);
          return null;
        }
      }
    ),
    // handle errors.
    catchError((e: unknown): Observable<never> => this.handleError(e))
  );

  // header copy data.
  public readonly headerCopy$: Observable<string> = this.copyData$.pipe(
    map((copyData: AuxPageInput) => copyData?.h1 ?? null)
  );

  // body copy data.
  public readonly bodyCopy$: Observable<string> = this.copyData$.pipe(
    map((copyData: AuxPageInput) => copyData?.body ?? null)
  );

  // updated at date data.
  public readonly updatedAtDateString$: Observable<
    string
  > = this.copyData$.pipe(
    map((copyData: AuxPageInput) =>
      copyData?.updatedAt
        ? new Date(copyData.updatedAt).toLocaleDateString()
        : null
    )
  );

  // og:title data.
  public readonly ogTitle$: Observable<string> = this.copyData$.pipe(
    map((copyData: AuxPageInput) => copyData?.ogTitle ?? null)
  );

  // og:description data.
  public readonly ogDescription$: Observable<string> = this.copyData$.pipe(
    map((copyData: AuxPageInput) => copyData?.ogDescription ?? null)
  );

  // og:image data.
  public readonly ogImage$: Observable<string> = this.copyData$.pipe(
    map((copyData: AuxPageInput) => {
      const imageData: ImageDataInput[] = copyData?.ogImage.data;
      if (imageData && imageData.length && imageData[0].attributes.url) {
        return this.strapiUrl + imageData[0].attributes.url;
      }
      return null;
    })
  );

  constructor(
    private apollo: Apollo,
    @Inject(STRAPI_URL) private strapiUrl: string
  ) {}

  /**
   * Fetch content from CMS.
   * @param { string } path - path to get content for.
   * @returns { Observable<ApolloQueryResult<any>> } result.
   */
  private fetchContent(path: string): Observable<ApolloQueryResult<any>> {
    return this.apollo.watchQuery({
      query: AUX_PAGE_QUERY,
      variables: {
        path: path,
      },
    }).valueChanges;
  }

  /**
   * Handle any error thrown in stream.
   * @param { unknown } e - error.
   * @returns { Observable<never> } Observable that never emits.
   */
  private handleError(e: unknown): Observable<never> {
    console.error(e);
    this.loading$.next(false);
    this.notFound$.next(true);
    return EMPTY;
  }
}
