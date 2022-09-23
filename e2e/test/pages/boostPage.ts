import generateRandomId from '../support/utilities';
require('dotenv').config();
const { I } = inject();

export = {
  activityBoostButton: '[data-cy=data-minds-activity-boost-button]',
  boostViewsInput: '[data-cy=data-minds-boost-modal-views-input]',
  tokensInput: '[data-cy=data-minds-boost-modal-tokens-input]',
  amountInputError: '[data-cy=data-minds-boost-modal-amount-error]',
  boostPostButtonDisabled:
    '[data-cy=data-minds-boost-modal-boost-button] button[disabled]',
  boostPostButton: '[data-cy=data-minds-boost-modal-boost-button] button',
  paymentSelector: '[data-cy=data-minds-boost-modal-method-select]',
  targetInput: '[data-cy=data-minds-boost-modal-target-input]',
  offersTab: '[data-cy=data-minds-boost-modal-offers-tab]',
  channelBoostButton: 'm-channelActions__boost m-button',

  createNewsfeedPost() {
    const postContent = 'Test boost, please reject...' + generateRandomId();
    I.seeElement('m-composer .m-composer__trigger');
    I.click('m-composer .m-composer__trigger');
    I.fillField(
      'm-composer__modal > m-composer__base [data-cy="composer-textarea"]',
      postContent
    );
    I.seeElement(
      'm-composer__modal > m-composer__base [data-cy="post-button"] button'
    );
    I.click(
      'm-composer__modal > m-composer__base [data-cy="post-button"] button'
    );
    I.waitForElement(
      locate('button')
        .withText('trending_up')
        .inside(
          locate('m-activity').withDescendant(
            locate('span').withText(postContent)
          )
        ),
      10
    );
    I.click(
      locate('button')
        .withText('trending_up')
        .inside(
          locate('m-activity').withDescendant(
            locate('span').withText(postContent)
          )
        )
    );
  },

  revokeBoost() {
    I.seeElement('.minds-avatar');
    I.click('.minds-avatar');
    I.click(locate('span').withText('Boost Console'));
    I.waitForElement('.m-boostCardManagerButton--revoke', 5);
    I.seeElement('.m-boostCardManagerButton--revoke');
    I.click('.m-boostCardManagerButton--revoke');
  },
};
