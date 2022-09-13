import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  Wallet,
  WalletV2Service,
} from '../../../modules/wallet/components/wallet-v2.service';
import { MockComponent, MockService } from '../../../utils/mock';
import { AddBankPromptComponent } from './add-bank-prompt.component';

describe('AddBankPromptComponent', () => {
  let comp: AddBankPromptComponent;
  let fixture: ComponentFixture<AddBankPromptComponent>;

  const mockWallet: Wallet = {
    loaded: true,
    tokens: null,
    offchain: null,
    onchain: null,
    receiver: null,
    cash: {
      label: 'Cash',
      unit: 'Dollar',
      balance: 1,
      address: '0',
      stripeDetails: {
        pendingBalanceSplit: null,
        totalPaidOutSplit: null,
        hasAccount: true,
        hasBank: true,
        verified: true,
      },
    },
    eth: null,
    btc: null,
    limits: null,
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          AddBankPromptComponent,
          MockComponent({
            selector: 'm-loadingSpinner',
            inputs: ['inProgress'],
          }),
        ],
      })
        .overrideProvider(WalletV2Service, {
          useValue: MockService(WalletV2Service, {
            has: ['wallet$'],
            props: {
              wallet$: {
                get: () => new BehaviorSubject<Wallet>(mockWallet),
              },
            },
          }),
        })
        .compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(AddBankPromptComponent);
    comp = fixture.componentInstance;

    (comp as any).walletService.wallet$.next(mockWallet);
    comp.loaded$.next(true);

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
  });

  it('should determine if prompt should NOT show', (done: DoneFn) => {
    (comp as any).walletService.wallet$.next(mockWallet);
    comp.loaded$.next(true);
    comp.shouldShow$.pipe(take(1)).subscribe((shouldShow: boolean) => {
      expect(shouldShow).toBeFalse();
      done();
    });
  });

  it('should determine if prompt should show because loading is not done', (done: DoneFn) => {
    (comp as any).walletService.wallet$.next(mockWallet);
    comp.loaded$.next(true);
    comp.shouldShow$.pipe(take(1)).subscribe((shouldShow: boolean) => {
      expect(shouldShow).toBeFalse();
      done();
    });
  });

  it('should determine if prompt should show because hasAccount is false', (done: DoneFn) => {
    comp.hasAccount = false;
    comp.hasBank = true;
    comp.loaded$.next(true);

    comp.shouldShow$.pipe(take(1)).subscribe((shouldShow: boolean) => {
      expect(shouldShow).toBeTrue();
      done();
    });
  });

  it('should determine if prompt should show because hasBank is false', (done: DoneFn) => {
    comp.hasAccount = true;
    comp.hasBank = false;
    comp.loaded$.next(true);

    comp.shouldShow$.pipe(take(1)).subscribe((shouldShow: boolean) => {
      expect(shouldShow).toBeTrue();
      done();
    });
  });
});
