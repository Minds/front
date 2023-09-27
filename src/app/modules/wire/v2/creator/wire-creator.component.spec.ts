import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { WireCreatorComponent } from './wire-creator.component';
import { WireType, WireUpgradeType, WireV2Service } from '../wire-v2.service';
import { WalletV2Service } from '../../../wallet/components/wallet-v2.service';
import { MindsUser } from '../../../../interfaces/entities';
import userMock from '../../../../mocks/responses/user.mock';
import { SupportTier, SupportTiersService } from '../support-tiers.service';
import { MockComponent, MockService } from '../../../../utils/mock';
import { WireService } from '../../wire.service';
import { Session } from '../../../../services/session';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ChangeDetectorRef } from '@angular/core';
import { AuthModalService } from '../../../auth/modal/auth-modal.service';

describe('WireCreatorComponent', () => {
  let comp: WireCreatorComponent;
  let fixture: ComponentFixture<WireCreatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        WireCreatorComponent,
        MockComponent({
          selector: 'm-loadingSpinner',
        }),
        MockComponent({
          selector: 'm-modalCloseButton',
        }),
      ],
      providers: [
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: Session, useValue: MockService(Session) },
        { provide: AuthModalService, useValue: MockService(AuthModalService) },
        ChangeDetectorRef,
      ],
    })
      .overrideProvider(WireService, {
        useValue: MockService(WireService),
      })
      .overrideProvider(WalletV2Service, {
        useValue: MockService(WalletV2Service),
      })
      .overrideProvider(SupportTiersService, {
        useValue: MockService(SupportTiersService),
      })
      .overrideProvider(WireV2Service, {
        useValue: MockService(WireV2Service, {
          has: [
            'owner$',
            'type$',
            'supportTier$',
            'upgrades',
            'upgradeType$',
            'wallet',
          ],
          props: {
            owner$: {
              get: () => new BehaviorSubject<MindsUser>(userMock),
            },
            type$: {
              get: () => new BehaviorSubject<WireType>('usd'),
            },
            supportTiers$: {
              get: () => new BehaviorSubject<SupportTier>(null),
            },
            upgrades$: {
              get: () => null,
            },
            upgradeType$: {
              get: () => new BehaviorSubject<WireUpgradeType>('plus'),
            },
            wallet: {
              get: () => null,
            },
          },
        }),
      });

    fixture = TestBed.createComponent(WireCreatorComponent);
    comp = fixture.componentInstance;
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('setModalData', () => {
    it('should set when sending a gift', () => {
      comp.setModalData({
        onComplete: () => {},
        onDismissIntent: () => {},
        entity: userMock,
        isSendingGift: true,
      });

      expect(comp.service.setIsSendingGift).toHaveBeenCalledWith(true);
      expect(comp.service.setType).toHaveBeenCalledWith('usd');
    });

    it('should set when receiving a gift', () => {
      comp.setModalData({
        onComplete: () => {},
        onDismissIntent: () => {},
        entity: userMock,
        isReceivingGift: true,
      });

      expect(comp.service.setIsReceivingGift).toHaveBeenCalledWith(true);
    });
  });
});
