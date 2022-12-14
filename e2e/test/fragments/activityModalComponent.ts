const { I } = inject();

/**
 * Component for Acivity Modal
 */
class ActivityModalComponent {
  private readonly modalElementSelector: string = 'm-activity__modal';
  private readonly modalActivityContentSelector: string = `${this.modalElementSelector} m-activity__content`;

  /**
   * Whether modal is visible.
   * @returns { void }
   */
  public shouldBeVisible(): void {
    I.waitForElement(this.modalActivityContentSelector, 30);
    I.seeElement(this.modalActivityContentSelector);
  }
}

export = new ActivityModalComponent();
