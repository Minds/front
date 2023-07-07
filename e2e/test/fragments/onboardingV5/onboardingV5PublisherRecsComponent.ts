const { I } = inject();

/**
 * Publisher recs component for onboarding v5.
 * Shared between user and group panels.
 */
class OnboardingV5PublisherRecsComponent {
  // selectors.
  private rootSelector: string =
    'm-onboardingV5__channelRecommendationsContent';
  private publisherRecommendationsSelector: string =
    'm-publisherRecommendations';
  private optionSubscribeSelector: string = `${this.publisherRecommendationsSelector} button`;

  /**
   * Assert that component is visible.
   * @returns { void }
   */
  public isVisible(): void {
    I.seeElement(this.rootSelector);
  }

  /**
   * Assert that panel is in user recommendations mode.
   * @returns { void }
   */
  public isUserRecommendations(): void {
    I.seeElement(`${this.rootSelector}[publishertype="user"]`);
  }

  /**
   * Assert that panel is in group recommendations mode.
   * @returns { void }
   */
  public isGroupRecommendations(): void {
    I.seeElement(`${this.rootSelector}[publishertype="group"]`);
  }

  /**
   * Select a recommendation by index.
   * @param { number } recommendationIndex - index of recommendation to select.
   * @returns { void }
   */
  public selectRecommendationByIndex(recommendationIndex: number): void {
    I.click(locate(this.optionSubscribeSelector).at(recommendationIndex + 1));
  }
}

export = new OnboardingV5PublisherRecsComponent();
