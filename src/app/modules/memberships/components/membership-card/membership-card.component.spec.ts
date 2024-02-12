import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MembershipCardComponent } from './membership-card.component';
import { MockComponent } from '../../../../utils/mock';
import {
  SiteMembershipBillingPeriodEnum,
  SiteMembershipPricingModelEnum,
} from '../../../../../graphql/generated.engine';
import { By } from '@angular/platform-browser';

describe('MembershipCardComponent', () => {
  let comp: MembershipCardComponent;
  let fixture: ComponentFixture<MembershipCardComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [MembershipCardComponent],
      declarations: [
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'size', 'solid'],
          outputs: ['onAction'],
          template: '<ng-content></ng-content>',
        }),
      ],
    });

    fixture = TestBed.createComponent(MembershipCardComponent);
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
      fixture.debugElement.query(By.css('.m-membershipCard__membershipName'))
        .nativeElement.innerText
    ).toBe('name');
  });

  describe('billing period', () => {
    it('should have a pricingPeriod', () => {
      (comp as any).billingPeriod = SiteMembershipBillingPeriodEnum.Yearly;
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('.m-membershipCard__pricingPeriod'))
          .nativeElement.innerText
      ).toBe('$19.99 / year');
    });

    it('should have a pricingPeriod', () => {
      (comp as any).billingPeriod = SiteMembershipBillingPeriodEnum.Monthly;
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('.m-membershipCard__pricingPeriod'))
          .nativeElement.innerText
      ).toBe('$19.99 / month');
    });
  });

  it('should have a pricingPeriod', () => {
    (comp as any).billingPeriod = SiteMembershipBillingPeriodEnum.Monthly;
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.m-membershipCard__description'))
        .nativeElement.innerText
    ).toBe('description');
  });

  describe('footer', () => {
    it('should have a footer with a join now button when isMember is false', () => {
      (comp as any).isMember = false;
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('.m-membershipCard__actionButton'))
          .nativeElement.innerText
      ).toBe('Join membership');
    });

    it('should have a footer with a manage plan button when isMember is true and pricing model is recurring', () => {
      (comp as any).isMember = true;
      (comp as any).pricingModel = SiteMembershipPricingModelEnum.Recurring;
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('.m-membershipCard__actionButton'))
          .nativeElement.innerText
      ).toBe('Manage plan');
    });

    it('should have a footer with a manage plan button when isMember is true and pricing model is one-time', () => {
      (comp as any).isMember = true;
      (comp as any).pricingModel = SiteMembershipPricingModelEnum.OneTime;
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('.m-membershipCard__actionButton'))
          .nativeElement.innerText
      ).toBe('Purchased');
    });
  });
});
