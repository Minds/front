export class ComposerModal {
  modalElementTag = 'm-composer__modal';

  /**
   * The wrapper element for the title input
   */
  public getTextareaTitle(): CodeceptJS.Locator {
    return locate(`${this.modalElementTag} .m-composerTextarea__title`);
  }

  /**
   * Toolbar items
   */
  get nsfwButton(): string {
    return `${this.modalElementTag} m-composer__toolbar [data-cy=nsfw-button]`;
  }
  get monetizeButton(): string {
    return `${this.modalElementTag} m-composer__toolbar [data-cy=monetize-button]`;
  }
  get supermindButton(): string {
    return `${this.modalElementTag} m-composer__toolbar [data-ref=supermind-create--button]`;
  }
  get postButton(): string {
    return `${this.modalElementTag} [data-cy=post-button]`;
  }

  /**
   * Popup screens
   */
  public getNsfwPopup(): CodeceptJS.Locator {
    return locate(`${this.modalElementTag} m-composer__popup m-composer__nsfw`);
  }
  public getMonetizePopup(): CodeceptJS.Locator {
    return locate(
      `${this.modalElementTag} m-composer__popup m-composer__monetizev2`
    );
  }
  public getSupermindPopup(): CodeceptJS.Locator {
    return locate(
      `${this.modalElementTag} m-composer__popup m-composer__supermind`
    );
  }
}
