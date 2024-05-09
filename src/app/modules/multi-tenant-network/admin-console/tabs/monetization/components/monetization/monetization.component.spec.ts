import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminMonetizationComponent } from './monetization.component';
import { MockComponent, MockService } from '../../../../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { StripeKeysService } from '../../services/stripe-keys.service';
import { BehaviorSubject } from 'rxjs';

describe('NetworkAdminMonetizationComponent', () => {
  let comp: NetworkAdminMonetizationComponent;
  let fixture: ComponentFixture<NetworkAdminMonetizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        NetworkAdminMonetizationComponent,
        MockComponent({
          selector: 'm-networkAdminConsole__stripeCredentials',
        }),
        MockComponent({
          selector: 'm-networkAdminConsole__enableBoostToggle',
        }),
        MockComponent({
          selector: 'm-networkAdminMonetization__tabs',
        }),
      ],
      providers: [
        {
          provide: StripeKeysService,
          useValue: MockService(StripeKeysService, {
            has: ['hasSetStripeKeys$'],
            props: {
              hasSetStripeKeys$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
      ],
    });

    fixture = TestBed.createComponent(NetworkAdminMonetizationComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('render boost toggle', () => {
    it('should render boost toggle when stripe keys are set', () => {
      (comp as any).stripeKeysService.hasSetStripeKeys$.next(true);
      fixture.detectChanges();

      const enableBoostToggle =
        fixture.debugElement.nativeElement.querySelector(
          'm-networkAdminConsole__enableBoostToggle'
        );
      expect(enableBoostToggle).toBeTruthy();
    });

    it('should NOT render boost toggle when stripe keys are NOT set', () => {
      (comp as any).stripeKeysService.hasSetStripeKeys$.next(false);
      fixture.detectChanges();

      const enableBoostToggle =
        fixture.debugElement.nativeElement.querySelector(
          'm-networkAdminConsole__enableBoostToggle'
        );
      expect(enableBoostToggle).toBeFalsy();
    });
  });
});
