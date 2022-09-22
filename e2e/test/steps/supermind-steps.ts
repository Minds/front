import { ChannelPage } from '../pages/channelPage';
import { ComposerModal } from '../pages/composerModal';

namespace SupermindSteps {
  const { I } = inject();
  const composerModal = new ComposerModal();
  const channelPage = new ChannelPage();

  Before(() => {});

  When('I click the supermind icon on the composer toolbar', () => {
    composerModal.clickSupermindIcon();
  });

  When('I enter a target username with value {string}', targetUsername => {
    composerModal.addSupermindTarget(targetUsername);
  });

  When('I accept the supermind terms', () => {
    composerModal.acceptSupermindTerms();
  });

  When('I click the supermind creator save button', () => {
    composerModal.clickSupermindSave();
  });

  When('I click the supermind creator clear button', () => {
    I.waitForElement(locate('button').withText('Clear'));
    I.click(locate('button').withText('Clear'));
  });

  When('I click on the channel supermind button', () => {
    I.waitForElement(channelPage.supermindButton, 5);
    I.click(channelPage.supermindButton);
  });

  When('I click the activity post supermind icon on the toolbar', () => {
    I.waitForElement('[data-ref=activity-icon-supermind-action] m-button');
    I.click('[data-ref=activity-icon-supermind-action] m-button');
  });

  Then('I should see the supermind popout screen', num => {
    I.seeElement(composerModal.getSupermindPopup());
  });

  Then('I see the supermind is in progress', () => {
    I.seeElement(
      '[data-ref=supermind-create--button].m-composerToolbar__item--active'
    );
  });

  Then('I should not see the supermind is in progress', () => {
    I.dontSeeElement(
      '[data-ref=supermind-create--button].m-composerToolbar__item--active'
    );
  });

  Then('I should not see the supermind icon on the composer toolbar', () => {
    composerModal.shouldHaveSupermindBadge(false);
  });

  Then('I should see prefilled supermind details in the composer', () => {
    I.waitForElement(composerModal.modalElementTag, 5);
    I.seeElement(composerModal.getSupermindPopup());
    I.waitForElement(composerModal.composerCloseButton);
    I.click(composerModal.composerCloseButton);
    I.pressKey('Escape');
  });

  After(() => {});
}
