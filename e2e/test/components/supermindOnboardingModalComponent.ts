const { I } = inject();

export class SupermindOnboardingModalComponent {
  private requestModalElementSelector: string =
    '[data-ref=supermind-onboarding-modal-request]';
  private replyModalElementSelector: string =
    '[data-ref=supermind-onboarding-modal-reply]';
  private continueButtonSelector: string =
    '[data-ref=supermind-onboarding-modal-continue-button]';

  /**
   * Click continue button.
   * @return { void }
   */
  public clickContinue(): void {
    I.click(this.continueButtonSelector);
  }

  /**
   * Check whether component is visible
   * @param { boolean } shouldBeVisible - whether we are asserting there is or is not a request onboarding modal
   * @returns { void }
   */
  public requestModalShouldBeVisible(shouldBeVisible: boolean = false): void {
    if (shouldBeVisible) {
      I.seeElement(this.requestModalElementSelector);
      return;
    }
    I.dontSeeElement(this.requestModalElementSelector);
  }

  /**
   * Check whether component is visible
   * @param { boolean } shouldBeVisible - whether we are asserting there is or is not a reply onboarding modal
   * @returns { void }
   */
  public replyModalShouldBeVisible(shouldBeVisible: boolean = false): void {
    if (shouldBeVisible) {
      I.seeElement(this.replyModalElementSelector);
      return;
    }
    I.dontSeeElement(this.replyModalElementSelector);
  }
}
