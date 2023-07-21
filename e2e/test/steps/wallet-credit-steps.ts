import { fail } from 'assert';

namespace WalletCreditSteps {
  const { walletPage, walletCreditsPage } = inject();

  Given('I click the credits tab', () => {
    walletPage.clickCreditsTab();
  });

  When('I click to view a gift cards transactions', () => {
    walletCreditsPage.clickViewTransactionsOnCardAtPosition(1);
  });

  When(
    'I change the status filter to {string}',
    (statusFilterValue: string) => {
      if (statusFilterValue !== 'Active' && statusFilterValue !== 'Expired') {
        fail(`Invalid status filter value: ${statusFilterValue}`);
      }
      walletCreditsPage.changeStatusFilterTo(statusFilterValue);
    }
  );

  Then('I see my gift card balance summary', () => {
    walletCreditsPage.hasGiftCardBalanceSummary();
  });

  Then('I see the gift cards transaction history', () => {
    walletCreditsPage.hasTransactionsTable();
  });

  Then('I see my expired gift cards', () => {
    walletCreditsPage.hasExpiredGiftCards();
  });
}
