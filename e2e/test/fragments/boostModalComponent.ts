import {
  BoostAudience,
  BoostTab,
  BoostTokenPaymentMethod,
} from '../types/boost-modal.types';

const { I } = inject();

/**
 * Boost Modal
 */
class BoostModalComponent {
  // audience panel
  private readonly controversialRadioButtonSelector: string =
    '[data-ref=boost-modal-v2-audience-selector-controversial-radio-button]';
  private readonly safeRadioButtonSelector: string =
    '[data-ref=boost-modal-v2-audience-selector-safe-radio-button]';

  // budget tab
  private readonly cashTabSelector: string =
    '[data-ref=boost-modal-v2-cash-tab]';
  private readonly tokensTabSelector: string =
    '[data-ref=boost-modal-v2-tokens-tab]';
  private readonly dailyBudgetSliderSelector: string =
    '[data-ref=boost-modal-v2-budget-tab-daily-budget-range-input] input';
  private readonly durationSliderSelector: string =
    '[data-ref=boost-modal-v2-budget-tab-duration-range-input] input';

  // review panel
  private readonly audienceReviewSelector: string =
    '[data-ref=boost-modal-v2-audience-text]';
  private readonly budgetAndDurationReviewSelector: string =
    '[data-ref=boost-modal-v2-budget-text]';
  private readonly paymentMethodCashReviewSelector: string =
    '[data-ref=boost-modal-v2-cash-payment-custom-selector]';
  private readonly paymentMethodTokensReviewSelector: string =
    '[data-ref=boost-modal-v2-token-payment-select]';
  private readonly totalAmountReviewSelector: string =
    '[data-ref=boost-modal-v2-total-amount-text]';

  // footer
  private readonly submitButton: string =
    '[data-ref=boost-modal-v2-footer-next-button]';

  /**
   * Select audience from a boost when on audience panel
   * @param { BoostAudience } audience - audience to select.
   * @returns { void }
   */
  public selectBoostAudience(audience: BoostAudience): void {
    I.click(
      audience === 'safe'
        ? this.safeRadioButtonSelector
        : this.controversialRadioButtonSelector
    );
  }

  /**
   * Navigate to a specific sub-tab of the budget tab.
   * @param { BoostTab } tab - tab to navigate to.
   * @returns { void }
   */
  public navigateToBudgetTab(tab: BoostTab): void {
    I.click(tab === 'cash' ? this.cashTabSelector : this.tokensTabSelector);
    if (tab === 'tokens') {
      I.click(locate('m-button button').withText('Confirm'));
    }
  }

  /**
   * Sets the daily budget slider value.
   * @param { number } dailyBudget - value to set.
   * @returns { void }
   */
  public setDailyBudget(dailyBudget: number): void {
    I.setRangeInputValue(this.dailyBudgetSliderSelector, dailyBudget - 1); // -1 because we use custom values and there is no 0
  }

  /**
   * Sets the duration slider value.
   * @param { number } durationDays - value to set.
   * @returns { void }
   */
  public setDuration(durationDays: number): void {
    I.setRangeInputValue(this.durationSliderSelector, durationDays);
  }

  /**
   * Verify the selected audience shown in the review panel.
   * @param { BoostAudience } audience - audience to verify is shown.
   * @returns { void }
   */
  public seeReviewAudience(audience: BoostAudience): void {
    I.seeElement(
      locate(this.audienceReviewSelector).withText(
        audience === 'safe' ? 'Safe' : 'Controversial'
      )
    );
  }

  /**
   * Verify budget and duration text shown in the review panel.
   * @param { string } text - text to check for.
   * @returns { void }
   */
  public seeReviewBudgetAndDuration(text: string): void {
    I.seeElement(locate(this.budgetAndDurationReviewSelector).withText(text));
  }

  /**
   * Verify cash payment method selector in review panel has text.
   * @param { string } text - text to check for.
   * @returns { void }
   */
  public seeReviewCashPaymentMethod(text: string): void {
    I.seeElement(locate(this.paymentMethodCashReviewSelector).withText(text));
  }

  /**
   * Verify that the tokens option dropdown in the review panel has the correct
   * selected value.
   * @param { BoostTokenPaymentMethod } tokenPaymentMethod - token payment method to check for.
   * @returns { void }
   */
  public seeReviewTokensPaymentMethod(
    tokenPaymentMethod: BoostTokenPaymentMethod
  ): void {
    I.seeInField(
      this.paymentMethodTokensReviewSelector,
      tokenPaymentMethod === 'offchain-tokens' ? '2' : '3'
    );
  }

  /**
   * Verify the total amount shown in the review panel matches the provided text.
   * @param { string } text - text to verify is shown.
   * @returns { void }
   */
  public seeReviewTotalAmount(text: string): void {
    I.seeElement(locate(this.totalAmountReviewSelector).withText(text));
  }

  /**
   * Click submit button.
   * @returns { void }
   */
  public clickSubmitButton(): void {
    I.click(locate(this.submitButton).withText('Boost'));
  }

  /**
   * Click next button.
   * @returns { void }
   */
  public clickNextButton(): void {
    I.click(locate(this.submitButton).withText('Next'));
  }
}

export = new BoostModalComponent();
