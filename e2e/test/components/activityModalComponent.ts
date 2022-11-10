const { I } = inject();

/**
 * Component for Acivity Modal
 */
export class ActivityModalComponent {
  private modalElementSelector: string = 'm-activityv2__modal';

  /**
   * Whether modal is visible.
   * @returns { void }
   */
  public shouldBeVisible(): void {
    I.waitForElement(this.modalElementSelector, 30);
    I.seeElement(this.modalElementSelector);
  }
}
