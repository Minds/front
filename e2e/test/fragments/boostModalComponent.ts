import { BoostOptions, BoostTab } from "../types/boost-modal.types";

const { I } = inject();

class BoostModalComponent {
  private readonly activityBoostButtonSelector: string = '[data-cy=data-minds-activity-boost-button]';
  private readonly boostViewsInputSelector: string = '[data-ref=boost-modal-views-input]';
  private readonly tokensInputSelector: string = '[data-cy=data-minds-boost-modal-tokens-input]';
  private readonly amountInputErrorSelector: string = '[data-ref=boost-modal-amount-error]';
  private readonly boostPostButtonDisabledSelector: string = '[data-ref=boost-modal-boost-button] button[disabled]';
  private readonly boostPostButtonSelector: string = '[data-ref=boost-modal-boost-button] button';
  private readonly tokenTabSelector: string = '[data-ref=boost-modal-tokens-tab]';
  private readonly cashTabSelector: string = '[data-ref=boost-modal-cash-tab]"'
  private readonly targetInputSelector: string = '[data-cy=data-minds-boost-modal-target-input]';
  private readonly offersTabSelector: string = '[data-cy=data-minds-boost-modal-offers-tab]';
  private readonly channelBoostButtonSelector: string = 'm-channelActions__boost m-button';
  private readonly cashPaymentMethodSelector: string = '[data-ref=boost-modal-cash-payment-custom-selector]';
  private readonly defaultStripeSuccessCardSuffix: string = '4242';
  private readonly tabTitleSelector: string = '[data-ref=boost-modal-tab-title]';
  private readonly tabDescriptionSelector: string = '[data-ref=boost-modal-main-panel-description]';
  private readonly modalTitleSelector: string = '.m-modalV2Header__title';

  public switchTab(tab: BoostTab) {
    I.click(tab === 'cash' ? this.tokenTabSelector : this.cashTabSelector, tab);
  }

  public enterViewInputAmount(amount: number): void {
    I.clearField(this.boostViewsInputSelector);
    I.fillField(this.boostViewsInputSelector, amount);
  }

  public boost(opts: BoostOptions): void {
    if (opts.tab === 'tokens') {
      I.click(this.tokenTabSelector);
    }

    this.enterViewInputAmount(opts.impressions);

    if (opts.tab === 'cash') {
      I.waitForElement(locate(this.cashPaymentMethodSelector).withText(this.defaultStripeSuccessCardSuffix));
    }

    I.click(this.boostPostButtonSelector);
    I.waitForElement(
      locate('p').withText('Success! Your boost request is being processed.')
    );
  }

  public hasErrorWithText(text: string, has: boolean = true): void {
    if (has) {
      I.seeElement(locate(this.amountInputErrorSelector).withText(text));
    } else {
      I.dontSeeElement(locate(this.amountInputErrorSelector).withText(text));
    }
  }

  public hasDisabledSubmitButton(has: boolean = true) {
    if (has) {
      I.seeElement(this.boostPostButtonDisabledSelector);
    } else {
      I.dontSeeElement(this.boostPostButtonDisabledSelector);
    }
  }

  public hasModalTitleWithText(text: string) {
    I.seeElement(locate(this.modalTitleSelector).withText(text));
  }

  public hasTabDescriptionWithText(text: string): void {
    I.seeElement(locate(this.tabDescriptionSelector).withText(text));
  }

  public hasTabTitleWithText(text: string): void {
    I.seeElement(locate(this.tabTitleSelector).withText(text));
  }
}

export = new BoostModalComponent();

