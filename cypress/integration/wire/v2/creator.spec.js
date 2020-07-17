
context('v2 Wire', () => {
  // Values
  const receiver = {
    username: 'minds',
  };

  const amount = '0.001';

  // Elements
  const wireButton = 'm-wire-button';
  const wireCreator = 'm-wireCreator';
  const wireAmount = `${wireCreator} [data-cy="wire-v2-amount"]`;
  const sendWire = `${wireCreator} [data-cy="wire-v2-send"] button`;

  // Tests
  before(() => {
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (sessionCookie === null) {
        cy.login(true);
      }
    });
  });

  beforeEach(() => {
    // Preserve cookies
    cy.preserveCookies();

    // XHR rules
    cy.server();
    cy.route('POST', '**/api/v2/wire/*').as('wirePost');
    cy.route('GET', '**/api/v2/blockchain/wallet/balance*').as('balanceGet');    
  });

  it('should correctly send a payment to a test user', () => {
    // Send a Wire
    sendAWire(receiver.username);
  });

  // Wire process
  const sendAWire = to => {
    // Visit target's channel
    cy.visit(`/${to}`)
      .location('pathname')
      .should('contains', `/${to}`);

    // Click on the Wire button
    cy.get(wireButton)
      .first()
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
});
