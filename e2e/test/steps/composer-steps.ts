import { generateARandomString } from '../utils/utils';

namespace ComposerSteps {
  const {
    I,
    sidebarComponent,
    composerModalComponent,
    newsfeedPage,
  } = inject();

  Given('I have clicked on the sidebar composer button', () => {
    sidebarComponent.openSidebarComposer();
  });

  Given('I have created a new post via the newsfeed', () => {
    newsfeedPage.openComposer();

    const message = 'Test post ' + generateARandomString();

    composerModalComponent.typeInTextArea(message);
    composerModalComponent.clickPost();
  });

  //
  When('I click on the sidebar composer button', () => {
    sidebarComponent.openSidebarComposer();
  });

  When('I click the nsfw icon on the composer toolbar', () => {
    composerModalComponent.clickNsfwOption();
  });

  When('I select the {string} nsfw option', nsfwLabel => {
    I.click(nsfwLabel, '.m-composerNsfw__item');
  });

  When('I click the nsfw composer popup save button', () => {
    composerModalComponent.clickNsfwSaveOption();
  });

  When('I add files via the upload button', table => {
    const tableByHeader = table.parse().hashes();
    for (const row of tableByHeader) {
      // TODO how do we make sure we're using the correct context (ie. modal or inline?)
      I.attachFile(
        'm-composer__modal [data-ref=upload-button] input[type=file]',
        'supporting-files/img/' + row.filename
      );
    }
  });

  When('I enter {string} in the composer text area', message => {
    composerModalComponent.typeInTextArea(message);
  });

  When('I click the post button', () => {
    composerModalComponent.clickPost();
  });

  When('I create a post with text storage key {string}', textStorageKey => {
    composerModalComponent.createNewsfeedPost(textStorageKey);
  });

  When(
    'I create a post with response storage key {string}',
    async responseStorageKey => {
      await composerModalComponent.createNewsfeedPostAndStoreResponse(
        responseStorageKey
      );
    }
  );

  Then('I should see {int} previews of my selected imaged', num => {
    for (let i = 1; i <= num; i++) {
      I.seeElement(
        locate('m-composer__modal m-composerpreview--attachment').at(i)
      );
    }
  });

  Then('I should not see the title input', () => {
    I.dontSeeElement(composerModalComponent.getTextareaTitle());
  });

  Then('I should see the title input', () => {
    I.seeElement(composerModalComponent.getTextareaTitle());
  });

  Then('I am able to create the post', () => {
    // TODO
  });

  Then('I should see the nsfw popout screen', () => {
    I.seeElement(composerModalComponent.getNsfwPopup());
  });

  Then('I should see the nsfw icon is active on the composer toolbar', () => {
    I.seeElement(
      `${composerModalComponent.nsfwButton}.m-composerToolbar__item--active`
    );
  });

  Then('I do not see the monetize icon on the composer toolbar', () => {
    I.dontSeeElement(composerModalComponent.monetizeButton);
  });

  Then('I do not have the ability to schedule a post', () => {
    I.dontSeeElement(`${composerModalComponent.postButton} m-dropdownmenu`);
  });

  Then('I should see the composer', () => {
    I.seeElement(composerModalComponent.modalElementTag);
  });

  Then('I should still see the composer modal open', () => {
    I.seeElement(composerModalComponent.modalElementTag);
  });

  Then('the composer text area should be empty', () => {
    I.seeInField(composerModalComponent.textAreaSelector, '');
  });
}
