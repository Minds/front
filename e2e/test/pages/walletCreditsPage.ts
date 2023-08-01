const { I } = inject();

/**
 * Wallet credits page.
 */
class WalletCreditsPage {
  // selectors
  private creditsSummarySelector: string = 'm-walletv2__credits';
  private creditsSummaryBalance: string =
    '[data-test=wallet-credit-gift-card-balance]';
  private viewTransactionsLinkSelector: string =
    '[data-ref=gift-card-history-view-transactions-link]';
  private statusFilterSelector: string =
    '[data-ref=gift-card-history-status-filter-dropdown]';
  private statusFilterItem: string = `${this.statusFilterSelector} m-dropdownMenu__item`;

  private cardExpiryDateSelector: string =
    '.m-walletCreditsHistory__itemExpiryDate';

  private transactionsTableSelector: string = 'm-walletTransactionsTable';
  private transactionItemDetailsSelector: string =
    '.m-walletTransactionsTable__details';

  /**
   * Navigate to the wallet credits page.
   * @returns { void }
   */
  public navigateTo(): void {
    I.amOnPage('wallet/credits');
  }

  /**
   * Verify that page  has a gift card balance summary.
   * @returns { void }
   */
  public hasGiftCardBalanceSummary(): void {
    I.seeElement(this.creditsSummarySelector);
    I.seeElement(locate(this.creditsSummaryBalance).withText('$'));
  }

  /**
   * Click the view transactions link on a gift card at the
   * given position in the gift card feed.
   * @returns { void }
   */
  public clickViewTransactionsOnCardAtPosition(position: number = 1): void {
    I.click(locate(this.viewTransactionsLinkSelector).at(position));
  }

  /**
   * Verify that the transactions table is visible and has a transaction
   * with the text "Credit".
   * @returns { void }
   */
  public hasTransactionsTable(): void {
    I.seeElement(this.transactionsTableSelector);
    I.seeElement(
      locate(this.transactionItemDetailsSelector).withText('Credit')
    );
  }

  /**
   * Change status filter to a given value.
   * @param { 'Active' | 'Expired' } statusFilterValue - value to change status filter to.
   * @returns { void }
   */
  public changeStatusFilterTo(statusFilterValue: 'Active' | 'Expired'): void {
    I.click(this.statusFilterSelector);
    I.click(locate(this.statusFilterItem).withText(statusFilterValue));
  }

  /**
   * Verify that the page has expired gift cards.
   * @returns { void }
   */
  public hasExpiredGiftCards(): void {
    I.seeElement(locate(this.cardExpiryDateSelector).withText('Expired'));
  }
}

export = new WalletCreditsPage();
