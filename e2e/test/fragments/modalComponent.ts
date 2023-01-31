import Locator = CodeceptJS.Locator;

const { I } = inject();

/**
 * Component for ngb modals
 */
class ModalComponent {
  /**
   * Dismiss the modal by pressing escape key
   * @returns { void }
   */
  public dismissModal(): void {
    I.pressKey('Escape');
  }

  public isVisible(selector: Locator): void {
    I.seeElement(selector);
  }
}

export = new ModalComponent();
