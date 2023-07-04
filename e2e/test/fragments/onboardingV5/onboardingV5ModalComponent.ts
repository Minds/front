const {
  I,
  onboardingV5ModalComponent,
  onboardingV5VerifyEmailComponent,
  onboardingV5TagSelectorComponent,
  onboardingV5SurveyComponent,
  onboardingV5PublisherRecsComponent,
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
   * Whether continue button si disabled.
   * @returns { void }
   */
  public isContinueDisabled(): void {
    I.seeElement(`${this.continueButtonSelector} [disabled]`);
  }

  /**
   * Complete whole onboarding flow from registration to logged-in page landing.
   * @returns { void }
   */
  public completeOnboarding(): void {
    // verify email.
    const verificationCode: string = '123123';
    onboardingV5VerifyEmailComponent.setBypassCookieForCode(verificationCode);
    onboardingV5VerifyEmailComponent.fillCodeInput(verificationCode);
    I.wait(1);
    onboardingV5ModalComponent.clickContinue();

    // tags step.
    onboardingV5TagSelectorComponent.selectFirstTags(Number(3));
    onboardingV5ModalComponent.clickContinue();

    // survey step.
    onboardingV5SurveyComponent.selectOptionByIndex(1);
    onboardingV5ModalComponent.clickContinue();

    // user selector step.
    onboardingV5PublisherRecsComponent.selectRecommendationByIndex(0);
    onboardingV5ModalComponent.clickContinue();

    // group selector step.
    onboardingV5PublisherRecsComponent.selectRecommendationByIndex(0);
    onboardingV5ModalComponent.clickContinue();

    // completion step.
    onboardingV5CompletionPanelComponent.waitForCompletion();
  }
}

export = new OnboardingV5ModalComponent();
