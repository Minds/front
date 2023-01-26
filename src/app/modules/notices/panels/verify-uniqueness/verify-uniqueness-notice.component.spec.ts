import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { FeedNoticeService } from '../../services/feed-notice.service';
import { BehaviorSubject } from 'rxjs';
import { VerifyUniquenessNoticeComponent } from './verify-uniqueness-notice.component';
import { PhoneVerificationService } from '../../../wallet/components/components/phone-verification/phone-verification.service';
import { ConnectWalletModalService } from '../../../blockchain/connect-wallet/connect-wallet-modal.service';
import { InAppVerificationExperimentService } from '../../../experiments/sub-services/in-app-verification-experiment.service';
import { VerifyUniquenessModalLazyService } from '../../../verify-uniqueness/modal/services/verify-uniqueness-modal.service';

describe('VerifyUniquenessNoticeComponent', () => {
  let comp: VerifyUniquenessNoticeComponent;
  let fixture: ComponentFixture<VerifyUniquenessNoticeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          VerifyUniquenessNoticeComponent,
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
            useValue: MockService(ConnectWalletModalService),
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
            provide: PhoneVerificationService,
            useValue: MockService(PhoneVerificationService, {
              has: ['phoneVerified$'],
              props: {
                phoneVerified$: {
                  get: () => new BehaviorSubject<boolean>(false),
                },
              },
            }),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(VerifyUniquenessNoticeComponent);
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

  it('should dismiss if phone verification is completed', () => {
    (comp as any).phoneVerification.phoneVerified$.next(true);
    expect((comp as any).feedNotice.dismiss).toHaveBeenCalledWith(
      'verify-uniqueness'
    );
  });

  it('should dismiss', () => {
    comp.dismiss();
    expect((comp as any).feedNotice.dismiss).toHaveBeenCalledWith(
      'verify-uniqueness'
    );
  });

  it('should open connect wallet modal on primary option click', () => {
    comp.onPrimaryOptionClick(null);
    expect((comp as any).connectWalletModal.joinRewards).toHaveBeenCalledWith(
      jasmine.any(Function)
    );
  });
});
