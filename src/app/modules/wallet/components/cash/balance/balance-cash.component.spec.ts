import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Client } from '../../../../../services/api';
import { Session } from '../../../../../services/session';
import { MockService } from '../../../../../utils/mock';
import { PlusService } from '../../../../plus/plus.service';
import { Wallet, WalletV2Service } from '../../wallet-v2.service';
import { CashWalletService } from '../cash.service';
import { WalletBalanceCashComponent } from './balance-cash.component';

describe('WalletBalanceCashComponent', () => {
  let comp: WalletBalanceCashComponent;
  let fixture: ComponentFixture<WalletBalanceCashComponent>;

  const defaultWallet: Wallet = {
    loaded: true,
    tokens: {
      label: 'minds',
      unit: 'MINDS',
      balance: 0,
      address: '0x',
    },
    offchain: {
      label: 'minds',
      unit: 'MINDS',
      balance: 0,
      address: '0x',
    },
    onchain: {
      label: 'minds',
      unit: 'MINDS',
      balance: 0,
      address: '0x',
    },
    receiver: {
      label: 'minds',
      unit: 'MINDS',
      balance: 0,
      address: '0x',
    },
    cash: {
      label: 'minds',
      unit: 'MINDS',
      balance: 0,
      address: '0x',
    },
    eth: {
      label: 'minds',
      unit: 'MINDS',
      balance: 0,
      address: '0x',
    },
    btc: {
      label: 'minds',
      unit: 'MINDS',
      balance: 0,
      address: '0x',
    },
    limits: {
      wire: 123,
    },
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WalletBalanceCashComponent],
        providers: [
          {
            provide: Client,
            useValue: MockService(Client),
          },
          {
            provide: ChangeDetectorRef,
            useValue: MockService(ChangeDetectorRef),
          },
          {
            provide: Session,
            useValue: MockService(Session),
          },
          {
            provide: WalletV2Service,
            useValue: MockService(WalletV2Service, {
              has: ['wallet$'],
              props: {
                wallet$: {
                  get: () => new BehaviorSubject<Wallet>(defaultWallet),
                },
              },
            }),
          },
          {
            provide: ActivatedRoute,
            useValue: MockService(ActivatedRoute, {
              has: ['firstChild'],
              props: {
                firstChild: {
                  get: () => {
                    return { url: new BehaviorSubject([{ path: 'inbox' }]) };
                  },
                },
              },
            }),
          },
          {
            provide: PlusService,
            useValue: MockService(PlusService),
          },
          {
            provide: CashWalletService,
            useValue: MockService(CashWalletService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(WalletBalanceCashComponent);
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

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });

  it('should init with cashOnboardV2 to true if experiment is on', () => {
    (comp as any).cashService.isExperimentActive.and.returnValue(true);
    comp.ngOnInit();
    expect(comp.cashOnboardV2).toBeTrue();
  });

  it('should init with cashOnboardV2 to false if experiment is off', () => {
    (comp as any).cashService.isExperimentActive.and.returnValue(false);
    comp.ngOnInit();
    expect(comp.cashOnboardV2).toBeFalse();
  });
});
