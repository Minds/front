const { I } = inject();

/**
 * Component for ngb modals
 */
class ModalComponent {
  // selectors
  private modalSelector: string = 'ngb-modal-window .modal-content';
  private backdropSelector: string = 'ngb-modal-backdrop';

  /**
   * Click the modal backdrop
   * @returns { void }
   */
  public clickModalBackdrop(): void {
    I.click(locate(this.backdropSelector));
  }
}

export = new ModalComponent();
