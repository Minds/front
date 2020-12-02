import generateRandomId from '../support/utilities';

context('Permaweb', () => {

  const composer = {
    trigger: 'm-composer .m-composer__trigger',
    messageTextArea:
      'm-composer__modal > m-composer__base [data-cy="composer-textarea"]',
    postButton:
      'm-composer__modal > m-composer__base [data-cy="post-button"] [data-cy="button-default-action"]',
  };

  before(() => {
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (!sessionCookie) {
        return cy.login(true);
      }
    });
    cy.overrideFeatureFlags({ 'permaweb': true });
  });

  beforeEach(() => {
    cy.server();
    cy.route('POST', '**/v2/newsfeed**').as('postActivity');
  });

  it('should post an activity', () => {
    const message = generateRandomId();

    cy.openComposer();
    cy.get(composer.messageTextArea)
      .clear()
      .type(message);

    cy.get('[data-cy=meatball-menu-trigger]').eq(1).click();
    cy.get('[data-cy=meatball-menu-permaweb]').click();
    cy.contains('Post to Permaweb').click();
    cy.get('[data-cy=permaweb-terms-checkbox]').click();
    cy.get('[data-cy=permaweb-terms-save-button]').click();
    cy.get(composer.postButton).click();
    cy.wait('@postActivity').then(xhr => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.deep.equal('success');
    });
    
    cy.get('[data-cy=m-activity__permawebFlag]').should('be.visible');
  });

});
