import { TestBed } from '@angular/core/testing';
import { Session } from '../../../services/session';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import { BlockchainMarketingLinksService } from '../../../modules/blockchain/marketing/v2/blockchain-marketing-links.service';
import { StrapiActionResolverService } from './strapi-action-resolver.service';
import { MockService } from '../../../utils/mock';

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

  it('should log a warning if action is not recognized', () => {
    spyOn(console, 'warn');
    const action = 'unrecognized_action';

    service.resolve(action as any);

    expect(console.warn).toHaveBeenCalledWith(
      'Action not yet implemented: ',
      action
    );
  });
});
