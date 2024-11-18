import { Storage } from '../utils/storage';
import { generateARandomString } from '../utils/utils';

const { I, confirmationModalComponent } = inject();
const storage: Storage = Storage.getInstance();

class ComposerModalComponent {
  public modalElementTag: string = 'm-composer__modal';
  private textAreaTitleSelector: string = `${this.modalElementTag} .m-composerTextarea__title`;
  public textAreaSelector: string = `${this.modalElementTag} [data-ref=composer-textarea]`;
  private postButtonSelector: string = `${this.modalElementTag} [data-ref=post-button]`;
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
  private supermindBadgeSelector: string = `${this.modalElementTag} m-supermindbadge`;
  private nsfwButtonSelector: string = `${this.modalElementTag} [data-ref=nsfw-button]`;
  private nsfwSaveButtonSelector: string = '[data-ref=nsfw-save-button]';
  private meatballMenuSelector: string = `${this.modalElementTag} [data-ref=meatball-menu-trigger]`;
  private postButtonDisabledOverlaySelector: string =
    '.m-composerToolbarAction__disabledOverlay';
  public composerCloseButton: string = '.m-composerPopup__close';
  public fileUploadButtonSelector: string =
    'm-composer__modal [data-ref=upload-button] input[type=file]';
  public supermindReplyConfirmButton: string =
    '[data-ref=data-minds-supermind-reply-confirmation-modal-confirm-button]';

  // audience selector panel.
  private audienceSelectorButtonSelector: string =
    '[data-ref=composer-audience-selector-button]';
  private audienceSelectorPanelSelector: string =
    'm-composer__audienceSelectorPanel';
  private audienceSelectorPanelChooseAudienceTitleSelector: string =
    '[data-ref=composer-audience-selector-choose-audience-title]';
  private audienceSelectorPanelShareToGroupTitleSelector: string =
    '[data-ref=composer-audience-selector-share-to-group-title]';
  private audienceSelectorPanelEntitySelector: string =
    '[data-ref=composer-audience-selector-selectable-entity-card]';
  private audienceSelectorPanelSubtitleSelector: string =
    '[data-ref=composer-audience-selector-my-groups-subtitle]';
  private audienceSelectorPanelGroupSectionSelector: string =
    '[data-ref=composer-audience-group-section]';
  private audienceSelectorPanelGroupExpandSelector: string =
    '[data-ref=composer-audience-group-expand]';
  private audienceSelectorPanelGroupCollapseSelector: string =
    '[data-ref=composer-audience-group-collapse]';
  private audienceSelectorPanelSaveButtonSelector: string =
    '[data-ref=composer-audience-selector-save-button]';
  private responseTypeSelector: string = 'label[for=response_type_live]';

  /**
   * Toolbar items
   */
  get nsfwButton(): string {
    return `${this.modalElementTag} m-composer__toolbar [data-ref=nsfw-button]`;
  }
  get monetizeButton(): string {
    return `${this.modalElementTag} m-composer__toolbar [data-ref=monetize-button]`;
  }
  get supermindButton(): string {
    return `${this.modalElementTag} m-composer__toolbar [data-ref=supermind-create--button]`;
  }
  get postButton(): string {
    return `${this.modalElementTag} [data-ref=post-button]`;
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
      I.waitForResponse((resp) => {
        return (
          resp.url().includes('/api/v3/newsfeed/activity') &&
          resp.status() === 200
        );
      }, 30),
    ]);
  }

  /**
   * Click post button for a Supermind, then accept and confirmation modal and await.
   * @return { Promise<void> }
   */
  public async clickToPostSupermindAndAwait(): Promise<void> {
    I.click(this.postButtonSelector);

    await Promise.all([
      I.click(confirmationModalComponent.confirmButtonSelector),
      I.waitForResponse((resp) => {
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
    I.clickAndWaitGqlOperation(
      locate(this.supermindButton),
      'FetchPaymentMethods'
    );
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

  public selectResponseType(responseTypeLabelText: string): void {
    I.click(locate(this.responseTypeSelector).withText(responseTypeLabelText));
  }

  /**
   * Click accept terms checkbox for supermind.
   * @return { void }
   */
  public acceptSupermindTerms(): void {
    I.wait(1);
    I.click(this.supermindTosCheckboxSelector);
  }

  /**
   * Click accept refund policy checkbox for supermind.
   * @return { void }
   */
  public acceptSupermindRefundPolicy(): void {
    I.wait(1);
    I.click(this.supermindRefundPolicyCheckboxSelector);
  }

  /**
   * Click Supermind save option.
   * @return { void }
   */
  public clickSupermindSave(): void {
    I.waitForElement(this.supermindSaveButtonSelector + ':not([disabled])');
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
   * Check whether supermind target user has or does not have input text
   * @param { boolean } shouldHave - whether component should have.
   * @return { void }
   */
  public shouldHaveSupermindTargetInputText(text: string): void {
    const supermindTargetInput = locate(
      this.supermindTargetInputSelector
    ).withText(text);

    I.seeElement(supermindTargetInput);
    return;
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
      'm-composer__modal > m-composer__base [data-ref="composer-textarea"]',
      postContent
    );
    I.seeElement(
      'm-composer__modal > m-composer__base [data-ref="post-button"] button'
    );
    I.click(
      'm-composer__modal > m-composer__base [data-ref="post-button"] button'
    );
    I.waitForElement(
      locate('button')
        .withText('trending_up')
        .inside(
          locate('m-activity').withDescendant(
            locate('span').withText(postContent)
          )
        )
    );
    if (textStorageKey) {
      storage.add(textStorageKey, postContent);
    }
  }

  /**
   * Create a new newsfeed post and stores the response from post creation
   * under the given key so that you can use it in future tests.
   * @param { string } responseStorageKey - store response under this key.
   * @returns { void }
   */
  public async createNewsfeedPostAndStoreResponse(
    responseStorageKey: string
  ): Promise<void> {
    const postContent = generateARandomString();
    I.seeElement('m-composer .m-composer__trigger');
    I.click('m-composer .m-composer__trigger');
    I.fillField(
      'm-composer__modal > m-composer__base [data-ref="composer-textarea"]',
      postContent
    );
    I.seeElement(
      'm-composer__modal > m-composer__base [data-ref="post-button"] button'
    );
    const response = await I.clickAndWait(
      locate(
        'm-composer__modal > m-composer__base [data-ref="post-button"] button'
      ),
      '/api/v3/newsfeed',
      200
    );

    storage.add(responseStorageKey, await response.json());

    I.waitForElement(
      locate('button')
        .withText('trending_up')
        .inside(
          locate('m-activity').withDescendant(
            locate('span').withText(postContent)
          )
        )
    );
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
        I.waitForResponse((resp) => {
          return resp.url().includes('/api/v1/media') && resp.status() === 200;
        }, 30),
      ]);
    }
  }

  /**
   * Click audience selector button.
   * @returns { void }
   */
  public clickAudienceSelectorButton(): void {
    I.click(this.audienceSelectorButtonSelector);
  }

  /**
   * Click audience selector button.
   * @returns { void }
   */
  public hasAudienceSelectorPopup(): void {
    I.seeElement(this.audienceSelectorPanelSelector);
    I.seeElement(this.audienceSelectorPanelSubtitleSelector);
    I.seeElement(this.audienceSelectorPanelGroupSectionSelector);
    I.seeElement(this.audienceSelectorPanelSaveButtonSelector);
  }

  /**
   * Wait for audience selector panel entities to appear.
   * @returns { void }
   */
  public waitForAudienceSelectorPopupEntities(): void {
    I.waitForElement(this.audienceSelectorPanelEntitySelector);
  }

  /**
   * Validates whether the audience selector group section is expanded or is not.
   * @param { boolean } expanded - whether it is expanded or not.
   * @returns { void }
   */
  public isAudienceSelectorGroupSectionExpanded(
    expanded: boolean = true
  ): void {
    if (expanded) {
      I.seeElement(this.audienceSelectorPanelGroupCollapseSelector);
      return;
    }
    I.seeElement(this.audienceSelectorPanelGroupExpandSelector);
  }
}

export = new ComposerModalComponent();
