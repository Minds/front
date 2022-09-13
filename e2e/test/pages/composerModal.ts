const { I } = inject();
export class ComposerModal {
  private modalElementTag: string = 'm-composer__modal';
  private textAreaTitleSelector: string = `${this.modalElementTag} .m-composerTextarea__title`;
  private textAreaSelector: string =
    'm-composer__modal [data-cy=composer-textarea]';
  private postButtonSelector: string =
    'm-composer__modal [data-cy=post-button]';
  private supermindIconSelector: string =
    'm-composer__modal .m-composerToolbarItem__icon i';
  private tabSelector: string = '.m-tabs__tab';
  private supermindTargetInputSelector: string = '[placeholder="@username"]';
  private supermindAutoCompleteNameSelector: string =
    '.m-formInputAutocompleteUserInputUserItem__name';
  private supermindAmountSelector: string = '#offer_tokens';
  private supermindTosCheckboxSelector: string =
    '.m-composerPopup__checkbox .m-formInputCheckbox__custom';
  private supermindSaveButtonSelector: string =
    '[data-ref=supermind-save-button]';
  private supermindBadgeSelector: string = '.m-paywallBadge__tierName';
  private nsfwButtonSelector: string =
    'm-composer__modal [data-cy=nsfw-button]';
  private nsfwSaveButtonSelector: string = '[data-cy=nsfw-save-button]';
  private meatballMenuSelector: string =
    'm-composer__modal [data-cy=meatball-menu-trigger]';
  private postButtonDisabledOverlaySelector: string =
    '.m-composerToolbarAction__disabledOverlay';

  /**
   * The wrapper element for the title input
   */
  public getTextareaTitle(): CodeceptJS.Locator {
    return locate(this.textAreaTitleSelector);
  }

  /**
   * Type in composer text area.
   * @param { string } text - text to type.
   * @return { void }
   */
  public typeInTextArea(text: string): void {
    I.fillField(this.textAreaSelector, text);
  }

  /**
   * Click post button.
   * @return { void }
   */
  public clickPost(): void {
    I.click(this.postButtonSelector);
  }

  /**
   * Click NSFW option.
   * @return {  void }
   */
  public clickNsfwOption(): void {
    I.click(this.nsfwButtonSelector);
  }

  /**
   * Click NSFW Save option.
   * @return { void }
   */
  public clickNsfwSaveOption(): void {
    I.click(this.nsfwSaveButtonSelector);
  }

  /**
   * Check whether component has or does not have ellipsis menu.
   * @param { boolean } shouldHave - whether we are asserting there is or is not an ellipsis menu.
   * @returns { void }
   */
  public shouldHaveEllipsisMenu(shouldHave: boolean = false): void {
    if (shouldHave) {
      I.seeElement(this.meatballMenuSelector);
      return;
    }
    I.dontSeeElement(this.meatballMenuSelector);
  }

  /**
   * Check if post is disabled.
   * @return { void }
   */
  public checkPostDisabled(): void {
    I.seeElement(this.postButtonDisabledOverlaySelector);
  }

  /**
   * Click supermind icon.
   * @return { void }
   */
  public clickSupermindIcon(): void {
    I.click(locate(this.supermindIconSelector).withText('tips_and_updates'));
  }

  /**
   * Click supermind panel tab for given tabtext
   * @param { string } tabText - text of tab.
   */
  public clickSupermindPanelTab(tabText: string = 'Tokens'): void {
    I.click(locate(this.tabSelector).withText(tabText));
  }

  /**
   * Add supermind target.
   * @param { string } username - username to add as target.
   * @return { void }
   */
  public addSupermindTarget(username: string): void {
    I.click(this.supermindTargetInputSelector);
    I.fillField(this.supermindTargetInputSelector, username);
    I.click(locate(this.supermindAutoCompleteNameSelector).withText(username));
  }

  /**
   * Type in an amount for supermind.
   * @param { number } amount - amount to enter.
   */
  public enterSupermindAmount(amount: number = 1): void {
    I.fillField(this.supermindAmountSelector, amount);
  }

  /**
   * Click accept terms checkbox for supermind.
   * @return { void }
   */
  public acceptSupermindTerms(): void {
    I.click(this.supermindTosCheckboxSelector);
  }

  /**
   * Click Supermind save option.
   * @return { void }
   */
  public clickSupermindSave(): void {
    I.click(this.supermindSaveButtonSelector);
  }

  /**
   * Check whether component has or does not have a Supermind badge.
   * @param { boolean } shouldHave - whether component should have.
   * @return { void }
   */
  public shouldHaveSupermindBadge(shouldHave: boolean = false): void {
    const supermindBadge = locate(this.supermindBadgeSelector).withText(
      'Supermind'
    );
    if (shouldHave) {
      I.seeElement(supermindBadge);
      return;
    }
    I.dontSeeElement(supermindBadge);
  }
}
