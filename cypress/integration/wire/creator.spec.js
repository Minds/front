/**
 * @author Ben Hayward
 * @create date 2019-08-11 23:46:00
 * @modify date 2019-08-11 23:46:00
 * @desc Spec tests for Wire transactions.
 */

import generateRandomId from "../../support/utilities";

context('v1 Wire', () => {
  const receiver = {
    username: generateRandomId(),
    password: generateRandomId()+'F!',
  };
  const sendAmount = "0.001";
  const amountInput = '[data-cy=data-minds-wire-amount-input]';

  const wireButton = 'm-wire-channel > div > button';
  const sendButton = '[data-cy=data-minds-wire-send-button]';
  const modal = 'm-overlay-modal > div.m-overlay-modal';

  it('should allow a user to send a wire to another user', () => {
    cy.server();
    cy.route('POST', '**/api/v2/wire/*').as('wirePost');
    cy.route('GET', '**/api/v2/blockchain/wallet/balance*').as('balanceGet');

    cy.preserveCookies();

    // Create a user
    cy.newUser(receiver.username, receiver.password, false);

    // Login with our test user
    cy.logout();
    cy.login(true);

    cy.overrideFeatureFlags({
      pay: false,
    });

    // Visit users page.
    cy.visit(`/${receiver.username}`);

    // Click profile wire button
    cy.get(wireButton)
      .click()
      .wait('@balanceGet').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal("success");
      });

    cy.get(amountInput)
      .clear()
      .type(sendAmount);
    // Click send button

    cy.get(sendButton)
      .click()
      .wait('@wirePost').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal("success");
      });

    //Make sure modal is hidden after 5 seconds.
    cy.get(modal).should('be.hidden');

    cy.logout();
    cy.login(true, receiver.username, receiver.password);

    cy.overrideFeatureFlags({
      pay: false,
    });

    cy.visit(`/${Cypress.env().username}`);

    // Click profile wire button
    cy.get(wireButton)
      .click()
      .wait('@balanceGet').then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.equal("success");
    });

    cy.get(amountInput)
      .clear()
      .type(sendAmount);

    // Click send button
    cy.get(sendButton)
      .click()
      .wait('@wirePost').then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.equal("success");
    });

    //Make sure modal is hidden after 5 seconds.
    cy.get(modal).should('be.hidden');
    cy.deleteUser(receiver.username, receiver.password);
  });
});
