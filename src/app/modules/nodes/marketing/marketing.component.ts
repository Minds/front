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
import { ConfigsService } from '../../../common/services/configs.service';
import { NodesMarketingService } from './marketing.service';
import { StrapiMetaService } from '../../../common/services/strapi/strapi-meta.service';
import { STRAPI_URL } from '../../../common/injection-tokens/url-injection-tokens';
import { ApolloQueryResult } from '@apollo/client/core';
import { Subscription } from 'rxjs';
import { GraphQLError } from 'graphql';
import {
  ProductMarketingAttributes,
  ProductMarketingResponse,
} from '../../../common/services/strapi/marketing-page/marketing-page.types';
import {
  StrapiAction,
  StrapiActionResolverService,
} from '../../../common/services/strapi/strapi-action-resolver.service';

/**
 * The marketing page for nodes
 *
 * See it at /nodes
 */
@Component({
  selector: 'm-nodes__marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../../marketing/styles/markdown-style.ng.scss'],
})
export class NodesMarketingComponent implements OnInit, OnDestroy {
  public data: ProductMarketingAttributes;
  public loading: boolean = true;
  public errors: readonly GraphQLError[];
  readonly cdnAssetsUrl: string;

  @ViewChild('topAnchor')
  readonly topAnchor: ElementRef;

  private copyDataSubscription: Subscription;

  constructor(
    protected cd: ChangeDetectorRef,
    configs: ConfigsService,
    private service: NodesMarketingService,
    private strapiMeta: StrapiMetaService,
    private strapiActionResolver: StrapiActionResolverService,
    @Inject(STRAPI_URL) public strapiUrl: string
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

  action() {
    window.open(
      `mailto:info@minds.com?subject=${encodeURIComponent('re: Minds Nodes')}`,
      'minds_mail'
    );
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
