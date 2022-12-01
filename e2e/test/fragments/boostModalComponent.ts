import { BoostOptions, BoostTab } from '../types/boost-modal.types';

const { I } = inject();

/**
 * Boost Modal
 */
class BoostModalComponent {
  // selectors.
  private readonly boostViewsInputSelector: string =
    '[data-ref=boost-modal-views-input]';
  private readonly amountInputErrorSelector: string =
    '[data-ref=boost-modal-amount-error]';
  private readonly boostPostButtonDisabledSelector: string =
    '[data-ref=boost-modal-boost-button] button[disabled]';
  private readonly boostPostButtonSelector: string =
    '[data-ref=boost-modal-boost-button] button';
  private readonly tokenTabSelector: string =
    '[data-ref=boost-modal-tokens-tab]';
  private readonly cashTabSelector: string = '[data-ref=boost-modal-cash-tab]"';
  private readonly cashPaymentMethodSelector: string =
    '[data-ref=boost-modal-cash-payment-custom-selector]';
  private readonly defaultStripeSuccessCardSuffix: string = '4242';
  private readonly tabTitleSelector: string =
    '[data-ref=boost-modal-tab-title]';
  private readonly tabDescriptionSelector: string =
    '[data-ref=boost-modal-main-panel-description]';
  private readonly modalTitleSelector: string = '.m-modalV2Header__title';

  /**
   * Switch boost modal tab.
   * @param { BoostTab } tab - tab to switch to.
   * @returns { void }
   */
  public switchTab(tab: BoostTab) {
    I.click(tab === 'cash' ? this.cashTabSelector : this.tokenTabSelector, tab);
  }

  /**
   * Clear field and enter new amount of views.
   * @param { number } amount - amount of views.
   * @returns { void }
   */
  public enterViewInputAmount(amount: number): void {
    I.clearField(this.boostViewsInputSelector);
    I.fillField(this.boostViewsInputSelector, amount);
  }

  /**
   * Boost - when modal is open.
   * @param { BoostOptions } opts - options to boost with.
   * @returns { void }
   */
  public boost(opts: BoostOptions): void {
    if (opts.tab === 'tokens') {
      I.click(this.tokenTabSelector);
    }

    this.enterViewInputAmount(opts.impressions);

    if (opts.tab === 'cash') {
      I.waitForElement(
        locate(this.cashPaymentMethodSelector).withText(
          this.defaultStripeSuccessCardSuffix
        )
      );

      I.checkOption(
        'I understand this cash boost is non-refundable once it has been approved'
      );
    }

    I.click(this.boostPostButtonSelector);
    I.waitForElement(
      locate('p').withText('Success! Your boost request is being processed.')
    );
  }

  /**
   * Whether modal has errors with matching text.
   * @param { string } text - text to match.
   * @param { boolean } has - check whether component has or has no matching error.
   */
  public hasErrorWithText(text: string, has: boolean = true): void {
    if (has) {
      I.seeElement(locate(this.amountInputErrorSelector).withText(text));
    } else {
      I.dontSeeElement(locate(this.amountInputErrorSelector).withText(text));
    }
  }

  /**
   * Whether dismiss button is submitted.
   * @param { boolean } has - check whether component has or has no disabled submit button.
   * @returns { void }
   */
  public hasDisabledSubmitButton(has: boolean = true): void {
    if (has) {
      I.seeElement(this.boostPostButtonDisabledSelector);
    } else {
      I.dontSeeElement(this.boostPostButtonDisabledSelector);
    }
  }

  /**
   * Check whether modal has title text (at side when fullscreen).
   * @param { string } text - text to check for.
   * @returns { void }
   */
  public hasModalTitleWithText(text: string): void {
    I.seeElement(locate(this.modalTitleSelector).withText(text));
  }

  /**
   * Check whether modal has description with text.
   * @param { string } text - text to check for.
   * @returns { void }
   */
  public hasTabDescriptionWithText(text: string): void {
    I.seeElement(locate(this.tabDescriptionSelector).withText(text));
  }

  /**
   * Check whether modal has tab title with text.
   * @param { string } text - text to check for.
   * @returns { void }
   */
  public hasTabTitleWithText(text: string): void {
    I.seeElement(locate(this.tabTitleSelector).withText(text));
  }
}

export = new BoostModalComponent();
