import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { ConnectWalletNoticeComponent } from './connect-wallet-notice.component';
import { FeedNoticeService } from '../../services/feed-notice.service';
import { ConnectWalletModalService } from '../../../blockchain/connect-wallet/connect-wallet-modal.service';
import { BehaviorSubject } from 'rxjs';

describe('ConnectWalletNoticeComponent', () => {
  let comp: ConnectWalletNoticeComponent;
  let fixture: ComponentFixture<ConnectWalletNoticeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        ConnectWalletNoticeComponent,
        MockComponent({
          selector: 'm-feedNotice',
          inputs: ['icon', 'dismissible'],
          outputs: ['dismissClick'],
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'solid', 'size'],
          outputs: ['onAction'],
        }),
      ],
      providers: [
        {
          provide: FeedNoticeService,
          useValue: MockService(FeedNoticeService),
        },
        {
          provide: ConnectWalletModalService,
          useValue: MockService(ConnectWalletModalService, {
            has: ['isConnected$'],
            props: {
              isConnected$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(ConnectWalletNoticeComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should dismiss connect wallet notice if wallet is connected before modal dismissal', () => {
    (comp as any).connectWallet.isConnected$.next(true);
    expect((comp as any).feedNotice.dismiss).toHaveBeenCalledWith(
      'connect-wallet'
    );
  });

  it('should prompt to join rewards on primary option click', () => {
    comp.onPrimaryOptionClick(null);
    expect((comp as any).connectWallet.joinRewards).toHaveBeenCalledWith(
      jasmine.any(Function)
    );
  });

  it('should dismiss this notice', () => {
    comp.dismiss();
    expect((comp as any).feedNotice.dismiss).toHaveBeenCalledWith(
      'connect-wallet'
    );
  });
});
