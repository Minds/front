const { I } = inject();

/**
 * Content settings component fragment.
 */
class ContentSettingsComponent {
  // selectors
  private readonly modalSelector: string = 'm-contentSettings';
  private readonly tagButtonSelector: string = '.m-tagSelector__button button';

  /**
   * Return whether modal is visible (optionally after a delay).
   * @param { number } afterSeconds - seconds to wait till checking.
   * @returns { Promise<boolean> }
   */
  public async isVisible(afterSeconds: number = 0): Promise<boolean> {
    I.wait(afterSeconds);
    return (await I.grabNumberOfVisibleElements(this.modalSelector)) >= 1;
  }

  /**
   * Click tag by it's numerical index.
   * @param { number } index - numerical index (starting at 1).
   */
  public clickTagByIndex(index: number): void {
    I.click(locate(this.tagButtonSelector).at(index));
  }

  /**
   * Click tag by it's inner text.
   * @param { number } tagValue - tag text.
   */
  public clickTagByText(tagValue: string): void {
    I.click(locate(this.tagButtonSelector).withText(tagValue));
  }

  /**
   * Click continue button.
   * @returns { void }
   */
  public clickContinue(): void {
    I.click(locate('button').withText('Continue'));
  }
}

export = new ContentSettingsComponent();
