import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TopbarWalletBalance } from './topbar-wallet-balance.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { WalletV2Service } from '../../../../modules/wallet/components/wallet-v2.service';
import { BehaviorSubject } from 'rxjs';
import { ConnectWalletModalService } from '../../../../modules/blockchain/connect-wallet/connect-wallet-modal.service';
import { SettingsV2WalletService } from '../../../../modules/settings-v2/other/wallet/wallet.service';

describe('TopbarWalletBalance', () => {
  let comp: TopbarWalletBalance;
  let fixture: ComponentFixture<TopbarWalletBalance>;

  const tokenBalanceDefaultValue: number = 10;

  const walletDefaultValue: any = {
    tokens: {
      balance: tokenBalanceDefaultValue,
    },
  };

  const isConnectedDefaultValue: boolean = true;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          TopbarWalletBalance,
          MockComponent({
            selector: 'm-icon',
            inputs: ['iconId', 'from'],
          }),
        ],
        providers: [
          {
            provide: WalletV2Service,
            useValue: MockService(WalletV2Service, {
              has: ['wallet$'],
              props: {
                wallet$: {
                  get: () => new BehaviorSubject<any>(walletDefaultValue),
                },
              },
            }),
          },
          {
            provide: ConnectWalletModalService,
            useValue: MockService(ConnectWalletModalService, {
              has: ['isConnected$'],
              props: {
                isConnected$: {
                  get: () =>
                    new BehaviorSubject<boolean>(isConnectedDefaultValue),
                },
              },
            }),
          },
          {
            provide: SettingsV2WalletService,
            useValue: MockService(SettingsV2WalletService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(TopbarWalletBalance);
    comp = fixture.componentInstance;

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  describe('ngOnInit', () => {
    it('should initialize and load', () => {
      expect(comp).toBeTruthy();
      expect((comp as any).walletService.loadWallet).toHaveBeenCalled();
      expect((comp as any).tokenBalance).toBe(tokenBalanceDefaultValue);
      expect((comp as any).isConnected).toBe(isConnectedDefaultValue);
    });
  });

  describe('shouldShowWalletBalance', () => {
    it('should determine when to show wallet balance', () => {
      comp.isConnected = true;
      comp.tokenBalance = 1;
      (comp as any).walletPrivacySettings.shouldHideWalletBalance.and.returnValue(
        false
      );
      expect(comp.showWalletBalance()).toBeTrue();
    });

    it('should determine when NOT to show wallet balance because a wallet is not connected', () => {
      comp.isConnected = false;
      comp.tokenBalance = 1;
      (comp as any).walletPrivacySettings.shouldHideWalletBalance.and.returnValue(
        false
      );
      expect(comp.showWalletBalance()).toBeFalse();
    });

    it('should determine when NOT to show wallet balance because token balance is null', () => {
      comp.isConnected = true;
      comp.tokenBalance = undefined;
      (comp as any).walletPrivacySettings.shouldHideWalletBalance.and.returnValue(
        false
      );
      expect(comp.showWalletBalance()).toBeFalse();
    });

    it('should determine when NOT to show wallet balance because wallet privacy settings hide it', () => {
      comp.isConnected = true;
      comp.tokenBalance = 1;
      (comp as any).walletPrivacySettings.shouldHideWalletBalance.and.returnValue(
        true
      );
      expect(comp.showWalletBalance()).toBeFalse();
    });
  });
});
