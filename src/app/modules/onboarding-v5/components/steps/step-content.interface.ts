/**
 * Interface for onboarding steps to implement.
 */
export interface OnboardingStepContentInterface {
  /**
   * Step content must handle on skip button behaviour.
   * @returns { void }
   */
  onSkipButtonClick(): void;

  /**
   * Step content must handle behavior on action button click.
   * @returns { void }
   */
  onActionButtonClick(): void;
}
