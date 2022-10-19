const { I } = inject();

/**
 * Component for an activity - if there is multiple make sure to use these
 * functions within command scoped to a specific activity.
 */
export class ActivityComponent {
  // selectors
  private activityMenuSelector: string = 'm-activityV2__menu';
  private optionSelector: string = '.m-dropdownMenuItem__text--label span';

  /**
   * Delete the activity.
   * @returns { Promise<void> }
   */
  public async deleteActivity(): Promise<void> {
    this.openActivityMenu();
    await Promise.all([
      I.click(locate(this.optionSelector).withText('Delete Post')),
      I.waitForResponse(resp => {
        return resp.url().includes('/api/v1/newsfeed') && resp.status() === 200;
      }, 30),
    ]);
  }

  /**
   * Open tha activity menu.
   * @returns { void }
   */
  private openActivityMenu(): void {
    I.click(this.activityMenuSelector);
  }
}
