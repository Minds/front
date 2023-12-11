import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { NetworksCheckoutPlanBuilderComponent } from './plan-builder.component';
import { Router } from '@angular/router';
import { NetworksCheckoutService } from '../../services/checkout.service';
import {
  AddOn,
  CheckoutPageKeyEnum,
  Plan,
} from '../../../../../../graphql/generated.engine';
import {
  mockAddOns,
  mockPlan,
} from '../../../../../mocks/responses/network-checkout.mock';
import { By } from '@angular/platform-browser';

describe('NetworksCheckoutPlanBuilderComponent', () => {
  let comp: NetworksCheckoutPlanBuilderComponent;
  let fixture: ComponentFixture<NetworksCheckoutPlanBuilderComponent>;

  const pageTitle: string = 'pageTitle';
  const pageDescription: string = 'pageDescription';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NetworksCheckoutPlanBuilderComponent,
        MockComponent({
          selector: 'm-planCard',
          inputs: [
            'title',
            'description',
            'priceCents',
            'priceTimePeriod',
            'secondaryPriceCents',
            'secondaryPriceTimePeriod',
            'priceChangeInProgress',
            'perksTitle',
            'perks',
            'ctaText',
            'ctaSaving',
            'ctaDisabled',
            'hideCta',
            'ctaSolid',
          ],
          outputs: ['ctaClick'],
        }),
      ],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: NetworksCheckoutService,
          useValue: MockService(NetworksCheckoutService, {
            has: [
              'addOns$',
              'pageTitle$',
              'pageDescription$',
              'plan$',
              'summaryChangeInProgress$',
              'activePage$',
            ],
            props: {
              addOns$: {
                get: () => new BehaviorSubject<AddOn[]>(mockAddOns),
              },
              pageTitle$: {
                get: () => new BehaviorSubject<string>(pageTitle),
              },
              pageDescription$: {
                get: () => new BehaviorSubject<string>(pageDescription),
              },
              plan$: {
                get: () => new BehaviorSubject<Plan>(mockPlan),
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
            },
          }),
        },
        { provide: Router, useValue: MockService(Router) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NetworksCheckoutPlanBuilderComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('onPlanChangeClick', () => {
    it('should navigate to about page for networks on plan change', () => {
      comp.onPlanChangeClick();
      expect((comp as any).router.navigateByUrl).toHaveBeenCalledWith(
        '/about/networks'
      );
    });
  });

  describe('toggleAddOn', () => {
    it('should toggle an addOn that is NOT in basket', () => {
      const addOn: AddOn = { id: '1', inBasket: false } as AddOn;
      comp.toggleAddOn(addOn);
      expect((comp as any).checkoutService.addAddOn).toHaveBeenCalledWith('1');
    });

    it('should toggle an addOn that IS in basket', () => {
      const addOn: AddOn = { id: '1', inBasket: true } as AddOn;
      comp.toggleAddOn(addOn);
      expect((comp as any).checkoutService.removeAddOn).toHaveBeenCalledWith(
        '1'
      );
    });
  });

  describe('trackAddonsBy', () => {
    it('should get trackBy key for a given AddOn', () => {
      const id: string = '123';
      const addOn: AddOn = { id: id, inBasket: false } as AddOn;
      expect(comp.trackAddOnsBy(addOn)).toBe(id);
    });
  });

  describe('Template tests', () => {
    it('should render page title', () => {
      expect(
        fixture.debugElement.query(By.css('.m-networksCheckoutBase__pageTitle'))
          .nativeElement.innerText
      ).toBe(pageTitle);
    });

    it('should render page description', () => {
      expect(
        fixture.debugElement.query(
          By.css('.m-networksCheckoutBase__pageDescription')
        ).nativeElement.innerText
      ).toBe(pageDescription);
    });

    it('should render plan cards', () => {
      expect(
        fixture.debugElement.queryAll(
          By.css('.m-networksCheckoutBase__planCard')
        ).length
      ).toBe(1);
      expect(
        fixture.debugElement.queryAll(
          By.css('.m-networksCheckoutBase__addonPlanCard')
        ).length
      ).toBe(2);
    });
  });
});
