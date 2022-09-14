import generateRandomId from '../support/utilities';
const { I } = inject();

export = {
  permawebURI: '/',

  newPostWithPermaweb() {
    const message = generateRandomId();
    I.fillField(
      'm-composer__modal > m-composer__base [data-cy="composer-textarea"]',
      message
    );
    I.click(locate('[data-cy=meatball-menu-trigger]').at(2));
    I.seeElement('[data-cy=meatball-menu-permaweb]');
    I.click('[data-cy=meatball-menu-permaweb]');
    I.seeElement(locate('span').withText('Post to Permaweb'));
    I.click(locate('span').withText('Post to Permaweb'));
    I.seeElement('[data-cy=permaweb-terms-checkbox]');
    I.click('[data-cy=permaweb-terms-checkbox]');
    I.seeElement('[data-cy=permaweb-terms-save-button]');
    I.click('[data-cy=permaweb-terms-save-button]');
    I.seeElement(
      'm-composer__modal > m-composer__base [data-cy="post-button"] button'
    );
    I.click(
      'm-composer__modal > m-composer__base [data-cy="post-button"] button'
    );
    I.seeElement('[data-cy=m-activity__permawebFlag]');
  },
};
