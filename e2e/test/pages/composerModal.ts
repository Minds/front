export class ComposerModal {
  private modalElementTag = 'm-composer__modal';

  /**
   * The wrapper element for the title input
   */
  public getTextareaTitle(): CodeceptJS.Locator {
    return locate(`${this.modalElementTag} .m-composerTextarea__title`);
  }

  /**
   * Toolbar items
   */
  public getSupermindButton(): CodeceptJS.Locator {
    return locate(
      `${this.modalElementTag} [data-ref=supermind-create--button]`
    );
  }

  /**
   * Popout screens
   */
  public getSupermindPopout(): CodeceptJS.Locator {
    return locate(
      `${this.modalElementTag} m-composer__popup m-composer__supermind`
    );
  }
}
