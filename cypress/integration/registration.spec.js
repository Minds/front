import generateRandomId from '../support/utilities';

context('Registration', () => {

  const username = generateRandomId();
  const password = `${generateRandomId()}0oA!`;
  const email = 'test@minds.com';
  const noSymbolPass = 'Passw0rd';

  const welcomeText = "Welcome to Minds!";
  const passwordDontMatch = "Passwords must match.";
  const passwordInvalid = " Password must have more than 8 characters. Including uppercase, numbers, special characters (ie. !,#,@), and cannot have spaces. ";

  const usernameField = 'minds-form-register #username';
  const emailField = 'minds-form-register #email';
  const passwordField = 'minds-form-register #password';
  const password2Field = 'minds-form-register #password2';
  const checkbox = '[data-cy=data-minds-accept-tos-input]';
  const submitButton = 'minds-form-register .mdl-card__actions button';

  beforeEach(() => {
    cy.clearCookies();
    cy.visit('/login');
    cy.location('pathname').should('eq', '/login');
    cy.server();
    cy.route("POST", "**/api/v1/register").as("register");
  });

  after(() => {
    cy.visit('/login');
    cy.location('pathname').should('eq', '/login');
    cy.login(false, username, password);
    cy.deleteUser(username, password);
    cy.clearCookies();
  })

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
    
    cy.get(checkbox)
      .click({force: true});

    //submit
    cy.get(submitButton)
      .click()
      .wait('@register').then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
  
    //onboarding modal shown
    cy.contains(welcomeText);
  });

  it('should display an error if password is invalid', () => {
    
    cy.get(usernameField)
      .focus()
      .type(generateRandomId());
    
    cy.get(emailField)
      .focus()
      .type(email);
    
    cy.get(passwordField)
      .focus()
      .type(noSymbolPass);
    
    cy.wait(500);

    cy.get(password2Field)
      .focus()
      .type(noSymbolPass);
    
    cy.get(checkbox)
      .click({force: true});

    //submit
    cy.get(submitButton)
      .click()
      .wait('@register').then((xhr) => {
        expect(xhr.status).to.equal(200);
      });

    cy.scrollTo('top');
    cy.contains(passwordInvalid);
  });

  it('should display an error if passwords do not match', () => {
    cy.get(usernameField)
      .focus()
      .type(generateRandomId());
    
    cy.get(emailField)
      .focus()
      .type(email);
    
    cy.get('minds-form-register #password')
      .focus()
      .type(password);
    
    cy.wait(500);
  
    cy.get(password2Field)
      .focus()
      .type(password + '!');
    
    cy.get(checkbox)
      .click({force: true});

    //submit
    cy.get(submitButton).click();

    cy.scrollTo('top');
    cy.contains(passwordDontMatch);
  });

})
