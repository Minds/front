import {
  ComponentFixture,
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { OnboardingV5VerifyEmailContentComponent } from './verify-email.component';
import { OnboardingV5Service } from '../../../services/onboarding-v5.service';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { EmailConfirmationV2Service } from '../../../../../common/components/email-confirmation/email-confirmation-v2.service';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { ComponentOnboardingV5OnboardingStep } from '../../../../../../graphql/generated.strapi';

describe('OnboardingV5VerifyEmailContentComponent', () => {
  let comp: OnboardingV5VerifyEmailContentComponent;
  let fixture: ComponentFixture<OnboardingV5VerifyEmailContentComponent>;

  const mockData: ComponentOnboardingV5OnboardingStep = {
    title: 'title',
    description: 'description',
    actionButton: {
      dataRef: 'data-ref2',
      id: 'id2',
      text: 'Continue',
    },
    skipButton: null,
    carousel: null,
    id: null,
    stepType: null,
    stepKey: 'verify-email',
    verifyEmailForm: {
      id: '0',
      inputLabel: 'inputLabel',
      inputPlaceholder: 'inputPlaceholder',
      resendCodeActionText: 'click to {action}',
      resendCodeText: 'resend',
    },
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [
          OnboardingV5VerifyEmailContentComponent,
          MockComponent({
            selector: 'm-onboardingV5__footer',
            inputs: [
              'disabledActionButton',
              'actionButton',
              'skipButton',
              'saving',
            ],
            outputs: ['actionButtonClick', 'skipButtonClick'],
          }),
        ],
        providers: [
          {
            provide: OnboardingV5Service,
            useValue: MockService(OnboardingV5Service),
          },
          {
            provide: EmailConfirmationV2Service,
            useValue: MockService(EmailConfirmationV2Service),
          },
          { provide: ToasterService, useValue: MockService(ToasterService) },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingV5VerifyEmailContentComponent);
    comp = fixture.componentInstance;
    comp.title = 'Title';
    comp.description = 'Description';
    comp.data = mockData;

    (comp as any).emailConfirmation.sendEmail.and.returnValue(
      of({
        key: 'testKey',
      })
    );
    comp.confirmationKey = null;
    comp.ngOnDestroy();
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(comp).toBeTruthy();
  });

  it('should initialize the form group and call sendEmail', fakeAsync(() => {
    comp.confirmationKey = null;
    (comp as any).emailConfirmation.sendEmail.and.returnValue(
      of({
        key: 'testKey',
      })
    );

    comp.ngOnInit();
    tick();

    expect(comp.formGroup).toBeTruthy();
    expect((comp as any).emailConfirmation.sendEmail).toHaveBeenCalledWith(
      null
    );
    expect(comp.confirmationKey).toBe('testKey');
    expect((comp as any).toast.success).not.toHaveBeenCalled();

    discardPeriodicTasks();
    flush();
  }));

  it('should unsubscribe from the retry timer on component destruction', () => {
    comp.ngOnDestroy();
    expect((comp as any).retryTimerSubscription?.closed).toBeTrue();
  });

  it('should return the resendCodeString', () => {
    comp.data.verifyEmailForm.resendCodeText = 'click to {action}';
    comp.data.verifyEmailForm.resendCodeActionText = 'resend';

    expect(comp.resendCodeString).toContain(
      'click to <a class="m-onboardingV5VerifyEmail__resendCodeAction" style="cursor: pointer">resend</a>'
    );
  });

  it('should return the codeInputFormControl', () => {
    expect(comp.codeInputFormControl).toBe(comp.formGroup.get('code'));
  });

  it('should resend email and update confirmationKey on sendEmail call with resend param', fakeAsync(() => {
    comp.confirmationKey = 'oldTestKey';
    (comp as any).emailConfirmation.sendEmail.and.returnValue(
      of({
        key: 'testKey',
      })
    );

    (comp as any).sendEmail(true);
    tick();

    expect((comp as any).emailConfirmation.sendEmail).toHaveBeenCalledWith(
      'oldTestKey'
    );
    expect(comp.confirmationKey).toBe('testKey');
    expect((comp as any).toast.success).toHaveBeenCalled();

    discardPeriodicTasks();
    flush();
  }));

  it('should handle errors in sendEmail', fakeAsync(() => {
    (comp as any).emailConfirmation.sendEmail.and.returnValue({});
    comp.confirmationKey = null;

    (comp as any).sendEmail();
    tick();

    expect((comp as any).emailConfirmation.sendEmail).toHaveBeenCalled();
    expect(comp.confirmationKey).toBeNull();
    expect((comp as any).toast.error).toHaveBeenCalled();

    discardPeriodicTasks();
    flush();
  }));

  it('should handle resend code text click when seconds remaining is 0', () => {
    comp.retrySecondsRemaining = 0;
    spyOn(comp as any, 'sendEmail');
    comp.onResendCodeTextClick({
      target: { className: 'm-onboardingV5VerifyEmail__resendCodeAction' },
    } as any);
    expect((comp as any).sendEmail).toHaveBeenCalled();
  });

  it('should handle resend code text click when seconds remaining is greater than 0', () => {
    comp.retrySecondsRemaining = 10;
    spyOn(comp as any, 'sendEmail');
    comp.onResendCodeTextClick({
      target: { className: 'm-onboardingV5VerifyEmail__resendCodeAction' },
    } as any);
    expect((comp as any).sendEmail).not.toHaveBeenCalled();
    expect((comp as any).toast.warn).toHaveBeenCalled();
  });

  it('should submit code and call continue on onActionButtonClick', fakeAsync(() => {
    const code = '123456';
    comp.confirmationKey = 'testKey';
    (comp as any).emailConfirmation.submitCode.and.returnValue(of({}));

    comp.codeInputFormControl.setValue(code);
    fixture.detectChanges();

    comp.onActionButtonClick();
    tick();

    expect((comp as any).emailConfirmation.submitCode).toHaveBeenCalledWith(
      code,
      comp.confirmationKey
    );
    expect(
      (comp as any).emailConfirmation.updateLocalConfirmationState
    ).toHaveBeenCalled();
    expect((comp as any).service.continue).toHaveBeenCalled();
  }));

  it('should handle errors in code submission', fakeAsync(() => {
    const code = '123456';
    const error = {
      error: {
        errorId:
          'Minds::Core::Email::Confirmation::Exceptions::EmailConfirmationInvalidCodeException',
      },
    };
    comp.confirmationKey = 'testKey';
    (comp as any).emailConfirmation.submitCode.and.returnValue(
      throwError(() => error)
    );

    comp.codeInputFormControl.setValue(code);
    fixture.detectChanges();

    (comp as any).submitCode();
    tick();

    expect((comp as any).emailConfirmation.submitCode).toHaveBeenCalledWith(
      code,
      comp.confirmationKey
    );
    expect((comp as any).toast.error).toHaveBeenCalledWith(
      'The provided code is invalid.'
    );
  }));

  it('should handle unknown errors in code submission', fakeAsync(() => {
    const code = '123456';
    const error = {
      error: {
        errorId: 'Minds::Core::Email::Confirmation::Exceptions::Other',
      },
    };
    comp.confirmationKey = 'testKey';
    (comp as any).emailConfirmation.submitCode.and.returnValue(
      throwError(() => error)
    );

    comp.codeInputFormControl.setValue(code);
    fixture.detectChanges();

    (comp as any).submitCode();
    tick();

    expect((comp as any).emailConfirmation.submitCode).toHaveBeenCalledWith(
      code,
      comp.confirmationKey
    );
    expect((comp as any).toast.error).toHaveBeenCalledWith(
      'An unknown error has occurred.'
    );
  }));
});
