const { I, activityComponent } = inject();

/**
 * Component for boost rotator.
 */
class BoostRotatorComponent {
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

  /**
   * Wait for boost feed rotator element to appear.
   * @returns { void }
   */
  public waitForBoostFeedRotator(withActivity: boolean = false): void {
    I.waitForElement(
      withActivity
        ? `${this.boostRotatorSelector} ${this.activitySelector}`
        : `${this.boostRotatorSelector}`,
      30
    );
  }

  /**
   * Toggle remind button - can remind or remove a remind.
   * @returns { void }
   */
  public async toggleRemind(): Promise<void> {
    await within(this.boostRotatorSelector, () => {
      activityComponent.clickRemindButton();
    });
  }

  /**
   * Open composer by clicking to quote.
   * @returns { void }
   */
  public async openComposerForQuote(): Promise<void> {
    await within(this.boostRotatorSelector, () => {
      activityComponent.clickQuoteButton();
    });
  }
}

export = new BoostRotatorComponent();
