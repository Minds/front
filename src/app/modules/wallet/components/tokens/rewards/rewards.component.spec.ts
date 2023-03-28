import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Injector } from '@angular/core';
import {
  ContributionMetric,
  WalletTokenRewardsService,
} from './rewards.service';
import { UniswapModalService } from '../../../../blockchain/token-purchase/uniswap/uniswap-modal.service';
import { OnchainTransferModalService } from '../../components/onchain-transfer/onchain-transfer.service';
import { WalletV2Service } from '../../wallet-v2.service';
import { VerifyUniquenessModalLazyService } from '../../../../verify-uniqueness/modal/services/verify-uniqueness-modal.service';
import { InAppVerificationExperimentService } from '../../../../experiments/sub-services/in-app-verification-experiment.service';
import { ConnectWalletModalService } from '../../../../blockchain/connect-wallet/connect-wallet-modal.service';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { WalletTokenRewardsComponent } from './rewards.component';
import { BehaviorSubject } from 'rxjs';
import { Session } from '../../../../../services/session';
import * as moment from 'moment';

describe('WalletTokenRewardsComponent', () => {
  let comp: WalletTokenRewardsComponent;
  let fixture: ComponentFixture<WalletTokenRewardsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          WalletTokenRewardsComponent,
          MockComponent({
            selector: 'm-date-selector',
            inputs: ['date', 'max', 'tooltipIcon', 'tooltipText', 'i18n'],
            outputs: ['dateChange'],
          }),
          MockComponent({
            selector: 'm-loadingSpinner',
            inputs: ['inProgress'],
          }),
          MockComponent({
            selector: 'm-wallet__currencyValue',
            inputs: ['value', 'hideCurrency', 'currency'],
          }),
          MockComponent({
            selector: 'm-tooltip',
            inputs: ['icon'],
          }),
        ],
        providers: [
          {
            provide: UniswapModalService,
            useValue: MockService(UniswapModalService),
          },
          { provide: Injector, useValue: MockService(Injector) },
          {
            provide: OnchainTransferModalService,
            useValue: MockService(OnchainTransferModalService),
          },
          { provide: WalletV2Service, useValue: MockService(WalletV2Service) },
          {
            provide: Session,
            useValue: MockService(Session, {
              has: ['userEmitter'],
              props: {
                userEmitter: { get: () => new BehaviorSubject<any>(null) },
              },
            }),
          },
          {
            provide: VerifyUniquenessModalLazyService,
            useValue: MockService(VerifyUniquenessModalLazyService),
          },
          {
            provide: InAppVerificationExperimentService,
            useValue: MockService(InAppVerificationExperimentService),
          },
          {
            provide: ConnectWalletModalService,
            useValue: MockService(ConnectWalletModalService, {
              has: ['isConnected$'],
              props: {
                isConnected$: { get: () => new BehaviorSubject<boolean>(true) },
              },
            }),
          },
        ],
      })
        .overrideProvider(WalletTokenRewardsService, {
          useValue: MockService(WalletTokenRewardsService, {
            has: [
              'hasPending$',
              'dateTs$',
              'contributionScores$',
              'liquidityPositions$',
              'rewards$',
            ],
            props: {
              hasPending$: { get: () => new BehaviorSubject<boolean>(false) },
              dateTs$: { get: () => new BehaviorSubject<number>(null) },
              contributionScores$: {
                get: () => new BehaviorSubject<ContributionMetric>(null),
              },
              liquidityPositions$: {
                get: () => new BehaviorSubject<any>(null),
              },
              rewards$: {
                get: () =>
                  new BehaviorSubject<any>({
                    total: '10000',
                    engagement: {
                      token_amount: '1000',
                      global_summary: {
                        token_amount: '1000',
                      },
                      alltime_summary: {
                        token_amount: '1000',
                      },
                    },
                    holding: {
                      token_amount: '1000',
                      global_summary: {
                        token_amount: '1000',
                      },
                      alltime_summary: {
                        token_amount: '1000',
                      },
                    },
                    liquidity: {
                      token_amount: '1000',
                      global_summary: {
                        token_amount: '1000',
                      },
                      alltime_summary: {
                        token_amount: '1000',
                      },
                    },
                    alltime_summary: {
                      token_amount: '1000',
                    },
                  }),
              },
            },
          }),
        })
        .compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(WalletTokenRewardsComponent);
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

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('it should know when the date is today', () => {
    comp.date = moment().toDate();
    expect(comp.isToday()).toBe(true);
  });

  it('it should know when the date is NOT today', () => {
    comp.date = moment()
      .subtract(2, 'days')
      .toDate();
    expect(comp.isToday()).toBe(false);
  });
});
