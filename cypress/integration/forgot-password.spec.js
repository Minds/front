context('Forgot Password', () => {

  beforeEach(() => {
    cy.clearCookies();
  });

  const forgotPasswordButton = '[data-cy=data-minds-forgot-password-button]';
  const usernameInput = '[data-cy=data-minds-forgot-password-input]';
  const submitButton = '[data-cy=data-minds-forgot-password-submit]';
  const password1 = '[data-cy=data-minds-forgot-password-text-input-1]';
  const password2 = '[data-cy=data-minds-forgot-password-text-input-2]';
  const errorText = '[data-cy=data-minds-forgot-password-error]';
  
  it('should let a user send an email to reset password', () => {
    cy.visit('/login')
      .location('pathname')
      .should('eq', '/login');

    // nav to forgot password page organically.
    cy.get(forgotPasswordButton).click();

    // input this users username.
    cy.get(usernameInput).type(Cypress.env().username);

    // submit.
    cy.get(submitButton).click();

    cy.contains('We have sent an unlock code to your registered email address.');
  });

  it('should alert a user to an incorrect password, then let them submit a correct one', () => {
    
    // prepare POST route to be tested.
    cy.server();
    cy.route('POST', '**/api/v1/forgotpassword/reset').as('postReset');
    
    // visit the form with an invalid code as we cannot check the email.
    cy.visit(`/forgot-password;username=${Cypress.env().username};code=invalid_code`);
    
    // enter differing password.
    cy.get(password1).type('123');
    cy.get(password2).type('456');
    
    cy.get(submitButton)
      .click()
      .wait('@postReset');

    cy.get(errorText)
    
    cy.get(submitButton).click()
      .wait('@postReset');
  });

})
