import { BoostAudience, BoostTab } from '../types/boost-modal.types';
import { Storage } from '../utils/storage';

namespace BoostSteps {
  const { boostModalComponent, newsfeedPage, channelPage } = inject();
  const storage = Storage.getInstance();

  When(
    'I open the boost modal for the activity with storage key {string}',
    (storageKey: string) => {
      const text: string = storage.get(storageKey);
      newsfeedPage.openBoostModalForActivityWithText(text);
    }
  );

  When('I open my channel boost modal', () => {
    channelPage.openChannelBoostModal();
  });

  When('I select boost audience {string}', (audience: BoostAudience) => {
    boostModalComponent.selectBoostAudience(audience);
  });

  When('I click the next button', () => {
    boostModalComponent.clickNextButton();
  });

  When('I navigate to the {string} tab', (tab: BoostTab) => {
    boostModalComponent.navigateToBudgetTab(tab);
  });

  When('I set a daily budget of {string}', (dailyBudget: number) => {
    boostModalComponent.setDailyBudget(dailyBudget);
  });

  When('I set a duration of {string} days', (durationDays: number) => {
    boostModalComponent.setDuration(durationDays);
  });

  When(
    'I see the review panel audience is {string}',
    (audience: BoostAudience) => {
      boostModalComponent.seeReviewAudience(audience);
    }
  );

  When(
    'I see the review panel budget and duration is {string}',
    (text: string) => {
      boostModalComponent.seeReviewBudgetAndDuration(text);
    }
  );

  When('I see a card is selected', () => {
    boostModalComponent.seeReviewCashPaymentMethod('4242');
  });

  When('I see offchain tokens are selected', () => {
    boostModalComponent.seeReviewTokensPaymentMethod('offchain-tokens');
  });

  When('I see my total is {string}', (amountText: string) => {
    boostModalComponent.seeReviewTotalAmount(amountText);
  });

  When('I click to submit boost', () => {
    boostModalComponent.clickSubmitButton();
  });

  Then('I should see the safe option is disabled', () => {
    boostModalComponent.checkSafeOptionIsDisabled();
  });

  // Then('I can revoke a newsfeed boost', () => {

  // });

  // Then('I can revoke a channel boost', () => {

  // });
}
