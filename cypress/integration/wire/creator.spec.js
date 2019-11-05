/**
 * @author Ben Hayward
 * @create date 2019-08-11 23:46:00
 * @modify date 2019-08-11 23:46:00
 * @desc Spec tests for Wire transactions.
 */

import generateRandomId from "../../support/utilities";

// Issue to re-enable https://gitlab.com/minds/front/issues/1846
context.skip('Wire Creator', () => {

  const receiver = {
    username: generateRandomId(),
    password: generateRandomId()+'F!',
  }
  const sendAmount = 5000;
  const wireButton = 'm-wire-channel > div > button';
  const sendButton = '.m-wire--creator-section--last > div > button';
  const modal = 'm-overlay-modal > div.m-overlay-modal';

  before(() => {
    cy.newUser(receiver.username, receiver.password);
    cy.logout();
    
  });

  beforeEach(()=> {
    cy.preserveCookies();
    cy.login(true);
  });

  afterEach(() => {
    // cy.login(true, receiver.username, receiver.password);
    cy.visit(`/${Cypress.env().username}`);

    // Click profile wire button
    cy.get(wireButton).click();
    cy.wait(2000);

    // Click send button
    cy.get(sendButton).click();
    cy.wait(5000);
    
    //Make sure modal is hidden after 5 seconds.
    cy.get(modal).should('be.hidden');
  });

  it('should allow a user to send a wire to another user', () => {
    // Visit users page.
    cy.visit(`/${receiver.username}`);

    // Click profile wire button
    cy.get(wireButton).click();
    cy.wait(2000);

    // Click send button
    cy.get(sendButton).click();
    cy.wait(5000);
    
    //Make sure modal is hidden after 5 seconds.
    cy.get(modal).should('be.hidden');
  });
})
