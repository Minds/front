import { BoostTab } from '../types/boost-modal.types';
import { Storage } from '../utils/storage';

namespace BoostSteps {
  const { I, boostModalComponent, newsfeedPage, channelPage } = inject();
  const storage = Storage.getInstance();

  Then(
    'I can newsfeed boost the activity with storage key {string} for {string}',
    (storageKey: string, tab: BoostTab) => {
      const text: string = storage.get(storageKey);
      newsfeedPage.openBoostModalForActivityWithText(text);
      boostModalComponent.boost({
        tab: tab,
        impressions: 1000,
      });
    }
  );

  Then(
    'I see errors when setting invalid values when boosting the activity with storage key {string}',
    (storageKey: string) => {
      const text: string = storage.get(storageKey);
      newsfeedPage.openBoostModalForActivityWithText(text);

      // min
      boostModalComponent.enterViewInputAmount(499);
      boostModalComponent.hasDisabledSubmitButton(true);
      boostModalComponent.hasErrorWithText(
        'Sorry, you may only boost for a minimum of'
      );
      boostModalComponent.enterViewInputAmount(500);
      boostModalComponent.hasDisabledSubmitButton(false);
      boostModalComponent.hasErrorWithText(
        'Sorry, you may only boost for a minimum of',
        false
      );

      // max
      boostModalComponent.enterViewInputAmount(10000);
      boostModalComponent.hasDisabledSubmitButton(true);
      boostModalComponent.hasErrorWithText(
        'Sorry, you may only boost for a maximum of'
      );
      boostModalComponent.enterViewInputAmount(5000);
      boostModalComponent.hasDisabledSubmitButton(false);
      boostModalComponent.hasErrorWithText(
        'Sorry, you may only boost for a maximum of',
        false
      );
    }
  );

  Then('I can create a channel boost for {string}', (tab: BoostTab) => {
    channelPage.openChannelBoostModal();
    boostModalComponent.hasModalTitleWithText('Boost Channel');
    boostModalComponent.hasTabTitleWithText('Sidebar');
    boostModalComponent.hasTabDescriptionWithText(
      'Your content will appear on the sidebar across the site.'
    );
    boostModalComponent.boost({
      tab: tab,
      impressions: 1000,
    });
  });

  Then('I can revoke a newsfeed boost', () => {
    // TODO: Migrate into more appropriate context when we need to reuse.
    I.seeElement('.minds-avatar');
    I.click('.minds-avatar');
    I.click(locate('span').withText('Boost Console'));
    I.waitForElement('.m-boostCardManagerButton--revoke', 5);
    I.seeElement('.m-boostCardManagerButton--revoke');
    I.click('.m-boostCardManagerButton--revoke');
  });

  Then('I can revoke a sidebar boost', () => {
    // TODO: Migrate into more appropriate context when we need to reuse.
    I.seeElement('.minds-avatar');
    I.click('.minds-avatar');
    I.click(locate('span').withText('Boost Console'));
    I.click(locate('.m-topbar--navigation--item').withText('Sidebar'));
    I.waitForElement('.m-boostCardManagerButton--revoke', 5);
    I.seeElement('.m-boostCardManagerButton--revoke');
    I.click('.m-boostCardManagerButton--revoke');
  });
}
