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
import {
  NodesMarketingPageResponse,
  NodesMarketingService,
} from './marketing.service';
import { StrapiMetaService } from '../../../common/services/strapi/strapi-meta.service';
import { STRAPI_URL } from '../../../common/injection-tokens/url-injection-tokens';
import { ApolloQueryResult } from '@apollo/client/core';
import { Subscription } from 'rxjs';
import { GraphQLError } from 'graphql';
import { MarketingAttributes } from '../../../common/services/strapi/marketing-page/marketing-page.types';

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
  public data: MarketingAttributes;
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
    @Inject(STRAPI_URL) public strapiUrl: string
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    this.copyDataSubscription = this.service.copyData.valueChanges.subscribe(
      (result: ApolloQueryResult<NodesMarketingPageResponse>): void => {
        this.data = result.data.nodesMarketingPage.data.attributes;
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
