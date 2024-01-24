import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Session } from '../../../services/session';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import { BlockchainMarketingLinksService } from '../../../modules/blockchain/marketing/v2/blockchain-marketing-links.service';
import {
  StrapiAction,
  StrapiActionResolverService,
} from './strapi-action-resolver.service';
import { MockService } from '../../../utils/mock';
import { ModalService } from '../../../services/ux/modal.service';
import { WirePaymentHandlersService } from '../../../modules/wire/wire-payment-handlers.service';
import { Router } from '@angular/router';
import { ToasterService } from '../toaster.service';
import userMock from '../../../mocks/responses/user.mock';
import { WireCreatorComponent } from '../../../modules/wire/v2/creator/wire-creator.component';
import { OnboardingV5Service } from '../../../modules/onboarding-v5/services/onboarding-v5.service';
import { BehaviorSubject } from 'rxjs';

describe('StrapiActionResolverService', () => {
  let service: StrapiActionResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Session, useValue: MockService(Session) },
        { provide: AuthModalService, useValue: MockService(AuthModalService) },
        {
          provide: BlockchainMarketingLinksService,
          useValue: MockService(BlockchainMarketingLinksService),
        },
        { provide: ModalService, useValue: MockService(ModalService) },
        {
          provide: WirePaymentHandlersService,
          useValue: MockService(WirePaymentHandlersService),
        },
        {
          provide: OnboardingV5Service,
          useValue: MockService(OnboardingV5Service, {
            has: ['onboardingCompleted$'],
            props: {
              onboardingCompleted$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: Router, useValue: MockService(Router) },
        StrapiActionResolverService,
      ],
    });

    service = TestBed.inject(StrapiActionResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open register modal if user is not logged in and action is "open_composer"', () => {
    const action = 'open_composer';
    (service as any).session.isLoggedIn.and.returnValue(false);

    service.resolve(action);
    expect((service as any).authModal.open).toHaveBeenCalledWith({
      formDisplay: 'register',
    });
  });

  it('should open composer modal if user is logged in and action is "open_composer"', () => {
    const action = 'open_composer';
    (service as any).session.isLoggedIn.and.returnValue(true);

    service.resolve(action);
    expect((service as any).links.openComposerModal).toHaveBeenCalled();
  });

  it('should open liquidity provision modal if action is "open_uniswap_v2_liquidity"', () => {
    const action = 'open_uniswap_v2_liquidity';
    service.resolve(action);
    expect(
      (service as any).links.openLiquidityProvisionModal
    ).toHaveBeenCalled();
  });

  it('should open register modal if user is not logged in and action is "open_onchain_transfer_modal"', () => {
    const action = 'open_onchain_transfer_modal';
    (service as any).session.isLoggedIn.and.returnValue(false);

    service.resolve(action);
    expect((service as any).authModal.open).toHaveBeenCalledWith({
      formDisplay: 'register',
    });
  });

  it('should open transfer onchain modal if user is logged in and action is "open_onchain_transfer_modal"', () => {
    const action = 'open_onchain_transfer_modal';
    (service as any).session.isLoggedIn.and.returnValue(true);

    service.resolve(action);
    expect((service as any).links.openTransferOnchainModal).toHaveBeenCalled();
  });

  it('should open the register modal when directly requested', () => {
    (service as any).session.isLoggedIn.and.returnValue(false);
    const action = 'open_register_modal';

    service.resolve(action);

    expect((service as any).toaster.warn).not.toHaveBeenCalled();
    expect((service as any).authModal.open).toHaveBeenCalledWith({
      formDisplay: 'register',
    });
  });

  it('should NOT open the register modal when directly requested if logged in', () => {
    (service as any).session.isLoggedIn.and.returnValue(true);
    const action = 'open_register_modal';

    service.resolve(action);

    expect((service as any).toaster.warn).toHaveBeenCalledWith(
      'You are already logged in.'
    );
    expect((service as any).authModal.open).not.toHaveBeenCalledWith({
      formDisplay: 'register',
    });
  });

  it('should open the plus upgrade modal if user is logged in and the action is "open_plus_upgrade_modal"', fakeAsync(() => {
    (service as any).session.isLoggedIn.and.returnValue(true);
    (service as any).wirePaymentHandlers.get.and.returnValue(
      Promise.resolve(userMock)
    );

    const action = 'open_plus_upgrade_modal';

    service.resolve(action, { upgradeInterval: 'yearly' });
    tick();

    expect((service as any).modalService.present).toHaveBeenCalledWith(
      WireCreatorComponent,
      jasmine.objectContaining({
        size: 'lg',
        data: {
          entity: userMock,
          default: {
            type: 'money',
            upgradeType: 'plus',
            upgradeInterval: 'yearly',
          },
          onComplete: jasmine.any(Function),
        },
      })
    );
  }));

  it('should NOT open the plus upgrade modal if user is NOT logged in', fakeAsync(() => {
    (service as any).session.isLoggedIn.and.returnValue(false);

    const action = 'open_plus_upgrade_modal';

    service.resolve(action, { upgradeInterval: 'yearly' });
    tick();

    expect((service as any).modalService.present).not.toHaveBeenCalled();
  }));

  it('should open the pro upgrade modal if user is logged in and the action is "open_pro_upgrade_modal"', fakeAsync(() => {
    (service as any).session.isLoggedIn.and.returnValue(true);
    (service as any).wirePaymentHandlers.get.and.returnValue(
      Promise.resolve(userMock)
    );

    const action = 'open_pro_upgrade_modal';

    service.resolve(action, { upgradeInterval: 'yearly' });
    tick();

    expect((service as any).modalService.present).toHaveBeenCalledWith(
      WireCreatorComponent,
      jasmine.objectContaining({
        size: 'lg',
        data: {
          entity: userMock,
          default: {
            type: 'money',
            upgradeType: 'pro',
            upgradeInterval: 'yearly',
          },
          onComplete: jasmine.any(Function),
        },
      })
    );
  }));

  it('should NOT open the pro upgrade modal if user is NOT logged in', fakeAsync(() => {
    (service as any).session.isLoggedIn.and.returnValue(false);

    const action = 'open_pro_upgrade_modal';

    service.resolve(action, { upgradeInterval: 'yearly' });
    tick();

    expect((service as any).modalService.present).not.toHaveBeenCalled();
  }));

  it('should log a warning if action is not recognized', () => {
    spyOn(console, 'warn');
    const action = 'unrecognized_action';

    service.resolve(action as any);

    expect(console.warn).toHaveBeenCalledWith(
      'Action not yet implemented: ',
      action
    );
  });

  it('should checkout for networks team', () => {
    (service as any).session.isLoggedIn.and.returnValue(true);

    const action: StrapiAction = 'networks_team_checkout';
    const extraData: any = {
      stripeProductKey: 'stripeProductKey',
      upgradeInterval: 'monthly',
    };

    service.resolve(action as StrapiAction, extraData);

    expect((service as any).router.navigate).toHaveBeenCalledWith(
      ['/networks/checkout'],
      {
        queryParams: {
          planId: extraData.stripeProductKey,
          timePeriod: extraData.upgradeInterval,
        },
      }
    );
  });

  it('should checkout for networks team', () => {
    (service as any).session.isLoggedIn.and.returnValue(true);

    const action: StrapiAction = 'networks_community_checkout';
    const extraData: any = {
      stripeProductKey: 'stripeProductKey',
      upgradeInterval: 'monthly',
    };

    service.resolve(action as StrapiAction, extraData);

    expect((service as any).router.navigate).toHaveBeenCalledWith(
      ['/networks/checkout'],
      {
        queryParams: {
          planId: extraData.stripeProductKey,
          timePeriod: extraData.upgradeInterval,
        },
      }
    );
  });

  it('should checkout for networks team', () => {
    (service as any).session.isLoggedIn.and.returnValue(true);

    const action: StrapiAction = 'networks_enterprise_checkout';
    const extraData: any = {
      stripeProductKey: 'stripeProductKey',
      upgradeInterval: 'monthly',
    };

    service.resolve(action as StrapiAction, extraData);

    expect((service as any).router.navigate).toHaveBeenCalledWith(
      ['/networks/checkout'],
      {
        queryParams: {
          planId: extraData.stripeProductKey,
          timePeriod: extraData.upgradeInterval,
        },
      }
    );
  });

  describe('Auth handling', () => {
    it('should retry action on user login from auth modal', fakeAsync(() => {
      const action = 'open_composer';
      (service as any).session.isLoggedIn.and.returnValues(false, true);
      (service as any).authModal.open.and.returnValue({
        ...userMock,
        email_confirmed: true,
      });

      service.resolve(action);
      tick();

      expect((service as any).authModal.open).toHaveBeenCalledWith({
        formDisplay: 'register',
      });
      expect((service as any).links.openComposerModal).toHaveBeenCalled();
    }));

    it('should retry action on user onboarding completion', fakeAsync(() => {
      const action = 'open_composer';
      (service as any).session.isLoggedIn.and.returnValues(false, true);
      (service as any).authModal.open.and.returnValue({
        ...userMock,
        email_confirmed: false,
      });

      service.resolve(action);
      tick();

      expect((service as any).authModal.open).toHaveBeenCalledWith({
        formDisplay: 'register',
      });
      expect((service as any).links.openComposerModal).not.toHaveBeenCalled();

      (service as any).onboardingV5Service.onboardingCompleted$.next(true);
      tick();

      expect((service as any).links.openComposerModal).toHaveBeenCalled();
    }));
  });
});
