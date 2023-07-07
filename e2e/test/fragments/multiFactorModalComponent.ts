const { I } = inject();

/**
 * Multi factor modal component - also used for email verification.
 */
class MultiFactorModalComponent {
  // selectors.
  private modalSelector: string = 'm-multiFactorAuth__email';
  private codeInputSelector: string = '.m-mfaAuth__formContainer input';

  /**
   * Enter a code - optionally set a bypass cookie matching the code.
   * @param { string } code - code to send.
   * @param { boolean } bypass - whether bypass cookie should be set.
   */
  public enterCode(code: string, bypass: boolean = false): void {
    if (bypass) {
      I.setMFABypassCookie(code);
    }
    I.fillField(this.codeInputSelector, code);
  }

  /**
   * Submit code.
   * @returns { void }
   */
  public submit(): void {
    I.click(
      locate('button')
        .inside(this.modalSelector)
        .withText('Verify')
    );
  }
}

export = new MultiFactorModalComponent();
