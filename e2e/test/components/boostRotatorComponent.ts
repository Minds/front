const { I } = inject();

/**
 * Component for boost rotator.
 */
export class BoostRotatorComponent {
  // selectors.
  private readonly boostRotatorSelector: string = '.m-newsfeed__boostRotator';
  private readonly activitySelector: string = 'm-activity';

  /**
   * Whether boost rotator should be seen
   * @param { boolean } shouldSeeBoostRotator - whether boost rotator should be seen.
   * @return { void }
   */
  public shouldSeeBoostRotator(shouldSeeBoostRotator: boolean): void {
    const boostRotatorActivity: CodeceptJS.Locator = locate(
      this.activitySelector
    ).inside(this.boostRotatorSelector);

    if (shouldSeeBoostRotator) {
      I.waitForElement(this.boostRotatorSelector, 30);
      return;
    }
    I.dontSeeElement(boostRotatorActivity);
  }

  /**
   * Wait for boost feed endpoint.
   * @return { void }
   */
  public waitForBoostFeedEndpoint(): void {
    I.waitForResponse(
      resp =>
        resp.url().includes('/api/v2/boost/feed') && resp.status() === 200,
      30
    );
  }
}
