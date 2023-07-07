import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { ConfigsService } from '../../../../common/services/configs.service';
import { GraphQLError } from 'graphql';
import { TokenMarketingService } from './token.service';
import { StrapiMetaService } from '../../../../common/services/strapi/strapi-meta.service';
import { STRAPI_URL } from '../../../../common/injection-tokens/url-injection-tokens';
import { ApolloQueryResult } from '@apollo/client/core';
import {
  ProductMarketingAttributes,
  ProductMarketingResponse,
} from '../../../../common/services/strapi/marketing-page/marketing-page.types';
import {
  StrapiAction,
  StrapiActionResolverService,
} from '../../../../common/services/strapi/strapi-action-resolver.service';

/**
 * Multi-page tokens marketing component
 */
@Component({
  selector: 'm-blockchainMarketing__token--v2',
  templateUrl: 'token.component.html',
  styleUrls: [
    './token.component.ng.scss',
    '../../../marketing/styles/markdown-style.ng.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockchainMarketingTokenV2Component
  extends AbstractSubscriberComponent
  implements OnInit, OnDestroy {
  public data: ProductMarketingAttributes;
  public loading: boolean = true;
  public errors: readonly GraphQLError[];

  public readonly cdnAssetsUrl: string;
  public readonly siteUrl: string;

  @ViewChild('topAnchor')
  readonly topAnchor: ElementRef;

  private copyDataSubscription: Subscription;

  constructor(
    protected router: Router,
    protected cd: ChangeDetectorRef,
    private service: TokenMarketingService,
    private strapiMeta: StrapiMetaService,
    private strapiActionResolver: StrapiActionResolverService,
    @Inject(STRAPI_URL) public strapiUrl: string,
    configs: ConfigsService
  ) {
    super();
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.siteUrl = configs.get('site_url');
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
        this.detectChanges();
      }
    );
  }

  ngOnDestroy(): void {
    this.copyDataSubscription?.unsubscribe();
  }

  /**
   * Resolve an action from a Strapi action button.
   * @param { StrapiAction } action - action to resolve.
   * @returns { void }
   */
  public resolveAction(action: StrapiAction): void {
    this.strapiActionResolver.resolve(action);
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
