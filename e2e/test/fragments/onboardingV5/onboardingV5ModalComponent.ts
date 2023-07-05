import { Request } from 'playwright';
import mockOnboardingResponse from '../../scripts/generated/strapi-onboarding-version-response.json';

const {
  I,
  onboardingV5ModalComponent,
  onboardingV5VerifyEmailComponent,
  onboardingV5TagSelectorComponent,
  onboardingV5SurveyComponent,
  onboardingV5CompletionPanelComponent,
} = inject();

/**
 * Onboarding V5 Modal - contains functions common to all steps.
 */
class OnboardingV5ModalComponent {
  // selectors.
  private onboardingModalRootSelector: string = 'm-onboardingV5';

  private continueButtonSelector: string =
    '[data-test=onboarding-v5-footer-action-button]';

  private skipButtonSelector: string =
    '[data-test=onboarding-v5-footer-skip-button]';

  /**
   * Assert that component is visible.
   * @returns { void }
   */
  public isVisible(): void {
    I.seeElement(this.onboardingModalRootSelector);
  }

  /**
   * Click the continue button, and optionally wait for progress to save.
   * @param { boolean } waitForProgressSave - will wait for progress save to complete before continuing. Defaults to false.
   * @returns { Promise<void> }
   */
  public async clickContinue(
    waitForProgressSave: boolean = false
  ): Promise<void> {
    if (waitForProgressSave) {
      await I.clickAndWait(
        locate(this.continueButtonSelector),
        '/api/graphql',
        200
      );
      return;
    }
    I.click(this.continueButtonSelector);
  }

  /**
   * Click the skip button, and optionally wait for progress to save.
   * @param { boolean } waitForProgressSave - will wait for progress save to complete before continuing. Defaults to false.
   * @returns { Promise<void> }
   */
  public async clickSkip(waitForProgressSave: boolean = false): Promise<void> {
    if (waitForProgressSave) {
      await I.clickAndWait(
        locate(this.skipButtonSelector),
        '/api/graphql',
        200
      );
      return;
    }
    I.click(this.skipButtonSelector);
  }

  /**
   * Whether continue button si disabled.
   * @returns { void }
   */
  public isContinueDisabled(): void {
    I.seeElement(`${this.continueButtonSelector} [disabled]`);
  }

  /**
   * Complete whole onboarding flow from registration to logged-in page landing.
   * @returns { Promise<void> }
   */
  public async completeOnboarding(): Promise<void> {
    I.mockRouteAndBypassServiceWorker(
      '**/graphql',
      {
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOnboardingResponse),
      },
      (request: Request): boolean => {
        return request.postData().includes('FetchOnboardingV5Versions');
      }
    );

    // verify email.
    const verificationCode: string = '123123';
    onboardingV5VerifyEmailComponent.setBypassCookieForCode(verificationCode);
    onboardingV5VerifyEmailComponent.fillCodeInput(verificationCode);
    I.wait(1);
    await onboardingV5ModalComponent.clickContinue(true);

    // tags step.
    onboardingV5TagSelectorComponent.selectFirstTags(Number(3));
    await onboardingV5ModalComponent.clickContinue(true);

    // survey step.
    onboardingV5SurveyComponent.selectOptionByIndex(1);
    await onboardingV5ModalComponent.clickContinue(true);

    // user selector step.
    await onboardingV5ModalComponent.clickSkip(true);

    // group selector step.
    await onboardingV5ModalComponent.clickSkip(true);

    // completion step.
    onboardingV5CompletionPanelComponent.waitForCompletion();
  }
}

export = new OnboardingV5ModalComponent();
