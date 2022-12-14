import { Storage } from '../utils/storage';
import { generateARandomString } from '../utils/utils';

const { I } = inject();
const storage: Storage = Storage.getInstance();

class ComposerModalComponent {
  public modalElementTag: string = 'm-composer__modal';
  private textAreaTitleSelector: string = `${this.modalElementTag} .m-composerTextarea__title`;
  public textAreaSelector: string = `${this.modalElementTag} [data-cy=composer-textarea]`;
  private postButtonSelector: string = `${this.modalElementTag} [data-cy=post-button]`;
  private tabSelector: string = '.m-tabs__tab';
  public supermindTargetInputSelector: string = '[placeholder="@username"]';
  private supermindAutoCompleteNameSelector: string =
    '.m-formInputAutocompleteUserInputUserItem__name';
  private supermindAmountSelector: string = '#offer_tokens';
  private supermindTosCheckboxSelector: string =
    '[data-ref=supermind-terms-checkbox] .m-formInputCheckbox__custom';
  private supermindRefundPolicyCheckboxSelector: string =
    '[data-ref=supermind-refund-policy-checkbox] .m-formInputCheckbox__custom';
  private supermindSaveButtonSelector: string =
    '[data-ref=supermind-save-button]';
  private supermindBadgeSelector: string = 'm-supermindbadge';
  private nsfwButtonSelector: string = `${this.modalElementTag} [data-cy=nsfw-button]`;
  private nsfwSaveButtonSelector: string = '[data-cy=nsfw-save-button]';
  private meatballMenuSelector: string = `${this.modalElementTag} [data-cy=meatball-menu-trigger]`;
  private postButtonDisabledOverlaySelector: string =
    '.m-composerToolbarAction__disabledOverlay';
  public composerCloseButton: string = '.m-composerPopup__close';
  public fileUploadButtonSelector: string =
    'm-composer__modal [data-cy=upload-button] input[type=file]';
  public supermindReplyConfirmButton: string =
    '[data-ref=data-minds-supermind-reply-confirmation-modal-confirm-button]';

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
   * Click post button and await.
   * @return { Promise<void> }
   */
  public async clickPostAndAwait(): Promise<void> {
    await Promise.all([
      I.click(this.postButtonSelector),
      I.waitForResponse(resp => {
        return (
          resp.url().includes('/api/v3/newsfeed/activity') &&
          resp.status() === 200
        );
      }, 30),
    ]);
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
   * Click to confirm reply.
   * @returns { void }
   */
  public clickConfirmReplyButton(): void {
    I.click(this.supermindReplyConfirmButton);
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
    I.click(locate(this.supermindButton));
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
    const usernamedDropdownOption: CodeceptJS.Locator = locate({
      xpath: `//*[text()="${username}"]`,
    }).inside(this.supermindTargetInputSelector);
    I.waitForElement(usernamedDropdownOption);
    I.click(usernamedDropdownOption);
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
   * Click accept refund policy checkbox for supermind.
   * @return { void }
   */
  public acceptSupermindRefundPolicy(): void {
    I.click(this.supermindRefundPolicyCheckboxSelector);
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

  /**
   * Check whether composer toolbar has or does not have a Supermind icon.
   * @param { boolean } shouldHave - whether component should have.
   * @return { void }
   */
  public shouldHaveSupermindToolbarIcon(shouldHave: boolean = false): void {
    const supermindToolbarIcon = locate(this.supermindButton);
    if (shouldHave) {
      I.seeElement(supermindToolbarIcon);
      return;
    }
    I.dontSeeElement(supermindToolbarIcon);
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

  /**
   * Create a new newsfeed post
   * @param { string } textStorageKey - store text under this key.
   * @returns { void }
   */
  public createNewsfeedPost(textStorageKey: string = ''): void {
    const postContent = generateARandomString();
    I.seeElement('m-composer .m-composer__trigger');
    I.click('m-composer .m-composer__trigger');
    I.fillField(
      'm-composer__modal > m-composer__base [data-cy="composer-textarea"]',
      postContent
    );
    I.seeElement(
      'm-composer__modal > m-composer__base [data-cy="post-button"] button'
    );
    I.click(
      'm-composer__modal > m-composer__base [data-cy="post-button"] button'
    );
    I.waitForElement(
      locate('button')
        .withText('trending_up')
        .inside(
          locate('m-activity').withDescendant(
            locate('span').withText(postContent)
          )
        ),
      10
    );
    if (textStorageKey) {
      storage.add(textStorageKey, postContent);
    }
  }

  /**
   * Attach files.
   * @param { string[] } fileNames - file names.
   * @returns { Promise<void> }
   */
  public async attachFiles(fileNames: string[]): Promise<void> {
    for (const fileName of fileNames) {
      await Promise.all([
        I.attachFile(
          this.fileUploadButtonSelector,
          'supporting-files/img/' + fileName
        ),
        I.waitForResponse(resp => {
          return resp.url().includes('/api/v1/media') && resp.status() === 200;
        }, 30),
      ]);
    }
  }
}

export = new ComposerModalComponent();
