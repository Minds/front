import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NetworkAdminConsoleBillingComponent } from './billing.component';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { MultiTenantDomainService } from '../../../services/domain.service';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { ProductPagePricingService } from '../../../../about/product-pages/services/product-page-pricing.service';
import {
  GetTenantBillingGQL,
  TenantPlanEnum,
} from '../../../../../../graphql/generated.engine';
import { ThemeService } from '../../../../../common/services/theme.service';
import { BehaviorSubject, of } from 'rxjs';
import { ProductPageUpgradeTimePeriod } from '../../../../about/product-pages/product-pages.types';
import { CommonModule as NgCommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Enum_Componentv2Productfeaturehighlight_Colorscheme as ColorScheme } from '../../../../../../graphql/generated.strapi';
import { DebugElement } from '@angular/core';

describe('NetworkAdminConsoleBillingComponent', () => {
  let comp: NetworkAdminConsoleBillingComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleBillingComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [NetworkAdminConsoleBillingComponent],
      providers: [
        {
          provide: MultiTenantDomainService,
          useValue: MockService(MultiTenantDomainService),
        },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        {
          provide: ProductPagePricingService,
          useValue: MockService(ProductPagePricingService, {
            has: ['selectedTimePeriod$'],
            props: {
              selectedTimePeriod$: {
                get: () =>
                  new BehaviorSubject<any>(
                    ProductPageUpgradeTimePeriod.Monthly
                  ),
              },
            },
          }),
        },
        {
          provide: GetTenantBillingGQL,
          useValue: jasmine.createSpyObj('GetTenantBillingGQL', ['watch']),
        },
        {
          provide: ThemeService,
          useValue: MockService(ThemeService, {
            has: ['isDark$'],
            props: {
              isDark$: { get: () => new BehaviorSubject<boolean>(false) },
            },
          }),
        },
      ],
    }).overrideComponent(NetworkAdminConsoleBillingComponent, {
      set: {
        imports: [
          NgCommonModule,
          MockComponent({
            selector: 'm-productPage__pricingCards',
            inputs: ['productPlans', 'colorScheme'],
            standalone: true,
          }),
          MockComponent({
            selector: 'm-loadingSpinner',
            inputs: ['inProgress'],
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(NetworkAdminConsoleBillingComponent);
    comp = fixture.componentInstance;

    (comp as any).tenantBillingGql.watch.and.returnValue({
      valueChanges: of({
        data: {
          tenantBilling: {
            isActive: false,
            nextBillingAmountCents: 10000,
            plan: TenantPlanEnum.Community,
            period: ProductPageUpgradeTimePeriod.Monthly,
            nextBillingDate: Date.now(),
            manageBillingUrl: 'https://example.minds.com/',
          },
        },
      }),
    });

    fixture.detectChanges();
    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('Color Scheme', () => {
    it('should pass the correct color scheme as light based on isDarkMode$', () => {
      (comp as any).themeService.isDark$.next(false);
      fixture.detectChanges();

      let pricingCardsComponent: DebugElement = fixture.debugElement.query(
        By.css('m-productpage__pricingcards')
      );
      expect(pricingCardsComponent).toBeTruthy();
      expect(pricingCardsComponent.componentInstance.colorScheme).toBe(
        ColorScheme.Light
      );
    });

    it('should pass the correct color scheme as dark based on isDarkMode$', () => {
      (comp as any).themeService.isDark$.next(true);
      fixture.detectChanges();

      let pricingCardsComponent: DebugElement = fixture.debugElement.query(
        By.css('m-productpage__pricingcards')
      );
      expect(pricingCardsComponent).toBeTruthy();
      expect(pricingCardsComponent.componentInstance.colorScheme).toBe(
        ColorScheme.Dark
      );
    });
  });
});
