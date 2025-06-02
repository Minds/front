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
import { ConfigsService } from '../../../../common/services/configs.service';
import { BlockchainMarketingLinksService } from './blockchain-marketing-links.service';
import { GraphQLFormattedError } from 'graphql';
import { RewardsMarketingService } from './rewards.service';
import { Subscription } from 'rxjs';
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
 * Rewards marketing page
 */
@Component({
  selector: 'm-blockchainMarketing__rewards--v2',
  templateUrl: 'rewards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [
    './rewards.component.ng.scss',
    '../../../marketing/styles/markdown-style.ng.scss',
  ],
})
export class BlockchainMarketingRewardsV2Component
  implements OnInit, OnDestroy
{
  public data: ProductMarketingAttributes;
  public loading: boolean = true;
  public errors: readonly GraphQLFormattedError[];

  readonly cdnAssetsUrl: string;

  readonly contributionValues: { [key: string]: number };

  @ViewChild('topAnchor')
  readonly topAnchor: ElementRef;

  private copyDataSubscription: Subscription;

  constructor(
    protected router: Router,
    protected cd: ChangeDetectorRef,
    private linksService: BlockchainMarketingLinksService,
    private service: RewardsMarketingService,
    private strapiMeta: StrapiMetaService,
    private strapiActionResolver: StrapiActionResolverService,
    @Inject(STRAPI_URL) public strapiUrl: string,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.contributionValues = configs.get('contribution_values');
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

  /**
   * Open join rewards modal.
   * @returns { void }
   */
  public joinRewardsClick(): void {
    this.linksService.navigateToJoinRewards();
  }

  public detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
