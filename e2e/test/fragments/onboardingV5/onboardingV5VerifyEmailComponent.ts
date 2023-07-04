const { I } = inject();

/**
 * Verify email component for onboarding v5.
 */
class OnboardingV5VerifyEmailComponent {
  // selectors
  private codeInputSelector: string =
    '[data-test=onboarding-v5-verify-email-input]';

  /**
   * Fill the code input with the given code.
   * @param { string } code - code to fill input with.
   * @returns { void }
   */
  public fillCodeInput(code: string): void {
    I.fillField(this.codeInputSelector, code);
  }

  /**
   * Sets bypass cookie for MFA to allow a given code to be used to verify.
   * @param { string } code - code to set cookie value with.
   * @returns { void }
   */
  public setBypassCookieForCode(code: string): void {
    I.setMFABypassCookie(code);
  }
}

export = new OnboardingV5VerifyEmailComponent();
