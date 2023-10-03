const { I } = inject();

class ExplainerScreenModalComponent {
  private rootSelector: string = 'm-explainScreenModal';
  private continueButtonSelector: string =
    'm-explainerScreenModal__toolbar m-button';

  /**
   * Click continue button.
   * @return { void }
   */
  public clickContinue(): void {
    I.click(this.continueButtonSelector);
  }

  /**
   * Check whether component is visible
   * @param { boolean } shouldBeVisible - whether we are asserting there is or is not a  modal
   * @returns { void }
   */
  public shouldBeVisible(shouldBeVisible: boolean = false): void {
    if (shouldBeVisible) {
      I.seeElement(this.rootSelector);
      return;
    }
    I.dontSeeElement(this.rootSelector);
  }
}

export = new ExplainerScreenModalComponent();
