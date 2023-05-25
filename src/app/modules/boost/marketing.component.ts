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
import { ConfigsService } from '../../common/services/configs.service';
import { Subscription } from 'rxjs';
import { GraphQLError } from 'graphql';
import {
  BoostMarketingPageResponse,
  BoostMarketingService,
} from './marketing.service';
import { StrapiMetaService } from '../../common/services/strapi/strapi-meta.service';
import { STRAPI_URL } from '../../common/injection-tokens/url-injection-tokens';
import { ApolloQueryResult } from '@apollo/client/core';
import { ProductMarketingAttributes } from '../../common/services/strapi/marketing-page/marketing-page.types';

@Component({
  selector: 'm-boost__marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../marketing/styles/markdown-style.ng.scss'],
})
export class BoostMarketingComponent implements OnInit, OnDestroy {
  public data: ProductMarketingAttributes;
  public loading: boolean = true;
  public errors: readonly GraphQLError[];
  readonly cdnAssetsUrl: string;

  @ViewChild('topAnchor')
  readonly topAnchor: ElementRef;

  private copyDataSubscription: Subscription;

  constructor(
    protected cd: ChangeDetectorRef,
    private configs: ConfigsService,
    private service: BoostMarketingService,
    private strapiMeta: StrapiMetaService,
    @Inject(STRAPI_URL) public strapiUrl: string
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    this.copyDataSubscription = this.service.copyData.valueChanges.subscribe(
      (result: ApolloQueryResult<BoostMarketingPageResponse>): void => {
        this.data = result.data.boostMarketingPage.data.attributes;
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

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
