const { I } = inject();

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
   * @returns { void }
   */
  public shouldSeeBoostRotator(shouldSeeBoostRotator: boolean): void {
    const boostRotatorActivity: CodeceptJS.Locator = locate(
      this.activitySelector
    ).inside(this.boostRotatorSelector);

    if (shouldSeeBoostRotator) {
      I.seeElement(boostRotatorActivity);
      return;
    }
    I.dontSeeElement(boostRotatorActivity);
  }
}

export = BoostRotatorComponent;
