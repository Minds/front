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
}

export = new ModalComponent();
