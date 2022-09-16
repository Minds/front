import { SidebarComponent } from '../components/sidebarComponent';
import { ComposerModal } from '../pages/composerModal';
import { NewsfeedPage } from '../pages/newsfeedPage';
import generateRandomId from '../support/utilities';

namespace ComposerSteps {
  const { I } = inject();

  const sidebarComponent = new SidebarComponent();
  const composerModal = new ComposerModal();
  const newsfeedPage = new NewsfeedPage();

  Given('I have clicked on the sidebar composer button', () => {
    sidebarComponent.openSidebarComposer();
  });

  Given('I have created a new post via the newsfeed', () => {
    newsfeedPage.openComposer();

    const message = 'Test post ' + generateRandomId();

    composerModal.typeInTextArea(message);
    composerModal.clickPost();
  });

  When('I click the nsfw icon on the composer toolbar', () => {
    composerModal.clickNsfwOption();
  });

  When('I select the {string} nsfw option', nsfwLabel => {
    I.click(nsfwLabel, '.m-composerNsfw__item');
  });

  When('I click the nsfw composer popup save button', () => {
    composerModal.clickNsfwSaveOption();
  });

  When('I add files via the upload button', table => {
    const tableByHeader = table.parse().hashes();
    for (const row of tableByHeader) {
      // TODO how do we make sure we're using the correct context (ie. modal or inline?)
      I.attachFile(
        'm-composer__modal [data-cy=upload-button] input[type=file]',
        '../supporting-files/' + row.filename
      );
    }
  });

  When('I click the post button', () => {
    composerModal.clickPost();
  });

  Then('I should see {int} previews of my selected imaged', num => {
    for (let i = 1; i <= num; i++) {
      I.seeElement(
        locate('m-composer__modal m-composerpreview--attachment').at(i)
      );
    }
  });

  Then('I should not see the title input', () => {
    I.dontSeeElement(composerModal.getTextareaTitle());
  });

  Then('I should see the title input', () => {
    I.seeElement(composerModal.getTextareaTitle());
  });

  Then('I am able to create the post', () => {
    // TODOD
  });

  Then('I should see the nsfw popout screen', () => {
    I.seeElement(composerModal.getNsfwPopup());
  });

  Then('I should see the nsfw icon is active on the composer toolbar', () => {
    I.seeElement(`${composerModal.nsfwButton}.m-composerToolbar__item--active`);
  });

  Then('I do not see the monetize icon on the composer toolbar', () => {
    I.dontSeeElement(composerModal.monetizeButton);
  });

  Then('I do not have the ability to schedule a post', () => {
    I.dontSeeElement(`${composerModal.postButton} m-dropdownmenu`);
  });
}
