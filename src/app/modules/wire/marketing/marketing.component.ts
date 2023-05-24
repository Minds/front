import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ConfigsService } from '../../../common/services/configs.service';
import { Subscription } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';
import {
  PayMarketingPageResponse,
  PayMarketingService,
} from './marketing.service';
import { GraphQLError } from 'graphql';
import { StrapiMetaService } from '../../../common/services/strapi/strapi-meta.service';
import { STRAPI_URL } from '../../../common/injection-tokens/url-injection-tokens';
import { MarketingAttributes } from '../../../common/services/strapi/marketing-page/marketing-page.types';

/**
 * Marketing page for Minds Pay
 * See it at /pay
 */
@Component({
  selector: 'm-pay__marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../../marketing/styles/markdown-style.ng.scss'],
})
export class PayMarketingComponent {
  public data: MarketingAttributes;
  public loading: boolean = true;
  public errors: readonly GraphQLError[];

  readonly cdnAssetsUrl: string;

  @ViewChild('topAnchor')
  readonly topAnchor: ElementRef;

  private copyDataSubscription: Subscription;

  constructor(
    protected router: Router,
    protected cd: ChangeDetectorRef,
    private service: PayMarketingService,
    private strapiMeta: StrapiMetaService,
    @Inject(STRAPI_URL) public strapiUrl: string,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    this.copyDataSubscription = this.service.copyData.valueChanges.subscribe(
      (result: ApolloQueryResult<PayMarketingPageResponse>): void => {
        this.data = result.data.payMarketingPage.data.attributes;
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
    this.router.navigate(['/wallet']);
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
