import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { Session } from '../../../../../services/session';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { Wallet, WalletV2Service } from '../../wallet-v2.service';
import { CashWalletService } from '../cash.service';
import { WalletSettingsCashComponent } from './settings-cash.component';

describe('WalletSettingsCashComponent', () => {
  let comp: WalletSettingsCashComponent;
  let fixture: ComponentFixture<WalletSettingsCashComponent>;

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
        declarations: [
          WalletSettingsCashComponent,
          MockComponent({
            selector: 'm-button',
          }),
          MockComponent({
            selector: 'm-icon',
            inputs: ['sizeFactor'],
          }),
          MockComponent({
            selector: 'm-walletCashOnboarding',
            inputs: ['allowedCountries', 'embedded'],
          }),
        ],
        providers: [
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
            provide: ChangeDetectorRef,
            useValue: MockService(ChangeDetectorRef),
          },
          {
            provide: Session,
            useValue: MockService(Session),
          },
          {
            provide: ElementRef,
            useValue: MockService(ElementRef),
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
    fixture = TestBed.createComponent(WalletSettingsCashComponent);
    comp = fixture.componentInstance;

    (comp as any).session.getLoggedInUser.and.returnValue({
      nsfw: [],
    });
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
    expect(comp.v2).toBeTrue();
  });

  it('should init with cashOnboardV2 to false if experiment is off', () => {
    (comp as any).cashService.isExperimentActive.and.returnValue(false);
    comp.ngOnInit();
    expect(comp.v2).toBeFalse();
  });
});
