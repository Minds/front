import generateRandomId from '../support/utilities';

// TODO: 2020-12-16 - Discuss with Mark
context.skip('Subscription', () => {

  const subscribeButton = 'minds-button-subscribe > button';
  const messageButton = 'm-messenger--channel-button > button';
  const userDropdown = 'minds-button-user-dropdown > button';

  const username = generateRandomId();
  const password = `${generateRandomId()}0oA!`;

  before(() => {
    cy.newUser(username, password, true);
    cy.logout();
    cy.login(true);
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.overrideFeatureFlags({
      channels: false,
    });

    cy.intercept("POST", "**/api/v1/subscribe/*").as("subscribe");
    cy.intercept("DELETE", "**/api/v1/subscribe/*").as("unsubscribe");

    cy.visit(`/${username}/`)
      .location('pathname')
      .should('eq', `/${username}/`);
  });

  it('should allow a user to subscribe to another', () => {
    subscribe();
  });

  it('should allow a user to unsubscribe',() => {
    unsubscribe();
  });

  function subscribe() {
    cy.get("m-button button")
      .contains("Subscribe")
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
