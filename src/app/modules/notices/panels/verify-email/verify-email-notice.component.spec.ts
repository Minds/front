import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VerifyEmailNoticeComponent } from './verify-email-notice.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { EmailResendService } from '../../../../common/services/email-resend.service';
import { EmailConfirmationService } from '../../../../common/components/email-confirmation/email-confirmation.service';
import { FeedNoticeService } from '../../services/feed-notice.service';

describe('VerifyEmailNoticeComponent', () => {
  let comp: VerifyEmailNoticeComponent;
  let fixture: ComponentFixture<VerifyEmailNoticeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        VerifyEmailNoticeComponent,
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
        MockComponent({
          selector: 'm-tooltip',
        }),
      ],
      providers: [
        {
          provide: EmailResendService,
          useValue: MockService(EmailResendService),
        },
        {
          provide: FeedNoticeService,
          useValue: MockService(FeedNoticeService),
        },
        {
          provide: EmailConfirmationService,
          useValue: MockService(EmailConfirmationService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(VerifyEmailNoticeComponent);
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

  it('should call to confirm email on primary option click', () => {
    comp.onPrimaryOptionClick(null);
    expect((comp as any).emailResend.send).not.toHaveBeenCalled();
    expect((comp as any).emailConfirmation.confirm).toHaveBeenCalled();
  });

  it('should dismiss notice', () => {
    comp.dismiss();
    expect((comp as any).feedNotice.dismiss).toHaveBeenCalledWith(
      'verify-email'
    );
  });
});
