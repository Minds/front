context('Subscription', () => {

  const user = 'minds';
  const subscribeButton = 'minds-button-subscribe > button';
  const messageButton = 'm-messenger--channel-button > button';
  const userDropdown = 'minds-button-user-dropdown > button';

  before(() => {
    cy.getCookie('minds_sess')
    .then((sessionCookie) => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.server();
    cy.route("POST", "**/api/v1/subscribe/*").as("subscribe");
    cy.route("DELETE", "**/api/v1/subscribe/*").as("unsubscribe");

    cy.visit(`/${user}/`);
    cy.location('pathname')
      .should('eq', `/${user}/`);
  });

  it('should allow a user to subscribe to another', () => {
    subscribe();
  });

  it('should allow a user to unsubscribe',() => {
    unsubscribe();
  });

  function subscribe() {
    cy.get(subscribeButton)
      .click()
      .wait('@subscribe').then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.equal("success");
    });
    cy.get(messageButton).should('be.visible')
  }

  function unsubscribe() {
    cy.get(userDropdown).click();
    cy.contains('Unsubscribe')
      .click()
      .wait('@unsubscribe').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal("success");
      });
    cy.get(subscribeButton).should('be.visible');
  }

});
