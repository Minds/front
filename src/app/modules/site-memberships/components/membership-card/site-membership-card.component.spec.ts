import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiteMembershipCardComponent } from './site-membership-card.component';
import { MockComponent } from '../../../../utils/mock';
import {
  SiteMembershipBillingPeriodEnum,
  SiteMembershipPricingModelEnum,
} from '../../../../../graphql/generated.engine';
import { By } from '@angular/platform-browser';

describe('SiteMembershipCardComponent', () => {
  let comp: SiteMembershipCardComponent;
  let fixture: ComponentFixture<SiteMembershipCardComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [SiteMembershipCardComponent],
      declarations: [
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'size', 'solid'],
          outputs: ['onAction'],
          template: '<ng-content></ng-content>',
        }),
      ],
    });

    fixture = TestBed.createComponent(SiteMembershipCardComponent);
    comp = fixture.componentInstance;

    Object.defineProperty(comp, 'name', { writable: true });
    Object.defineProperty(comp, 'description', { writable: true });
    Object.defineProperty(comp, 'priceInCents', { writable: true });
    Object.defineProperty(comp, 'priceCurrencyCode', { writable: true });
    Object.defineProperty(comp, 'billingPeriod', { writable: true });

    (comp as any).name = 'name';
    (comp as any).description = 'description';
    (comp as any).priceInCents = 1999;
    (comp as any).priceCurrencyCode = 'USD';
    (comp as any).billingPeriod = SiteMembershipBillingPeriodEnum.Monthly;
    (comp as any).pricingModel = SiteMembershipPricingModelEnum.Recurring;
    (comp as any).isMember = false;

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

  it('should have a name', () => {
    expect(
      fixture.debugElement.query(
        By.css('.m-siteMembershipCard__membershipName')
      ).nativeElement.innerText
    ).toBe('name');
  });

  describe('billing period', () => {
    it('should have a pricingPeriod', () => {
      (comp as any).billingPeriod = SiteMembershipBillingPeriodEnum.Yearly;
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(
          By.css('.m-siteMembershipCard__pricingPeriod')
        ).nativeElement.innerText
      ).toBe('$19.99 / year');
    });

    it('should have a pricingPeriod', () => {
      (comp as any).billingPeriod = SiteMembershipBillingPeriodEnum.Monthly;
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(
          By.css('.m-siteMembershipCard__pricingPeriod')
        ).nativeElement.innerText
      ).toBe('$19.99 / month');
    });
  });

  it('should have a pricingPeriod', () => {
    (comp as any).billingPeriod = SiteMembershipBillingPeriodEnum.Monthly;
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.m-siteMembershipCard__description'))
        .nativeElement.innerText
    ).toBe('description');
  });
});
