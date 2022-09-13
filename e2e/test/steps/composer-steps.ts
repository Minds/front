import SidebarComponent from '../components/sidebarComponent';
import { ComposerModal } from '../pages/composerModal';

namespace ComposerSteps {
  const { I, newsfeedPage } = inject();

  const sidebarComponent = new SidebarComponent();
  const composerModal = new ComposerModal();

  Given('I am on the newsfeed', () => {
    I.amOnPage(newsfeedPage.newsfeedURI);
  });

  Given('I have clicked on the sidebar composer button', () => {
    sidebarComponent.openSidebarComposer();
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
    I.click('m-composer__modal [data-cy=post-button]');
  });

  Then('I should see {int} previews of my selected imaged', num => {
    for (let i = 1; i <= num; i++) {
      I.seeElement(
        locate('m-composer__modal m-composerpreview--attachment').at(i)
      );
    }
  });

  //

  Then('I should not see the title input', () => {
    I.dontSeeElement(composerModal.getTextareaTitle());
  });

  Then('I should see the title input', () => {
    I.seeElement(composerModal.getTextareaTitle());
  });

  //

  Then('I cannot post', (state: string) => {
    composerModal.checkPostDisabled();
  });

  Then('I am able to create the post', () => {
    // TODOD
  });
}
