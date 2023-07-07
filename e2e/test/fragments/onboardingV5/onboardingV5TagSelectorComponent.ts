const { I } = inject();

/**
 * Onboarding V5 Tag Selector Component - contains functions for the tag selector step.
 */
class OnboardingV5TagSelectorComponent {
  // selectors
  private rootSelector: string = 'm-onboardingV5__tagSelectorContent';
  private onboardingTagsSelector: string = '[data-test=onboarding-v5-tag]';
  private onboardingCustomTagInputSelector: string =
    '[data-test=onboarding-v5-tag-selector-custom-tag-input]';

  /**
   * Assert that component is visible.
   * @returns { void }
   */
  public isVisible(): void {
    I.seeElement(this.rootSelector);
  }

  /**
   * Select the first X tags.
   * @param { number } amountOfTags - amount of tags to select.
   * @returns { void }
   */
  public selectFirstTags(amountOfTags: number): void {
    for (let i = 0; i < amountOfTags; i++) {
      I.click(locate(this.onboardingTagsSelector).at(i + 1));
    }
  }

  /**
   * Adds a custom tag using custom tag input.
   * @param { string } tagText - text of the tag to add.
   * @returns { void }
   */
  public addCustomTag(tagText: string): void {
    I.fillField(this.onboardingCustomTagInputSelector, tagText);
    I.pressKey('Enter');
  }

  /**
   * Whether a given tag is present.
   * @param { string } tagText - text of the tag to check for presence of.
   * @returns { void }
   */
  public hasTag(tagText: string): void {
    I.seeElement(locate(this.onboardingTagsSelector).withText(tagText));
  }
}

export = new OnboardingV5TagSelectorComponent();
