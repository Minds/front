const { I } = inject();

/**
 * Onboarding V5 Survey Component - contains functions for the survey step.
 */
class OnboardingV5SurveyComponent {
  // selectors.
  private rootSelector: string = 'm-onboardingV5__radioSurveyContent';
  private optionInputSelector: string = 'input[formcontrolname="selectedKey"]';

  /**
   * Assert that component is visible.
   * @returns { void }
   */
  public isVisible(): void {
    I.seeElement(this.rootSelector);
  }

  /**
   * Select an option by index.
   * @param { number } optionIndex - index of option to select.
   * @returns { void }
   */
  public selectOptionByIndex(optionIndex: number): void {
    I.click(locate(this.optionInputSelector).at(optionIndex + 1));
  }
}

export = new OnboardingV5SurveyComponent();
