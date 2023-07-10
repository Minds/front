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
    I.waitForElement(this.codeInputSelector);
    I.click(this.codeInputSelector);

    // press keys one by one else we trigger the paste event.
    for (let char of code.split('')) {
      I.pressKey(char);
    }
  }

  /**
   * Click the code input.
   * @returns { void }
   */
  public clickCodeInput(code: string): void {
    I.click(this.codeInputSelector);
  }

  /**
   * Sets bypass cookie for MFA to allow a given code to be used to verify.
   * @param { string } code - code to set cookie value with.
   * @returns { void }
   */
  public setBypassCookieForCode(code: string): void {
    I.setMFABypassCookie(code);
  }

  /**
   * Wait for email send response.
   * @returns { void }
   */
  public waitForEmailSendResponse(): void {
    I.waitForResponse(resp => {
      return resp.url().includes('/api/v3/email/send') && resp.status() === 200;
    });
  }
}

export = new OnboardingV5VerifyEmailComponent();
