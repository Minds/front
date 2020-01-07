context('Onboarding', () => {
  
  const email = 'test@minds.com';
  const password = 'Passw0rd!';
  const name = "Tester";
  const description = "I am a tester, with a not so lengthy description";
  const welcomeText = "Welcome to Minds!";

  const usernameField = 'minds-form-register #username';
  const emailField = 'minds-form-register #email';
  const passwordField = 'minds-form-register #password';
  const password2Field = 'minds-form-register #password2';
  const nameField = '#display-name';
  const descriptionfield = '#description';
  const phoneNumberInput = '#phone';
  const countryDropdown = 'm-phone-input--country > div';
  const ukOption = 'm-phone-input--country > ul > li:nth-child(2)';
  const dialcode = '.m-phone-input--dial-code';
  const checkbox = 'minds-form-register label:nth-child(2) .mdl-ripple--center';
  const submitButton = 'minds-form-register .mdl-card__actions button';
  const nextButton = '.m-channelOnboarding__next';
  const submitPhoneButton = 'm-channel--onboarding--rewards > div > div > button';
  const loadingSpinner = '.mdl-spinner__gap-patch';
  const getTopic = (i) => `m-onboarding--topics > div > ul > li:nth-child(${i}) span`;

  before(() => {
    cy.clearCookies();
    cy.visit('/login');

    //type values
    cy.get(usernameField).focus().type(Math.random().toString(36).replace('0.', ''));
    cy.get(emailField).focus().type(email);
    cy.get(passwordField).focus().type(password);

    cy.get(password2Field).focus().type(password);
    cy.get(checkbox).click();
    
    //submit
    cy.get(submitButton).click();
  
    //onboarding modal shown
    cy.get('m-onboarding--topics > div > h2:nth-child(1)')
      .contains(welcomeText);
  });

  it('should allow a user to run through onboarding modals', () => {
    //select topics
    cy.get(getTopic(3)).click().should('have.class', 'selected')
    cy.get(getTopic(4)).click().should('have.class', 'selected')
    cy.get(getTopic(5)).click().should('have.class', 'selected')
      
    //click
    cy.get(nextButton).click();
  
    //TODO: Skipped over for now as subscribed channels is not working on staging environment.  
    cy.get(nextButton).click();
 
    cy.get(nameField).clear().type(name);
    cy.get(descriptionfield).type(description);
    cy.get(nextButton).click();
  
    //set dialcode
    cy.get(countryDropdown).click();
    cy.get(ukOption).click();
    cy.get(dialcode).contains('+44');

    //type number
    cy.get(phoneNumberInput).type('7700000000');
    
    //submit and check loading spinner.
    cy.get(submitPhoneButton).click();
    cy.get(loadingSpinner).should('be.visible');
    cy.get(nextButton).click();
  });
});
