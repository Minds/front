import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminMonetizationTabsComponent } from './tabs.component';
import { MockService } from '../../../../../../../utils/mock';
import { StripeKeysService } from '../../services/stripe-keys.service';
import { BehaviorSubject } from 'rxjs';

describe('NetworkAdminMonetizationTabsComponent', () => {
  let comp: NetworkAdminMonetizationTabsComponent;
  let fixture: ComponentFixture<NetworkAdminMonetizationTabsComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [NetworkAdminMonetizationTabsComponent],
      providers: [
        {
          provide: StripeKeysService,
          useValue: MockService(StripeKeysService, {
            has: ['hasSetStripeKeys$'],
            props: {
              hasSetStripeKeys$: { get: () => new BehaviorSubject<boolean>(true) }
            }
          })
        }
      ]
    });

    fixture = TestBed.createComponent(NetworkAdminMonetizationTabsComponent);
    comp = fixture.componentInstance;

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

  it('should have a tab for memberships', () => {
    expect(
      fixture.nativeElement.querySelector(
        'a[data-ref=tenant-admin-monetization-tab-memberships]'
      )
    ).toBeTruthy();
  });

  describe('Boost tab', () => {
    it('should not show Boost tab when Stripe keys are not set', () => {
      (comp as any).stripeKeysService.hasSetStripeKeys$.next(false);
      
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(
          'a[data-ref=tenant-admin-monetization-tab-boost]'
        )
      ).toBeFalsy();
    });

    it('should show Boost tab when Stripe keys are set', () => {
      (comp as any).stripeKeysService.hasSetStripeKeys$.next(true);
      
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(
          'a[data-ref=tenant-admin-monetization-tab-boost]'
        )
      ).toBeTruthy();
    });
  });
});
