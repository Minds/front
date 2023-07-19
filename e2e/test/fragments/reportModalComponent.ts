const { I } = inject();

/**
 * Report Modal
 */
class ReportModalComponent {
  // selectors.
  private readonly reportModalSelector: string = 'm-report--creator';
  private readonly reportOption: string = '.m-reportCreatorSubjects__subject';
  private readonly successPanel: string = '.m-report-creator--success';

  /**
   * Select an option by given text.
   * @param { string } text - given text to select by.
   * @returns { void }
   */
  public selectOptionWithText(text: string): void {
    I.click(locate(this.reportOption).withText(text));
  }

  /**
   * Click the next button (shown for multi-option categories).
   * @returns { void }
   */
  public clickNextButton(): void {
    within(this.reportModalSelector, () => {
      I.click(locate('m-button').withText('Next'));
    });
  }

  /**
   * Click the submit button.
   * @returns { void }
   */
  public clickSubmitButton(): void {
    within(this.reportModalSelector, () => {
      I.click(locate('m-button').withText('Submit'));
    });
  }

  /**
   * Shown on success.
   * @returns { void }
   */
  public isSuccessPanelVisible(): void {
    I.seeElement(this.successPanel);
  }
}

export = new ReportModalComponent();
