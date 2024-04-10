import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { NetworksCheckoutSummaryComponent } from './summary.component';
import { NetworksCheckoutService } from '../../services/checkout.service';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { Router } from '@angular/router';
import {
  CheckoutPageKeyEnum,
  CheckoutTimePeriodEnum,
  Summary,
} from '../../../../../../graphql/generated.engine';
import { mockSummary } from '../../../../../mocks/responses/network-checkout.mock';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('NetworksCheckoutSummaryComponent', () => {
  let comp: NetworksCheckoutSummaryComponent;
  let fixture: ComponentFixture<NetworksCheckoutSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NetworksCheckoutSummaryComponent,
        MockComponent({
          selector: 'm-networksCheckout__summaryStepper',
        }),
        MockComponent({
          selector: 'm-networksCheckout__timePeriodSelector',
          inputs: ['onlyShowSelectedTimePeriod'],
        }),
        MockComponent({
          selector: 'markdown',
          inputs: ['data'],
        }),
        MockComponent({
          selector: 'm-button',
          inputs: [
            'color',
            'size',
            'stretch',
            'solid',
            'softSquare',
            'saving',
            'disabled',
          ],
          outputs: ['onAction'],
        }),
        MockComponent({
          selector: 'm-sizeableLoadingSpinner',
          inputs: ['spinnerWidth', 'spinnerHeight', 'inProgress'],
        }),
      ],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: NetworksCheckoutService,
          useValue: MockService(NetworksCheckoutService, {
            has: [
              'summary$',
              'selectedTimePeriod$',
              'termsMarkdown$',
              'summaryChangeInProgress$',
              'activePage$',
              'navToPaymentUrlInProgress$',
            ],
            props: {
              summary$: {
                get: () => new BehaviorSubject<Summary>(mockSummary),
              },
              selectedTimePeriod$: {
                get: () =>
                  new BehaviorSubject<CheckoutTimePeriodEnum>(
                    CheckoutTimePeriodEnum.Monthly
                  ),
              },
              termsMarkdown$: {
                get: () => new BehaviorSubject<string>('Terms'),
              },
              summaryChangeInProgress$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              activePage$: {
                get: () =>
                  new BehaviorSubject<CheckoutPageKeyEnum>(
                    CheckoutPageKeyEnum.Addons
                  ),
              },
              navToPaymentUrlInProgress$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        { provide: Router, useValue: MockService(Router) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NetworksCheckoutSummaryComponent);
    comp = fixture.componentInstance;

    Object.defineProperty(comp, 'onlyShowSelectedTimePeriod', {
      writable: true,
    });

    (comp as any).onlyShowSelectedTimePeriod = false;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('onPrimaryCtaClick', () => {
    it('should call the checkout service to checkout when on AddOns page', () => {
      comp.onPrimaryCtaClick(CheckoutPageKeyEnum.Addons);
      expect(
        (comp as any).checkoutService.navigateToPaymentUrl
      ).toHaveBeenCalled();
    });

    it('should call the checkout service to checkout when on AddOns Confirmation page', () => {
      comp.onPrimaryCtaClick(CheckoutPageKeyEnum.Confirmation);
      expect((comp as any).router.navigateByUrl).toHaveBeenCalledWith(
        '/networks'
      );
    });
  });

  describe('Rendering template', () => {
    describe('title', () => {
      it('should render the title when on AddOns page', () => {
        (comp as any).checkoutService.activePage$.next(
          CheckoutPageKeyEnum.Addons
        );
        fixture.detectChanges();

        expect(
          fixture.debugElement.query(
            By.css('.m-networksCheckoutSummary__pageTitle')
          ).nativeElement.innerText
        ).toBe('Order summary');
      });

      it('should render the title when on Confirmation page', () => {
        (comp as any).checkoutService.activePage$.next(
          CheckoutPageKeyEnum.Confirmation
        );
        fixture.detectChanges();

        expect(
          fixture.debugElement.query(
            By.css('.m-networksCheckoutSummary__pageTitle')
          ).nativeElement.innerText
        ).toBe('Payment summary');
      });
    });

    describe('Plan', () => {
      it('should render the Plan subtitle', () => {
        (comp as any).checkoutService.activePage$.next(
          CheckoutPageKeyEnum.Addons
        );
        fixture.detectChanges();

        expect(
          fixture.debugElement.queryAll(
            By.css('.m-networksCheckoutSummary__sectionSubtitle')
          )[0].nativeElement.innerText
        ).toBe(mockSummary.planSummary.name);
      });

      it('should render the Plan monthly fee', () => {
        (comp as any).checkoutService.activePage$.next(
          CheckoutPageKeyEnum.Addons
        );
        fixture.detectChanges();

        expect(
          fixture.debugElement.queryAll(
            By.css('.m-networksCheckoutSummary__sectionText')
          )[0].nativeElement.innerText
        ).toBe(`$${mockSummary.planSummary.monthlyFeeCents / 100}.00 / month`);
      });

      it('should render the 12-month agreement text when time period is Yearly', () => {
        (comp as any).checkoutService.selectedTimePeriod$.next(
          CheckoutTimePeriodEnum.Yearly
        );
        fixture.detectChanges();

        expect(
          fixture.debugElement.queryAll(
            By.css('.m-networksCheckoutSummary__sectionText--emphasized')
          )[0].nativeElement.innerText
        ).toBe('12-month agreement');
      });

      it('should NOT render the 12-month agreement text when time period is Monthly', () => {
        (comp as any).checkoutService.selectedTimePeriod$.next(
          CheckoutTimePeriodEnum.Monthly
        );
        fixture.detectChanges();

        expect(
          fixture.debugElement.query(
            By.css('.m-networksCheckoutSummary__sectionText--emphasized')
          )
        ).toBeNull();
      });
    });

    describe('AddOns', () => {
      it('should render all add-ons in addons summary', () => {
        expect(
          fixture.debugElement.queryAll(
            By.css('.m-networksCheckoutSummary__addOnSummary')
          ).length
        ).toBe(2);

        const addonSubtitleElements: DebugElement[] =
          fixture.debugElement.queryAll(
            By.css(
              '.m-networksCheckoutSummary__addOnSummary .m-networksCheckoutSummary__sectionSubtitle'
            )
          );

        expect(addonSubtitleElements[0].nativeElement.innerText).toBe(
          mockSummary.addonsSummary[0].name
        );
        expect(addonSubtitleElements[1].nativeElement.innerText).toBe(
          mockSummary.addonsSummary[1].name
        );

        const addonSectionTextElements: DebugElement[] =
          fixture.debugElement.queryAll(
            By.css(
              '.m-networksCheckoutSummary__addOnSummary .m-networksCheckoutSummary__sectionText'
            )
          );

        expect(addonSectionTextElements[0].nativeElement.innerText).toBe(
          `$${mockSummary.addonsSummary[0].monthlyFeeCents / 100}.00 / month`
        );
        expect(addonSectionTextElements[1].nativeElement.innerText).toBe(
          `$${
            mockSummary.addonsSummary[0].oneTimeFeeCents / 100
          }.00 / one time set-up*`
        );
        expect(addonSectionTextElements[2].nativeElement.innerText).toBe(
          `$${mockSummary.addonsSummary[1].monthlyFeeCents / 100}.00 / month`
        );
      });
    });

    describe('Monthly total', () => {
      it('should render the monthly total', () => {
        expect(
          fixture.debugElement
            .query(By.css('.m-networksCheckoutSummary__monthlyTotal'))
            .nativeElement.innerText.trim()
        ).toBe('$2,000.00 USD');

        expect(
          fixture.debugElement.query(
            By.css('.m-networksCheckoutSummary__monthlyTotalTimePeriod')
          ).nativeElement.innerText
        ).toBe('/ billed monthly');
      });
    });

    describe('Total today', () => {
      it('should render the total today title on AddOns page', () => {
        (comp as any).activePage$.next(CheckoutPageKeyEnum.Addons);
        fixture.detectChanges();

        expect(
          fixture.debugElement.query(
            By.css('.m-networksCheckoutSummary__totalPaidTodayTitle')
          ).nativeElement.innerText
        ).toBe('Total due today');
      });

      it('should render the total today title on Confirmation page', () => {
        (comp as any).activePage$.next(CheckoutPageKeyEnum.Confirmation);
        fixture.detectChanges();

        expect(
          fixture.debugElement.query(
            By.css('.m-networksCheckoutSummary__totalPaidTodayTitle')
          ).nativeElement.innerText
        ).toBe('Total paid today');
      });

      it('should have total paid today', () => {
        expect(
          fixture.debugElement.query(
            By.css('.m-networksCheckoutSummary__totalPaidToday')
          ).nativeElement.innerText
        ).toBe('$1,000.00 USD');
      });
    });

    describe('Terms markdown', () => {
      it('should render the terms markdown when terms are set', () => {
        (comp as any).checkoutService.termsMarkdown$.next('# Title');
        expect(
          fixture.debugElement.query(By.css('markdown')).nativeElement.innerText
        ).toBeDefined();
      });

      it('should NOT render the terms markdown when terms are NOT set', () => {
        (comp as any).checkoutService.termsMarkdown$.next(null);
        expect(
          fixture.debugElement.query(By.css('markdown')).nativeElement.innerText
        ).toBeDefined();
      });
    });
  });
});
