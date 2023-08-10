const { I } = inject();

class ConfirmationModalComponent {
  private modalElementSelector: string = 'm-confirmationModal';
  private titleTextSelector: string =
    '[data-ref=data-minds-confirmation-modal-title]';
  private bodyTextSelector: string =
    '[data-ref=data-minds-confirmation-modal-body]';
  private cancelButtonSelector: string =
    '[data-ref=data-minds-confirmation-modal-cancel-button]';
  public confirmButtonSelector: string =
    '[data-ref=data-minds-confirmation-modal-confirm-button]';

  /**
   * The modal's title text
   */
  public getTitle(): CodeceptJS.Locator {
    return locate(this.titleTextSelector);
  }

  /**
   * The modal's body text
   */
  public getBody(): CodeceptJS.Locator {
    return locate(this.bodyTextSelector);
  }

  /**
   * Click cancel button.
   * @return { void }
   */
  public clickCancel(): void {
    I.click(this.cancelButtonSelector);
  }

  /**
   * Click confirm button.
   * @return { void }
   */
  public clickConfirm(): void {
    I.click(this.confirmButtonSelector);
  }

  /**
   * Check whether component is visible
   * @param { boolean } shouldBeVisible - whether we are asserting there is or is not a confirmation modal
   * @returns { void }
   */
  public shouldBeVisible(shouldBeVisible: boolean = false): void {
    if (shouldBeVisible) {
      I.seeElement(this.modalElementSelector);
      return;
    }
    I.dontSeeElement(this.modalElementSelector);
  }
}

export = new ConfirmationModalComponent();
