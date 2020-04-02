import generateRandomId from '../support/utilities';

context('Registration', () => {
  const username = generateRandomId();
  const password = `${generateRandomId()}0oA!`;
  const email = 'test@minds.com';

  const usernameField = 'minds-form-register #username';
  const emailField = 'minds-form-register #email';
  const passwordField = 'minds-form-register #password';
  const password2Field = 'minds-form-register #password2';
  const checkbox = '[data-cy=minds-accept-tos-input] [type=checkbox]';
  const submitButton = 'minds-form-register .mdl-card__actions button';

  beforeEach(() => {
    cy.clearCookies();
    cy.visit('/register');
    cy.location('pathname').should('eq', '/register');
    cy.server();
    cy.route('POST', '**/api/v1/register').as('register');
  });

  after(() => {
    cy.visit('/login');
    cy.location('pathname').should('eq', '/login');
    cy.login(false, username, password);
    cy.deleteUser(username, password);
    cy.clearCookies();
  });

  it('should allow a user to register', () => {
    //type values
    cy.get(usernameField)
      .focus()
      .type(username);

    cy.get(emailField)
      .focus()
      .type(email);

    cy.get(passwordField)
      .focus()
      .type(password);

    cy.wait(500);

    cy.get(password2Field)
      .focus()
      .type(password);

    cy.get(checkbox).click({ force: true });

    cy.completeCaptcha();

    //submit
    cy.get(submitButton)
      .click()
      .wait('@register')
      .then(xhr => {
        expect(xhr.status).to.equal(200);
      });

    cy.wait(500);
    cy.location('pathname').should('eq', '/onboarding/notice');
  });

  it('should display an error if passwords do not match', () => {
    cy.get('minds-form-register #password')
      .focus()
      .type(password);

    cy.wait(500);

    cy.get(password2Field)
      .focus()
      .type(password + '!');

    cy.get('.m-register__error').contains('Passwords must match');
  });
});
