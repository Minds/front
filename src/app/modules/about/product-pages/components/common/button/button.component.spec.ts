import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProductPageButtonComponent } from './button.component';
import { MockService } from '../../../../../../utils/mock';
import { Session } from '../../../../../../services/session';
import { Router } from '@angular/router';
import { ProductPagePricingService } from '../../../services/product-page-pricing.service';
import { StrapiActionResolverService } from '../../../../../../common/services/strapi/strapi-action-resolver.service';
import {
  ComponentV2ProductActionButton,
  Enum_Componentv2Productfeaturehighlight_Colorscheme as ColorScheme,
  Enum_Componentv2Productactionbutton_Action as StrapiAction,
} from '../../../../../../../graphql/generated.strapi';
import userMock from '../../../../../../mocks/responses/user.mock';
import { ProductPageUpgradeTimePeriod } from '../../../product-pages.types';
import { BehaviorSubject } from 'rxjs';

describe('ProductPageButtonComponent', () => {
  let comp: ProductPageButtonComponent;
  let fixture: ComponentFixture<ProductPageButtonComponent>;

  const mockData: ComponentV2ProductActionButton = {
    id: '0',
    __typename: 'ComponentV2ProductActionButton',
    action: null,
    dataRef: 'dataRef',
    navigationUrl: '',
    solid: true,
    text: 'text',
    stripeProductKey: null,
  };

  const defaultColorScheme: ColorScheme = ColorScheme.Light;

  const defaultSelectedTimePeriod: ProductPageUpgradeTimePeriod =
    ProductPageUpgradeTimePeriod.Annually;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProductPageButtonComponent],
      providers: [
        { provide: Session, useValue: MockService(Session) },
        { provide: Router, useValue: MockService(Router) },
        {
          provide: ProductPagePricingService,
          useValue: MockService(ProductPagePricingService, {
            has: ['selectedTimePeriod$'],
            props: {
              selectedTimePeriod$: {
                get: () =>
                  new BehaviorSubject<ProductPageUpgradeTimePeriod>(
                    defaultSelectedTimePeriod
                  ),
              },
            },
          }),
        },
        {
          provide: StrapiActionResolverService,
          useValue: MockService(StrapiActionResolverService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(ProductPageButtonComponent);
    comp = fixture.componentInstance;

    Object.defineProperty(comp, 'data', { writable: true });
    Object.defineProperty(comp, 'colorScheme', { writable: true });

    (comp as any).data = mockData;
    (comp as any).data.stripeProductKey = null;
    (comp as any).colorScheme = defaultColorScheme;
    (comp as any).pricingService.selectedTimePeriod$.next(
      defaultSelectedTimePeriod
    );
    (comp as any).inProgress = false;

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();

    expect(fixture.debugElement.query(By.css('button'))).toBeTruthy();
  });

  it('should have outline class when solid is false', () => {
    (comp as any).data.solid = false;
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.m-productPageButton--outline'))
    ).toBeTruthy();
  });

  it('should have no outline class when solid is true', () => {
    (comp as any).data.solid = true;
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.m-productPageButton--outline'))
    ).toBeNull();
  });

  it('should have rounded class when rounded is true', () => {
    (comp as any).data.rounded = true;
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.m-productPageButton--rounded'))
    ).toBeTruthy();
  });

  it('should have no rounded class when rounded is false', () => {
    (comp as any).data.rounded = false;
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.m-productPageButton--rounded'))
    ).toBeNull();
  });

  it('should have lightScheme class when colorScheme is Light', () => {
    (comp as any).colorScheme = ColorScheme.Light;
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.m-productPageButton--lightScheme'))
    ).toBeTruthy();

    expect(
      fixture.debugElement.query(By.css('.m-productPageButton--darkScheme'))
    ).toBeNull();
  });

  it('should have lightScheme class when colorScheme is Dark', () => {
    (comp as any).colorScheme = ColorScheme.Dark;
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.m-productPageButton--darkScheme'))
    ).toBeTruthy();

    expect(
      fixture.debugElement.query(By.css('.m-productPageButton--lightScheme'))
    ).toBeNull();
  });

  describe('disabled', () => {
    it('should be disabled if the action is open_plus_upgrade_modal and the user is plus', () => {
      (comp as any).session.getLoggedInUser.and.returnValue({
        ...userMock,
        plus: true,
      });
      (comp as any).data.action = 'open_plus_upgrade_modal';

      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('button')).nativeElement.disabled
      ).toBeTrue();
    });

    it('should NOT be disabled if the action is open_plus_upgrade_modal and the user is NOT plus', () => {
      (comp as any).session.getLoggedInUser.and.returnValue({
        ...userMock,
        plus: false,
      });
      (comp as any).data.action = 'open_plus_upgrade_modal';

      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('button')).nativeElement.disabled
      ).toBeFalse();
    });

    it('should be disabled if the action is open_pro_upgrade_modal and the user is pro', () => {
      (comp as any).session.getLoggedInUser.and.returnValue({
        ...userMock,
        pro: true,
      });
      (comp as any).data.action = 'open_pro_upgrade_modal';

      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('button')).nativeElement.disabled
      ).toBeTrue();
    });

    it('should NOT be disabled if the action is open_pro_upgrade_modal and the user is NOT pro', () => {
      (comp as any).session.getLoggedInUser.and.returnValue({
        ...userMock,
        pro: false,
      });
      (comp as any).data.action = 'open_pro_upgrade_modal';

      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('button')).nativeElement.disabled
      ).toBeFalse();
    });

    it('should be disabled if the action is open_register_modal and the user is logged in', () => {
      (comp as any).session.isLoggedIn.and.returnValue(true);
      (comp as any).data.action = 'open_register_modal';

      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('button')).nativeElement.disabled
      ).toBeTrue();
    });

    it('should NOT be disabled if the action is open_register_modal and the user is NOT logged in', () => {
      (comp as any).session.isLoggedIn.and.returnValue(false);
      (comp as any).data.action = 'open_register_modal';

      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('button')).nativeElement.disabled
      ).toBeFalse();
    });

    it('should return true if disabled becase in progress', () => {
      (comp as any).inProgress = true;
      expect(comp.disabled).toBe(true);
    });

    it('should return false if disabled becase NOT in progress', () => {
      (comp as any).inProgress = false;
      (comp as any).data.action = 'other_action';
      expect(comp.disabled).toBe(false);
    });
  });

  describe('onClick', () => {
    it('should handle button click when navigationUrl is set to a relative url', () => {
      const navigationUrl: string = '/url';
      comp.data.navigationUrl = navigationUrl;
      comp.onClick();

      expect((comp as any).router.navigateByUrl).toHaveBeenCalledWith(
        navigationUrl
      );
    });

    it('should handle button click when navigationUrl is set to an api URL', () => {
      spyOn(window, 'open');
      const navigationUrl: string = '/api/';
      comp.data.navigationUrl = navigationUrl;
      comp.onClick();

      expect(window.open).toHaveBeenCalledWith(navigationUrl, '_blank');
    });

    it('should handle button click when navigationUrl is set to an absolute URL', () => {
      spyOn(window, 'open');
      const navigationUrl: string = 'https://www.minds.com/';
      comp.data.navigationUrl = navigationUrl;
      comp.onClick();

      expect(window.open).toHaveBeenCalledWith(navigationUrl, '_blank');
    });

    it('should handle button click when action is set', () => {
      const action: StrapiAction = StrapiAction.ScrollToTop;
      (comp as any).data.action = action;
      comp.data.navigationUrl = '';
      comp.onClick();

      expect((comp as any).router.navigateByUrl).not.toHaveBeenCalled();
      expect((comp as any).strapiActionResolver.resolve).toHaveBeenCalledWith(
        action,
        {}
      );
    });

    it('should handle button click with an upgradeInterval of yearly when action is set to OpenPlusUpgradeModal', () => {
      (comp as any).pricingService.selectedTimePeriod$.next(
        ProductPageUpgradeTimePeriod.Annually
      );
      const action: StrapiAction = StrapiAction.OpenPlusUpgradeModal;
      (comp as any).data.action = action;
      comp.data.navigationUrl = '';
      comp.onClick();

      expect((comp as any).router.navigate).not.toHaveBeenCalled();
      expect((comp as any).strapiActionResolver.resolve).toHaveBeenCalledWith(
        action,
        {
          upgradeInterval: 'yearly',
        }
      );
    });

    it('should handle button click with an upgradeInterval of monthly when action is set to OpenPlusUpgradeModal', () => {
      (comp as any).pricingService.selectedTimePeriod$.next(
        ProductPageUpgradeTimePeriod.Monthly
      );
      const action: StrapiAction = StrapiAction.OpenPlusUpgradeModal;
      (comp as any).data.action = action;
      comp.data.navigationUrl = '';
      comp.onClick();

      expect((comp as any).router.navigate).not.toHaveBeenCalled();
      expect((comp as any).strapiActionResolver.resolve).toHaveBeenCalledWith(
        action,
        {
          upgradeInterval: 'monthly',
        }
      );
    });

    it('should handle button click with an upgradeInterval of yearly when action is set to OpenProUpgradeModal', () => {
      (comp as any).pricingService.selectedTimePeriod$.next(
        ProductPageUpgradeTimePeriod.Annually
      );
      const action: StrapiAction = StrapiAction.OpenProUpgradeModal;
      (comp as any).data.action = action;
      comp.data.navigationUrl = '';
      comp.onClick();

      expect((comp as any).router.navigate).not.toHaveBeenCalled();
      expect((comp as any).strapiActionResolver.resolve).toHaveBeenCalledWith(
        action,
        {
          upgradeInterval: 'yearly',
        }
      );
    });

    it('should handle button click with an upgradeInterval of monthly when action is set to OpenProUpgradeModal', () => {
      (comp as any).pricingService.selectedTimePeriod$.next(
        ProductPageUpgradeTimePeriod.Monthly
      );
      const action: StrapiAction = StrapiAction.OpenProUpgradeModal;
      (comp as any).data.action = action;
      comp.data.navigationUrl = '';
      comp.onClick();

      expect((comp as any).router.navigate).not.toHaveBeenCalled();
      expect((comp as any).strapiActionResolver.resolve).toHaveBeenCalledWith(
        action,
        {
          upgradeInterval: 'monthly',
        }
      );
    });

    it('should handle button click with an upgradeInterval of yearly when action is set to NetworksCommunityCheckout', () => {
      (comp as any).pricingService.selectedTimePeriod$.next(
        ProductPageUpgradeTimePeriod.Annually
      );
      const action: StrapiAction = StrapiAction.NetworksCommunityCheckout;
      (comp as any).data.action = action;
      (comp as any).data.stripeProductKey = 'networks:community';
      comp.data.navigationUrl = '';
      comp.onClick();

      expect((comp as any).router.navigate).not.toHaveBeenCalled();
      expect((comp as any).strapiActionResolver.resolve).toHaveBeenCalledWith(
        action,
        {
          stripeProductKey: 'networks:community',
          upgradeInterval: 'yearly',
        }
      );
    });

    it('should handle button click with an upgradeInterval of monthly when action is set to NetworksCommunityCheckout', () => {
      (comp as any).pricingService.selectedTimePeriod$.next(
        ProductPageUpgradeTimePeriod.Monthly
      );
      const action: StrapiAction = StrapiAction.NetworksCommunityCheckout;
      (comp as any).data.action = action;
      comp.data.navigationUrl = '';
      (comp as any).data.stripeProductKey = 'networks:community';
      comp.onClick();

      expect((comp as any).router.navigate).not.toHaveBeenCalled();
      expect((comp as any).strapiActionResolver.resolve).toHaveBeenCalledWith(
        action,
        {
          upgradeInterval: 'monthly',
          stripeProductKey: 'networks:community',
        }
      );
    });

    it('should handle button click with an upgradeInterval of yearly when action is set to NetworksTeamCheckout', () => {
      (comp as any).pricingService.selectedTimePeriod$.next(
        ProductPageUpgradeTimePeriod.Annually
      );
      const action: StrapiAction = StrapiAction.NetworksTeamCheckout;
      (comp as any).data.action = action;
      comp.data.navigationUrl = '';
      (comp as any).data.stripeProductKey = 'networks:team';
      comp.onClick();

      expect((comp as any).router.navigate).not.toHaveBeenCalled();
      expect((comp as any).strapiActionResolver.resolve).toHaveBeenCalledWith(
        action,
        {
          upgradeInterval: 'yearly',
          stripeProductKey: 'networks:team',
        }
      );
    });

    it('should handle button click with an upgradeInterval of monthly when action is set to NetworksTeamCheckout', () => {
      (comp as any).pricingService.selectedTimePeriod$.next(
        ProductPageUpgradeTimePeriod.Monthly
      );
      const action: StrapiAction = StrapiAction.NetworksTeamCheckout;
      (comp as any).data.action = action;
      (comp as any).data.stripeProductKey = 'networks:team';
      comp.data.navigationUrl = '';
      comp.onClick();

      expect((comp as any).router.navigate).not.toHaveBeenCalled();
      expect((comp as any).strapiActionResolver.resolve).toHaveBeenCalledWith(
        action,
        {
          upgradeInterval: 'monthly',
          stripeProductKey: 'networks:team',
        }
      );
    });

    it('should handle button click with an upgradeInterval of yearly when action is set to NetworksEnterpriseCheckout', () => {
      (comp as any).pricingService.selectedTimePeriod$.next(
        ProductPageUpgradeTimePeriod.Annually
      );
      const action: StrapiAction = StrapiAction.NetworksEnterpriseCheckout;
      (comp as any).data.action = action;
      comp.data.navigationUrl = '';
      (comp as any).data.stripeProductKey = 'networks:enterprise';
      comp.onClick();

      expect((comp as any).router.navigate).not.toHaveBeenCalled();
      expect((comp as any).strapiActionResolver.resolve).toHaveBeenCalledWith(
        action,
        {
          upgradeInterval: 'yearly',
          stripeProductKey: 'networks:enterprise',
        }
      );
    });

    it('should handle button click with an upgradeInterval of monthly when action is set to NetworksEnterpriseCheckout', () => {
      (comp as any).pricingService.selectedTimePeriod$.next(
        ProductPageUpgradeTimePeriod.Monthly
      );
      const action: StrapiAction = StrapiAction.NetworksEnterpriseCheckout;
      (comp as any).data.action = action;
      (comp as any).data.stripeProductKey = 'networks:enterprise';
      comp.data.navigationUrl = '';
      comp.onClick();

      expect((comp as any).router.navigate).not.toHaveBeenCalled();
      expect((comp as any).strapiActionResolver.resolve).toHaveBeenCalledWith(
        action,
        {
          upgradeInterval: 'monthly',
          stripeProductKey: 'networks:enterprise',
        }
      );
    });
  });
});
