context('Remind', () => {
  const remindText = 'remind test text';
  const textArea = 'm-text-input--autocomplete-container textarea';
  const sendButton = '.m-modalRemindComposer__send';

  before(() => {
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });
    cy.overrideFeatureFlags({
      channels: false,
    });
    cy.visit(`/${Cypress.env().username}`);
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.server();
    cy.route('POST', '**/api/v2/newsfeed/remind/*').as('postRemind');
  });

  it('should allow a user to remind their post', () => {
    //post
    cy.overrideFeatureFlags(['composer']);
    cy.reload(); // reload to force feature flag

    //open remind composer
    cy.get('minds-button-remind > a')
      .first()
      .click();

    //fill out text box in modal
    cy.get(textArea)
      .focus()
      .clear()
      .type(remindText);

    //post remind.
    cy.get(sendButton)
      .click()
      .wait('@postRemind')
      .then(xhr => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal('success');
      });
  });
});
