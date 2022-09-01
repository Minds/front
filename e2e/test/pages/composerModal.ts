export class ComposerModal {
  private modalElementTag = 'm-composer__modal';

  /**
   * The wrapper element for the title input
   */
  public getTextareaTitle(): CodeceptJS.Locator {
    return locate(`${this.modalElementTag} .m-composerTextarea__title`);
  }
}
