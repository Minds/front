import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VerifyEmailNoticeComponent } from './verify-email-notice.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { EmailResendService } from '../../../../common/services/email-resend.service';
import { EmailConfirmationService } from '../../../../common/components/email-confirmation/email-confirmation.service';
import { EmailCodeExperimentService } from '../../../experiments/sub-services/email-code-experiment.service';

describe('VerifyEmailNoticeComponent', () => {
  let comp: VerifyEmailNoticeComponent;
  let fixture: ComponentFixture<VerifyEmailNoticeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          VerifyEmailNoticeComponent,
          MockComponent({
            selector: 'm-feedNotice',
            inputs: ['icon', 'dismissible', 'stickyTop'],
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
            provide: EmailResendService,
            useValue: MockService(EmailResendService),
          },
          {
            provide: EmailConfirmationService,
            useValue: MockService(EmailConfirmationService),
          },
          {
            provide: EmailCodeExperimentService,
            useValue: MockService(EmailCodeExperimentService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
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

  it('should call to resend email on primary option click when experiment is not active', () => {
    (comp as any).emailCodeExperiment.isActive.and.returnValue(false);
    comp.onPrimaryOptionClick(null);
    expect((comp as any).emailConfirmation.verify).not.toHaveBeenCalled();
    expect((comp as any).emailResend.send).toHaveBeenCalled();
  });

  it('should call to confirm email on primary option click when experiment IS active', () => {
    (comp as any).emailCodeExperiment.isActive.and.returnValue(true);
    comp.onPrimaryOptionClick(null);
    expect((comp as any).emailResend.send).not.toHaveBeenCalled();
    expect((comp as any).emailConfirmation.verify).toHaveBeenCalled();
  });
});
