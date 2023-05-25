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
import { GraphQLError } from 'graphql';
import {
  RewardsMarketingPageResponse,
  RewardsMarketingService,
} from './rewards.service';
import { Subscription } from 'rxjs';
import { StrapiMetaService } from '../../../../common/services/strapi/strapi-meta.service';
import { STRAPI_URL } from '../../../../common/injection-tokens/url-injection-tokens';
import { ApolloQueryResult } from '@apollo/client/core';
import { ProductMarketingAttributes } from '../../../../common/services/strapi/marketing-page/marketing-page.types';

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
  implements OnInit, OnDestroy {
  public data: ProductMarketingAttributes;
  public loading: boolean = true;
  public errors: readonly GraphQLError[];

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
    @Inject(STRAPI_URL) public strapiUrl: string,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.contributionValues = configs.get('contribution_values');
  }

  ngOnInit(): void {
    this.copyDataSubscription = this.service.copyData.valueChanges.subscribe(
      (result: ApolloQueryResult<RewardsMarketingPageResponse>): void => {
        this.data = result.data.rewardsMarketingPage.data.attributes;
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

  scrollToTop() {
    if (this.topAnchor.nativeElement) {
      this.topAnchor.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
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
