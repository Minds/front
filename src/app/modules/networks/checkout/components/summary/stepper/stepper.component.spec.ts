import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockService } from '../../../../../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NetworksCheckoutSummaryStepperComponent } from './stepper.component';
import { NetworksCheckoutService } from '../../../services/checkout.service';
import { CheckoutPageKeyEnum } from '../../../../../../../graphql/generated.engine';

describe('NetworksCheckoutSummaryStepperComponent', () => {
  let comp: NetworksCheckoutSummaryStepperComponent;
  let fixture: ComponentFixture<NetworksCheckoutSummaryStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NetworksCheckoutSummaryStepperComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: NetworksCheckoutService,
          useValue: MockService(NetworksCheckoutService, {
            has: ['activePage$'],
            props: {
              activePage$: {
                get: () =>
                  new BehaviorSubject<CheckoutPageKeyEnum>(
                    CheckoutPageKeyEnum.Addons
                  ),
              },
            },
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NetworksCheckoutSummaryStepperComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('Template rendering', () => {
    it('should render 2 steps', () => {
      expect(
        fixture.debugElement.queryAll(
          By.css('.m-networksCheckoutSummary__stepperItem')
        ).length
      ).toBe(2);

      const stepNumberElements: DebugElement[] = fixture.debugElement.queryAll(
        By.css('.m-networksCheckoutSummary__stepperItemNumber')
      );
      expect(stepNumberElements.length).toBe(2);
      expect(stepNumberElements[0].nativeElement.textContent.trim()).toBe('1');
      expect(stepNumberElements[1].nativeElement.textContent.trim()).toBe('2');

      const stepTextElements: DebugElement[] = fixture.debugElement.queryAll(
        By.css('.m-networksCheckoutSummary__stepperItemText')
      );
      expect(stepTextElements.length).toBe(2);
      expect(stepTextElements[0].nativeElement.textContent.trim()).toBe(
        'Add-ons'
      );
      expect(stepTextElements[1].nativeElement.textContent.trim()).toBe(
        'Confirmation'
      );
    });

    it('should have an active class on the active step when add-ons is the active page', () => {
      (comp as any).checkoutService.activePage$.next(
        CheckoutPageKeyEnum.Addons
      );
      fixture.detectChanges();

      const activeStepTextElement: DebugElement = fixture.debugElement.query(
        By.css(
          '.m-networksCheckoutSummary__stepperItem--active .m-networksCheckoutSummary__stepperItemText'
        )
      );
      expect(activeStepTextElement.nativeElement.textContent.trim()).toBe(
        'Add-ons'
      );
    });

    it('should have an active class on the active step when confirmation is the active page', () => {
      (comp as any).checkoutService.activePage$.next(
        CheckoutPageKeyEnum.Confirmation
      );
      fixture.detectChanges();

      const activeStepTextElement: DebugElement = fixture.debugElement.query(
        By.css(
          '.m-networksCheckoutSummary__stepperItem--active .m-networksCheckoutSummary__stepperItemText'
        )
      );
      expect(activeStepTextElement.nativeElement.textContent.trim()).toBe(
        'Confirmation'
      );
    });
  });
});
