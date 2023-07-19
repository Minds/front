const { I } = inject();

/**
 * Component for an activity - if there is multiple make sure to use these
 * functions within command scoped to a specific activity.
 */
class ActivityComponent {
  // selectors
  private activityMenuSelector: string = 'm-activity__menu';
  private optionSelector: string = '.m-dropdownMenuItem__text--label span';
  private remindButtonSelector: string =
    'm-activity__remindButton m-dropdownMenu';
  private commentPosterSelector: string = 'm-comment__poster';
  private textAreaSelector: string = 'minds-textarea';
  private timestampSelector: string = 'm-activity__permalink';

  /**
   * Delete the activity.
   * @returns { Promise<void> }
   */
  public async deleteActivity(): Promise<void> {
    this.openActivityMenu();
    await Promise.all([
      I.click(locate(this.optionSelector).withText('Delete post')),
      I.waitForResponse(resp => {
        return resp.url().includes('/api/v1/newsfeed') && resp.status() === 200;
      }, 30),
    ]);
  }

  /**
   * Open the report modal for the activity.
   * @returns { void }
   */
  public openReportModal(): void {
    this.openActivityMenu();
    I.click(locate(this.optionSelector).withText('Report post'));
  }

  /**
   * Enter text in the comment poster input box
   * @returns { void }
   */
  public enterTextInCommentPoster(text: string = 'foo'): void {
    I.click(locate(this.textAreaSelector).inside(this.commentPosterSelector));
    I.type(text);
  }

  /**
   * Click to remind/un-remind an activity.
   * @returns { void }
   */
  public clickRemindButton(): void {
    this.openRemindMenu();
    I.click(locate('.m-dropdownMenu__item').withText('Remind'));
  }

  /**
   * Click button to quote post - will open composer modal.
   * @returns { void }
   */
  public clickQuoteButton(): void {
    this.openRemindMenu();
    I.click(locate('.m-dropdownMenu__item').withText('Quote post'));
  }

  /**
   * Click the timestamp of a post, linking to the single entity page.
   * @returns { void }
   */
  public clickTimestamp(): void {
    I.click(this.timestampSelector);
  }

  /**
   * Open tha activity menu.
   * @returns { void }
   */
  private openActivityMenu(): void {
    I.click(this.activityMenuSelector);
  }

  /**
   * Open the remind menu.
   * @returns { void }
   */
  private openRemindMenu(): void {
    I.click(this.remindButtonSelector);
  }

  /**
   * Open the boost modal for the activity.
   * @returns { void }
   */
  public openBoostModal(): void {
    I.click(locate('button').withText('trending_up'));
  }
}

export = new ActivityComponent();
