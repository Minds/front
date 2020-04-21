import generateRandomId from '../../../support/utilities';

context('v2 Wire', () => {
  // Values

  const receiver = {
    username: generateRandomId(),
    password: `${generateRandomId()}!E2e`,
  };

  const amount = '0.001';

  // Elements
  const wireButton = 'm-wire-channel > div > button';
  const wireCreator = 'm-wireCreator';
  const wireAmount = `${wireCreator} [data-cy="wire-v2-amount"]`;
  const sendWire = `${wireCreator} [data-cy="wire-v2-send"] button`;

  // Tests

  beforeEach(() => {
    // Preserve cookies
    cy.preserveCookies();
  });

  it('should correctly send a payment to a test user', () => {
    // XHR rules
    cy.server();
    cy.route('POST', '**/api/v2/wire/*').as('wirePost');
    cy.route('GET', '**/api/v2/blockchain/wallet/balance*').as('balanceGet');

    // Wire process
    const sendAWire = to => {
      // Visit target's channel
      cy.visit(`/${to}`)
        .location('pathname')
        .should('contains', `/${to}`);

      // Click on the Wire button
      cy.get(wireButton)
        .click();

      // Check XHR
      cy.wait('@balanceGet').then(xhr => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal("success");
      });

      // Enter amount
      cy.get(wireAmount)
        .focus()
        .clear()
        .type(amount);

      // Send
      cy.get(sendWire)
        .click();

      // Check XHR
      cy.wait('@wirePost').then(xhr => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal("success");
      });

      // Expect the modal to be closed
      cy.get(wireCreator)
        .should('not.exist');
    };

    // Create a new temp receiver user
    cy.newUser(receiver.username, receiver.password, false);
    cy.logout();

    // Login with test user
    cy.login(true);

    // Override feature flags
    cy.overrideFeatureFlags({
      pay: true,
    });

    // Send a Wire
    sendAWire(receiver.username);

    // Logout
    cy.logout();

    // Login with temp receiver user
    cy.login(true, receiver.username, receiver.password);

    // Override feature flags
    cy.overrideFeatureFlags({
      pay: true,
    });

    // Send a Wire back to our user
    sendAWire(Cypress.env().username);

    // Delete it
    cy.deleteUser(receiver.username, receiver.password);
  });
});
