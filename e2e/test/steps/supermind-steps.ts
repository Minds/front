import { ComposerModal } from '../pages/composerModal';

namespace SupermindSteps {
  const { I } = inject();
  const composerModal = new ComposerModal();

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
    I.click('[data-ref=supermind-clear-button]');
  });

  //

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
}
