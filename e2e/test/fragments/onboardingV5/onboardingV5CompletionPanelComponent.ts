const { I } = inject();

/**
 * Completion panel for onboarding v5. Shows for a brief period of time on success.
 */
class OnboardingV5CompletionPanelComponent {
  private rootSelector: string = 'm-onboardingV5__completedSplash';

  /**
   * Assert that component is visible.
   * @returns { void }
   */
  public isVisible(): void {
    I.seeElement(this.rootSelector);
  }

  /**
   * Assert that component is NOT visible.
   * @returns { void }
   */
  public isNotVisible(): void {
    I.dontSeeElement(this.rootSelector);
  }

  /**
   * Wait for the completion panel to appear and disappear.
   * @returns { void }
   */
  public waitForCompletion(): void {
    this.isVisible();
    I.wait(2);
    this.isNotVisible();
  }
}

export = new OnboardingV5CompletionPanelComponent();
