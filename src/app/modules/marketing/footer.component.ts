import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import {
  Footer,
  GetFooterGQL,
  GetFooterQuery,
} from '../../../graphql/generated.strapi';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { STRAPI_URL } from '../../common/injection-tokens/url-injection-tokens';
import { isPlatformBrowser } from '@angular/common';

/**
 * Marketing footer component. Will conditionally load data from CMS if data is
 * not provided as an input.
 */
@Component({
  selector: 'm-marketing__footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.ng.scss'],
})
export class MarketingFooterComponent implements OnInit, OnDestroy {
  /** Whether data is loaded / ready */
  public readonly loaded$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * Footer data can be provided optionally. If not provided then data will be loaded
   * with a new GraphQL call on component init. This provides you the option to batch
   * the request for footer data in with other GraphQL queries for CMS data before
   * rendering this component - passing it via an input instead of making
   * duplicate calls for the data. This is useful for example when loading a product page,
   * so that you do not have to make two calls - you can include the request for
   * footer data in the query for the product page and pass it through.
   */
  @Input() public data: Footer;

  /** Alignment of legal section. */
  @Input() public alignLegalSection: 'left' | 'center' | 'right' = 'right';

  // subscriptions.
  private getFooterSubscription: Subscription;

  constructor(
    private getFooterGql: GetFooterGQL,
    @Inject(STRAPI_URL) public readonly strapiUrl,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!this.data && isPlatformBrowser(this.platformId)) {
      this.getFooterSubscription = this.getFooterGql
        .fetch()
        .pipe(take(1))
        .subscribe((result: ApolloQueryResult<GetFooterQuery>): void => {
          const footer: Footer = result.data.footer.data.attributes as Footer;

          if (!footer) {
            console.error('Failed to load footer');
            return;
          }

          this.data = footer;
          this.loaded$.next(true);
        });
    } else {
      this.loaded$.next(true);
    }
  }

  ngOnDestroy(): void {
    this.getFooterSubscription?.unsubscribe();
  }
}
