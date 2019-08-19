/**
 * @author Ben Hayward
 * @create date 2019-08-11 23:46:00
 * @modify date 2019-08-11 23:46:00
 * @desc Spec tests for Wire transactions.
 */

context('Wire', () => {
  const wireButton = 'm-wire-channel > div > button';
  const sendButton = '.m-wire--creator-section--last > div > button';
  const modal = 'm-overlay-modal > div.m-overlay-modal';

  beforeEach(() => {
    cy.login();
    cy.wait(2000);
  });

  it('should allow a user to send a wire to another user', () => {
    // Visit users page.
    cy.visit('/minds');

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
