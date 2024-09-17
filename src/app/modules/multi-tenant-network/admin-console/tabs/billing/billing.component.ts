import {
  Component,
  HostListener,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MultiTenantDomainService } from '../../../services/domain.service';
import { ModalService } from '../../../../../services/ux/modal.service';

import { ToasterService } from '../../../../../common/services/toaster.service';
import { AboutModule } from '../../../../about/about.module';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { ProductPagePricingService } from '../../../../about/product-pages/services/product-page-pricing.service';
import { ProductPageUpgradeTimePeriod } from '../../../../about/product-pages/product-pages.types';
import {
  GetTenantBillingGQL,
  GetTenantBillingQuery,
  GetTenantBillingQueryVariables,
  TenantBillingType,
} from '../../../../../../graphql/generated.engine';
import { Enum_Componentv2Productfeaturehighlight_Colorscheme as ColorScheme } from '../../../../../../graphql/generated.strapi';
import { QueryRef } from 'apollo-angular';
import { Observable, Subscription } from 'rxjs';
import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe,
  LowerCasePipe,
  NgIf,
} from '@angular/common';
import { CommonModule } from '../../../../../common/common.module';
import { ThemeService } from '../../../../../common/services/theme.service';

/**
 * Domain settings tab for network admin console.
 */
@Component({
  selector: 'm-networkAdminConsole__billing',
  templateUrl: './billing.component.html',
  styleUrls: [
    './billing.component.ng.scss',
    '../../stylesheets/console.component.ng.scss',
  ],
  imports: [
    AboutModule,
    NgIf,
    AsyncPipe,
    CommonModule,
    CurrencyPipe,
    LowerCasePipe,
    DatePipe,
  ],
  standalone: true,
})
export class NetworkAdminConsoleBillingComponent implements OnInit, OnDestroy {
  /** Holds the data that will populate the product cards (mocked cms data) */
  products = [];

  tenantBillingQueryRef: QueryRef<
    GetTenantBillingQuery,
    GetTenantBillingQueryVariables
  >;

  subscriptions: Subscription[];

  isLoading = true;
  isActive: boolean;

  billingOverview: TenantBillingType;

  /** Enum for use in template. */
  public readonly ColorScheme: typeof ColorScheme = ColorScheme;

  /** Whether the theme is in dark mode. */
  protected readonly isDarkMode$: Observable<boolean> =
    this.themeService.isDark$;

  constructor(
    protected service: MultiTenantDomainService,
    private configsService: ConfigsService,
    private pricingService: ProductPagePricingService,
    private tenantBillingGql: GetTenantBillingGQL,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    const siteUrl = this.configsService.get('site_url');

    this.tenantBillingQueryRef = this.tenantBillingGql.watch();

    this.subscriptions = [
      this.tenantBillingQueryRef.valueChanges.subscribe((value) => {
        this.isLoading = false;
        this.isActive = value.data.tenantBilling.isActive;
        this.billingOverview = value.data.tenantBilling;
      }),
      this.pricingService.selectedTimePeriod$.subscribe((period) => {
        const periodStr =
          period === ProductPageUpgradeTimePeriod.Monthly
            ? 'monthly'
            : 'yearly';
        this.products = [
          {
            'attributes': {
              'tier': 'networks_team',
              'title': 'Team',
              'subtitle':
                'Publish under your own domain to the decentralized social web',
              'mostPopular': null,
              'priceStartingAt': null,
              'noPrice': null,
              'button': {
                'text': 'Purchase',
                'dataRef': 'product-page-networks-team',
                'solid': true,
                'rounded': null,
                'navigationUrl':
                  '/api/v3/multi-tenant/billing/upgrade?plan=team&period=' +
                  periodStr,
                'stripeProductKey': 'networks:team',
                'trialUpgradeRequest': null,
                'action': null,
              },
              'perksTitle': 'Features',
              'perks': [
                {
                  'text': '30 minutes of video storage',
                },
                {
                  'text': '8,000 minutes of video viewing',
                },
                {
                  'text': '8,000 interaction events',
                },
                {
                  'text': 'Best for 20-250+ users',
                },
              ],
            },
          },
          {
            'attributes': {
              'tier': 'networks_community',
              'title': 'Community',
              'subtitle': 'Grow a new community that you own and monetize',
              'mostPopular': true,
              'priceStartingAt': null,
              'noPrice': null,
              'button': {
                'text': 'Purchase',
                'dataRef': 'product-page-networks-community',
                'solid': true,
                'rounded': null,
                'navigationUrl':
                  '/api/v3/multi-tenant/billing/upgrade?plan=community&period=' +
                  periodStr,
                'stripeProductKey': 'networks:community',
                'trialUpgradeRequest': null,
                'action': null,
              },
              'perksTitle': 'Features',
              'perks': [
                {
                  'text': '500 minutes of video storage',
                },
                {
                  'text': '120,000 minutes of video viewing',
                },
                {
                  'text': '120,000 interaction events',
                },
                {
                  'text': 'Best for 250-5,000+ users',
                },
              ],
            },
          },
          {
            'attributes': {
              'tier': 'networks_enterprise',
              'title': 'Business',
              'subtitle':
                'Operate a social network that scales with your audience',
              'mostPopular': null,
              'priceStartingAt': true,
              'noPrice': null,
              'button': {
                'text': 'Purchase',
                'dataRef': 'product-page-networks-business',
                'solid': true,
                'rounded': null,
                'navigationUrl':
                  '/api/v3/multi-tenant/billing/upgrade?plan=enterprise&period=' +
                  periodStr,
                'stripeProductKey': 'networks:enterprise',
                'trialUpgradeRequest': null,
                'action': null,
              },
              'perksTitle': 'Lowest rates',
              'perks': [
                {
                  'text': '$0.0075 per minute of video storage',
                },
                {
                  'text': '$0.0015 per minute of video viewing',
                },
                {
                  'text': '$0.0015 per interaction event',
                },
                {
                  'text': 'Best for unlimited users',
                },
              ],
            },
          },
        ];
      }),
    ];
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  @HostListener('window:focus', ['$event'])
  onWindowFocus() {
    this.tenantBillingQueryRef.refetch();
  }
}
