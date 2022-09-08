import CommonPage from '../pages/commonPage';
import { ComposerModal } from '../pages/composerModal';

namespace SupermindSteps {
  const { I, newsfeedPage } = inject();

  const commonPage = new CommonPage();
  const composerModal = new ComposerModal();

  When('I click the supermind icon', () => {
    I.click(composerModal.getSupermindButton());
  });

  When('I enter a target username with value {string}', targetUsername => {
    I.fillField(
      locate('m-composer__supermind m-forminput__autocompleteuserinput input'),
      targetUsername
    );
  });

  When('I accept the supermind terms', () => {
    I.click('m-composer__supermind m-forminput__checkbox');
  });

  When('I click the supermind creator save button', () => {
    I.click('[data-ref=supermind-save-button]');
  });

  When('I click the supermind creator clear button', () => {
    I.click('[data-ref=supermind-clear-button]');
  });

  //

  Then('I should see the supermind popout screen', num => {
    I.seeElement(composerModal.getSupermindPopout());
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
}
