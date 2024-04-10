import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockService } from '../../../../../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { NetworksCheckoutService } from '../../../services/checkout.service';
import { NetworksCheckoutSummaryTimePeriodSelectorComponent } from './time-period-selector.component';
import { CheckoutTimePeriodEnum } from '../../../../../../../graphql/generated.engine';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('NetworksCheckoutSummaryTimePeriodSelectorComponent', () => {
  let comp: NetworksCheckoutSummaryTimePeriodSelectorComponent;
  let fixture: ComponentFixture<NetworksCheckoutSummaryTimePeriodSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NetworksCheckoutSummaryTimePeriodSelectorComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: NetworksCheckoutService,
          useValue: MockService(NetworksCheckoutService, {
            has: ['selectedTimePeriod$', 'totalAnnualSavingsCents$'],
            props: {
              selectedTimePeriod$: {
                get: () =>
                  new BehaviorSubject<CheckoutTimePeriodEnum>(
                    CheckoutTimePeriodEnum.Monthly
                  ),
              },
              totalAnnualSavingsCents$: {
                get: () => new BehaviorSubject<number>(10000),
              },
            },
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      NetworksCheckoutSummaryTimePeriodSelectorComponent
    );
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

  describe('onTimePeriodClick', () => {
    it("should select the time period when we're not only showing the selected time period", () => {
      const timePeriod: CheckoutTimePeriodEnum = CheckoutTimePeriodEnum.Monthly;
      (comp as any).onlyShowSelectedTimePeriod = false;

      comp.onTimePeriodClick(timePeriod);

      expect(
        (comp as any).checkoutService.selectTimePeriod
      ).toHaveBeenCalledWith(timePeriod);
    });

    it('should NOT select the time period when we ARE only showing the selected time period', () => {
      const timePeriod: CheckoutTimePeriodEnum = CheckoutTimePeriodEnum.Monthly;
      (comp as any).onlyShowSelectedTimePeriod = true;

      comp.onTimePeriodClick(timePeriod);

      expect(
        (comp as any).checkoutService.selectTimePeriod
      ).not.toHaveBeenCalled();
    });
  });

  describe('shouldShow$', () => {
    it("should return true when we're not only showing the selected time period", (done: DoneFn) => {
      const timePeriod: CheckoutTimePeriodEnum = CheckoutTimePeriodEnum.Monthly;
      (comp as any).onlyShowSelectedTimePeriod = false;
      (comp as any).checkoutService.selectedTimePeriod$.next(timePeriod);

      comp.shouldShow$(timePeriod).subscribe((shouldShow: boolean): void => {
        expect(shouldShow).toBeTrue();
        done();
      });
    });

    it('should return true when we ARE only showing the selected time period and the time period matches the selected time period', (done: DoneFn) => {
      const timePeriod: CheckoutTimePeriodEnum = CheckoutTimePeriodEnum.Monthly;
      (comp as any).onlyShowSelectedTimePeriod = true;
      (comp as any).checkoutService.selectedTimePeriod$.next(timePeriod);

      comp.shouldShow$(timePeriod).subscribe((shouldShow: boolean): void => {
        expect(shouldShow).toBeTrue();
        done();
      });
    });

    it('should return false when we ARE only showing the selected time period and the time period DOES NOT match the selected time period', (done: DoneFn) => {
      const timePeriod: CheckoutTimePeriodEnum = CheckoutTimePeriodEnum.Monthly;
      (comp as any).onlyShowSelectedTimePeriod = true;
      (comp as any).checkoutService.selectedTimePeriod$.next(
        CheckoutTimePeriodEnum.Yearly
      );

      comp.shouldShow$(timePeriod).subscribe((shouldShow: boolean): void => {
        expect(shouldShow).toBeFalse();
        done();
      });
    });
  });

  describe('Template rendering', () => {
    it("should render two time periods when we're not only showing the selected time period", () => {
      (comp as any).onlyShowSelectedTimePeriod = false;
      fixture.detectChanges();

      expect(
        fixture.debugElement.queryAll(
          By.css('.m-networksCheckoutSummary__timePeriod')
        ).length
      ).toBe(2);

      const timePeriodTitleElements: DebugElement[] =
        fixture.debugElement.queryAll(
          By.css('.m-networksCheckoutSummary__timePeriodTitle')
        );

      expect(timePeriodTitleElements[0].nativeElement.textContent.trim()).toBe(
        'Annually'
      );
      expect(timePeriodTitleElements[1].nativeElement.textContent.trim()).toBe(
        'Monthly'
      );

      const timePeriodSubtitleElements: DebugElement[] =
        fixture.debugElement.queryAll(
          By.css('.m-networksCheckoutSummary__timePeriodSubtitle')
        );

      expect(
        timePeriodSubtitleElements[0].nativeElement.textContent.trim()
      ).toBe('Save $100');
      expect(
        timePeriodSubtitleElements[1].nativeElement.textContent.trim()
      ).toBe('No discount');
    });

    it('should have the selected time period as active when the selected time period is Yearly', () => {
      (comp as any).onlyShowSelectedTimePeriod = false;
      (comp.selectedTimePeriod$ as BehaviorSubject<any>).next(
        CheckoutTimePeriodEnum.Yearly
      );

      fixture.detectChanges();

      const timePeriodElements: DebugElement[] = fixture.debugElement.queryAll(
        By.css('.m-networksCheckoutSummary__timePeriod')
      );

      expect(timePeriodElements.length).toBe(2);
      expect(
        timePeriodElements[0].nativeElement.classList.contains(
          'm-networksCheckoutSummary__timePeriod--active'
        )
      ).toBeTrue();
    });

    it('should have the selected time period as active when the selected time period is Monthly', () => {
      (comp as any).onlyShowSelectedTimePeriod = false;
      (comp.selectedTimePeriod$ as BehaviorSubject<any>).next(
        CheckoutTimePeriodEnum.Monthly
      );

      fixture.detectChanges();

      const timePeriodElements: DebugElement[] = fixture.debugElement.queryAll(
        By.css('.m-networksCheckoutSummary__timePeriod')
      );

      expect(timePeriodElements.length).toBe(2);
      expect(
        timePeriodElements[1].nativeElement.classList.contains(
          'm-networksCheckoutSummary__timePeriod--active'
        )
      ).toBeTrue();
    });

    it("should render one time periods when we're only showing the selected time period as yearly", () => {
      (comp as any).onlyShowSelectedTimePeriod = true;
      (comp.selectedTimePeriod$ as BehaviorSubject<any>).next(
        CheckoutTimePeriodEnum.Yearly
      );
      fixture.detectChanges();

      const timePeriodContainerElements: DebugElement[] =
        fixture.debugElement.queryAll(
          By.css('.m-networksCheckoutSummary__timePeriod')
        );

      expect(timePeriodContainerElements.length).toBe(1);
      expect(
        timePeriodContainerElements[0].nativeElement.classList.contains(
          'm-networksCheckoutSummary__timePeriod--disabled'
        )
      ).toBeTrue();
      expect(
        timePeriodContainerElements[0].nativeElement.classList.contains(
          'm-networksCheckoutSummary__timePeriod--active'
        )
      ).toBeTrue();

      expect(
        fixture.debugElement
          .query(By.css('.m-networksCheckoutSummary__timePeriodTitle'))
          .nativeElement.textContent.trim()
      ).toBe('Annually');

      expect(
        fixture.debugElement
          .query(By.css('.m-networksCheckoutSummary__timePeriodSubtitle'))
          .nativeElement.textContent.trim()
      ).toBe('Save $100');
    });

    it("should render one time periods when we're only showing the selected time period as monthly", () => {
      (comp as any).onlyShowSelectedTimePeriod = true;
      (comp.selectedTimePeriod$ as BehaviorSubject<any>).next(
        CheckoutTimePeriodEnum.Monthly
      );
      fixture.detectChanges();

      const timePeriodContainerElements: DebugElement[] =
        fixture.debugElement.queryAll(
          By.css('.m-networksCheckoutSummary__timePeriod')
        );

      expect(timePeriodContainerElements.length).toBe(1);
      expect(
        timePeriodContainerElements[0].nativeElement.classList.contains(
          'm-networksCheckoutSummary__timePeriod--disabled'
        )
      ).toBeTrue();
      expect(
        timePeriodContainerElements[0].nativeElement.classList.contains(
          'm-networksCheckoutSummary__timePeriod--active'
        )
      ).toBeTrue();

      expect(
        fixture.debugElement
          .query(By.css('.m-networksCheckoutSummary__timePeriodTitle'))
          .nativeElement.textContent.trim()
      ).toBe('Monthly');

      expect(
        fixture.debugElement
          .query(By.css('.m-networksCheckoutSummary__timePeriodSubtitle'))
          .nativeElement.textContent.trim()
      ).toBe('No discount');
    });
  });
});
