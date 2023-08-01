import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { OnboardingV5ChangeEmailContentComponent } from './change-email.component';
import { ComponentOnboardingV5VerifyEmailStep } from '../../../../../../../graphql/generated.strapi';
import { MockComponent, MockService } from '../../../../../../utils/mock';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { SettingsV2Service } from '../../../../../settings-v2/settings-v2.service';
import { Session } from '../../../../../../services/session';
import userMock from '../../../../../../mocks/responses/user.mock';

describe('OnboardingV5ChangeEmailContentComponent', () => {
  let comp: OnboardingV5ChangeEmailContentComponent;
  let fixture: ComponentFixture<OnboardingV5ChangeEmailContentComponent>;

  const mockData: ComponentOnboardingV5VerifyEmailStep = {
    id: '0',
    inputLabel: 'inputLabel',
    inputPlaceholder: 'inputPlaceholder',
    resendCodeActionText: 'click to {action}',
    resendCodeText: 'resend',
    changeEmailActionButton: {
      dataRef: 'data-ref2',
      id: 'id2',
      text: 'Continue',
    },
    changeEmailActionText: 'Change email address',
    changeEmailDescription:
      'Mistyped your email? Change your email address below.',
    changeEmailInputLabel: 'New email address',
    changeEmailInputPlaceholder: 'Enter your email address',
    changeEmailTitle: 'Change email address',
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [
          OnboardingV5ChangeEmailContentComponent,
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
            provide: Session,
            useValue: MockService(Session),
          },
          {
            provide: SettingsV2Service,
            useValue: MockService(SettingsV2Service),
          },
          { provide: ToasterService, useValue: MockService(ToasterService) },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingV5ChangeEmailContentComponent);
    comp = fixture.componentInstance;

    comp.data = mockData;
    (comp as any).session.getLoggedInUser.and.returnValue(userMock);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(comp).toBeTruthy();
  });

  describe('onActionButtonClick', () => {
    it('should a successful email change', fakeAsync(() => {
      spyOn(comp.emailChanged, 'emit');

      const newEmail: string = 'noreply@minds.com';
      comp.newEmailFormControl.setValue(newEmail);

      (comp as any).settingsService.updateSettings
        .withArgs(userMock.guid, { email: newEmail })
        .and.returnValue(Promise.resolve({ status: 'success' }));

      comp.onActionButtonClick();
      tick();

      expect(
        (comp as any).settingsService.updateSettings
      ).toHaveBeenCalledOnceWith(userMock.guid, { email: newEmail });
      expect((comp as any).toast.error).not.toHaveBeenCalled();
      expect(comp.emailChanged.emit).toHaveBeenCalled();
    }));

    it('should handle a failed email change', fakeAsync(() => {
      spyOn(comp.emailChanged, 'emit');

      const newEmail: string = 'noreply@minds.com';
      comp.newEmailFormControl.setValue(newEmail);

      (comp as any).settingsService.updateSettings
        .withArgs(userMock.guid, { email: newEmail })
        .and.returnValue(Promise.reject({ message: 'EXPECTED ERROR' }));

      comp.onActionButtonClick();
      tick();

      expect(
        (comp as any).settingsService.updateSettings
      ).toHaveBeenCalledOnceWith(userMock.guid, { email: newEmail });
      expect((comp as any).toast.error).toHaveBeenCalled();
      expect(comp.emailChanged.emit).not.toHaveBeenCalled();
    }));
  });
});
