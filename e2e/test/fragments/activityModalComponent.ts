const { I } = inject();

/**
 * Component for Acivity Modal
 */
class ActivityModalComponent {
  private modalElementSelector: string = 'm-activity__modal';

  /**
   * Whether modal is visible.
   * @returns { void }
   */
  public shouldBeVisible(): void {
    I.waitForElement(this.modalElementSelector, 30);
    I.seeElement(this.modalElementSelector);
  }
}

export = new ActivityModalComponent();
