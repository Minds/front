context('Remind', () => {
  const remindText = 'remind test text';
  const textArea = '.m-modal__remindComposer m-text-input--autocomplete-container textarea';
  const sendButton = '.m-modalRemindComposer__send';
  const userMenu = 'm-usermenu__v3';

  before(() => {
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });
  });

  beforeEach(() => {
    cy.server();
    cy.route('POST', '**/api/v2/newsfeed/remind/*').as('postRemind');
    cy.route('GET', '**/api/v1/channel/**').as('getChannel');

    cy.get('.m-sidebarNavigation')
      .contains(Cypress.env().username)
      .click({force: true})
      .wait('@getChannel')
      .location('pathname')
      .should('eq', `/${Cypress.env().username}/`);
  });

  it('should allow a user to remind their post', () => {
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
