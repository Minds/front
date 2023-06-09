import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { ConfigsService } from '../../common/services/configs.service';
import { Session } from '../../services/session';
import { Subscription } from 'rxjs';
import { GraphQLError } from 'graphql';
import { ProMarketingService } from './marketing.service';
import { ApolloQueryResult } from '@apollo/client/core';
import { StrapiMetaService } from '../../common/services/strapi/strapi-meta.service';
import { STRAPI_URL } from '../../common/injection-tokens/url-injection-tokens';
import {
  ProductMarketingAttributes,
  ProductMarketingResponse,
} from '../../common/services/strapi/marketing-page/marketing-page.types';
import {
  StrapiAction,
  StrapiActionResolverService,
} from '../../common/services/strapi/strapi-action-resolver.service';

/**
 * Marketing page that describes the benefits of upgrading to Pro
 */
@Component({
  selector: 'm-pro__marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [
    'marketing.component.ng.scss',
    '../marketing/styles/markdown-style.ng.scss',
  ],
})
export class ProMarketingComponent implements OnInit, OnDestroy {
  public data: ProductMarketingAttributes;
  public loading: boolean = true;
  public errors: readonly GraphQLError[];

  readonly cdnAssetsUrl: string;

  @ViewChild('topAnchor')
  readonly topAnchor: ElementRef;

  private copyDataSubscription: Subscription;

  constructor(
    protected router: Router,
    protected session: Session,
    private service: ProMarketingService,
    private strapiMeta: StrapiMetaService,
    private cd: ChangeDetectorRef,
    private strapiActionResolver: StrapiActionResolverService,
    @Inject(STRAPI_URL) public strapiUrl: string,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    this.copyDataSubscription = this.service.copyData.valueChanges.subscribe(
      (result: ApolloQueryResult<ProductMarketingResponse>): void => {
        this.data = result.data.productPages.data[0].attributes;
        this.loading = result.loading;
        this.errors = result.errors;
        if (this.data.metadata) {
          this.strapiMeta.apply(this.data.metadata);
        }

        this.cd.markForCheck();
        this.cd.detectChanges();
      }
    );
  }

  ngOnDestroy(): void {
    this.copyDataSubscription?.unsubscribe();
  }

  goToSettings() {
    const username = this.session.getLoggedInUser().username;
    this.router.navigate([`/settings/pro_canary/${username}`]);
  }

  /**
   * Resolve an action from a Strapi action button.
   * @param { StrapiAction } action - action to resolve.
   * @returns { void }
   */
  public resolveAction(action: StrapiAction): void {
    this.strapiActionResolver.resolve(action);
  }
}
