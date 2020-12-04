import generateRandomId from "../../support/utilities";

context('Onboarding V3', () => {

  const username = generateRandomId();
  const password = `${generateRandomId()}0oA!`;
  const email = 'test@minds.com';

  const displayNameText = generateRandomId();
  const bioText = generateRandomId();

  const submitButton = 'm-shadowBoxSubmitButton button';
  const joinButton = '[data-cy=data-minds-homepage-join-button-main]';

  const toastMessage = '[data-cy=data-minds-form-toast-wrapper]';

  const registerForm = {
    usernameInput: '[data-cy=data-minds-register-username-input]',
    emailInput: '[data-cy=data-minds-register-email-input]',
    password1Input: '[data-cy=data-minds-register-password-input-1]',
    password2Input: '[data-cy=data-minds-register-password-input-2]',
    tosCheckbox:  '[data-cy=minds-accept-tos-input] [type=checkbox]',
    submitButton: 'm-shadowBoxSubmitButton', // 2020-12-03 - not adding data attribute yet as this is mid revamp.
  };

  const fixtures = {
    avatar: '../fixtures/avatar.jpeg'
  }

  const widget = {
    container: '[data-cy=data-minds-onboarding-widget]',
    dropdown: '[data-cy=data-minds-onboarding-widget-dropdown]',  
    body: '[data-cy=data-minds-onboarding-widget-dropdown]',
    progressBar: '[data-cy=data-minds-onboarding-widget-progress-bar]',
    tasks: {
      verifyEmail: '[data-cy=data-minds-onboarding-widget-verify-email]',
      selectTags: '[data-cy=data-minds-onboarding-widget-select-tags]',
      setupChannel: '[data-cy=data-minds-onboarding-widget-setup-channel]',
      verifyUniqueness: '[data-cy=data-minds-onboarding-widget-verify-uniqueness]',
      createPost: '[data-cy=data-minds-onboarding-widget-create-post]',
    }
  };

  before(() => {
    cy.clearCookies();
    cy.visit('/')
      .location('pathname')
      .should('eq', `/`);
  });

  beforeEach(()=> {
    cy.preserveCookies();
    cy.viewport(1920, 1080);
  });
  // it.skip('should open register modal for all buttons', () => {

  // });
  
  it('should allow the user to register', () => {
    // open join modal
    cy.get(joinButton).click();

    // fill out information
    cy.get(registerForm.usernameInput).focus().type(username);
    cy.get(registerForm.emailInput).type(email);
    cy.get(registerForm.password1Input).focus().type(password);
    cy.get(registerForm.password2Input).focus().type(password);
    
    // complete captcha
    cy.completeCaptcha();

    // click terms checkbox
    cy.get(registerForm.tosCheckbox).click({force: true});

    // submit and check next steps hashtag call
    cy.intercept('POST', '**/api/v1/register').as('POSTRegister');
    cy.intercept('GET', '**/api/v2/hashtags/suggested**').as('GETTags')
    cy.get(registerForm.submitButton)
      .click()
      .wait('@POSTRegister')
      .its('response.statusCode')
      .should('eq', 200)
      .wait('@GETTags')
      .its('response.statusCode')
      .should('eq', 200);
  });

  it('should allow the user to select tags and not advance until 3 have been selected', () => {
    cy.get(submitButton).should('be.disabled');

    // add tag 1, check still disabled
    cy.intercept('POST', '**/api/v2/hashtags/user/**').as('POSTTag');
    cy.get('.m-onboardingTags__tag').eq(0).click().wait('@POSTTag');
    cy.get(submitButton).should('be.disabled');

    // add tag 2, check still disabled
    cy.get('.m-onboardingTags__tag').eq(1).click().wait('@POSTTag');
    cy.get(submitButton).should('be.disabled');


    // add tag 3, check enabled and click through
    cy.get('.m-onboardingTags__tag').eq(2).click().wait('@POSTTag');

    cy.intercept('POST', '/api/v2/mwa/pv').as('initXsrf');

    // submit
    cy.get(submitButton).should('not.be.disabled')
      .click()
      .wait('@initXsrf')
  });

  it('should show the user the welcome screen, with the URL redirected', () => {
      // verify content
      cy.contains('Welcome to Minds')
        .location('pathname')
        .should(
          'contains',
          'newsfeed/subscriptions'
        );
      
      // click through
      cy.get(submitButton).should('not.be.disabled')
        .click()
  });

  it('should show onboarding progress widget with progress-bar, hide and unhide', () => {
    // check container, body and progress bar are all visible
    cy.get(widget.container).should('exist');
    cy.get(widget.body).should('exist');
    cy.get(widget.progressBar).should('exist');

    // click dropdown and hide
    cy.get(widget.dropdown).click();
    cy.get(widget.dropdown).within($list => {
      cy.contains("Hide").click();
      
      // asset body is hifdden
      cy.get(widget.body).should('not.exist')
    });

    // click dropdown and show
    cy.get(widget.dropdown).click();
    cy.get(widget.dropdown).within($list => {
      cy.contains("Show").click();
    });
    // assert body is visible
    cy.get(widget.body).should('exist')
  });

  it('should show all initial tasks with struck-through select tags ', () => {
    // verify all initial tasks are shown
    cy.get(widget.tasks.verifyEmail).should('exist');
    cy.get(widget.tasks.setupChannel).should('exist');
    cy.get(widget.tasks.verifyUniqueness).should('exist');
    cy.get(widget.tasks.createPost).should('exist');

    // also check tags is already struck-through (due to previous steps)
    cy.get(widget.tasks.selectTags).should('exist');
    assertTaskIsCompleted(
      cy.get(widget.tasks.selectTags).parent()
    );
  });

  it('should show a toaster message for verify email task', () => {
    cy.get(widget.tasks.verifyEmail).click();
    cy.get(toastMessage).within($list => {
      cy.contains('Check your inbox for a verification email from us');
    });
  });

  const setupChannel = {
    name: '[data-cy=data-minds-onboarding-channel-name]',
    bio: '[data-cy=data-minds-onboarding-channel-bio]',
    avatar: '[data-cy=data-minds-onboarding-channel-avatar]',
  }

  it('should allow you to setup your channel in setup channel task', () => {
    cy.get(widget.tasks.setupChannel).click();

    cy.get(setupChannel.name).focus().clear().type(displayNameText);
    cy.get(setupChannel.bio).focus().type(bioText);
    // TODO: upload AVATAR and generate bio and name then do other panels - assert bio is saved!

    cy.intercept('POST', '**/api/v1/channel/avatar').as('POSTAvatar');
    cy.intercept('POST', '**/api/v1/channel/info').as('POSTInfo');

    cy.uploadFile(
      setupChannel.avatar,
      fixtures.avatar,
      'image/jpg'
    )

    cy.get(submitButton).should('not.be.disabled')
      .click()
      .wait('@POSTAvatar')
      .should('eq', 200)
      .wait('@POSTInfo')
      .its('response.statusCode')
      .should('eq', 200);

    cy.get(widget.tasks.setupChannel).click({force: true});

    cy.get(setupChannel.name).should('have.value', displayNameText);
    cy.get(setupChannel.bio).should('have.value', bioText);
  });

  /**
   * Asserts a task is complete.
   * @param element - best to use cy.get('foo'); 
   */
  const assertTaskIsCompleted = (element) => {
    element.should('have.class', 'completed');
  }
});
