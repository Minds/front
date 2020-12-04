import generateRandomId from "../../support/utilities";

context.skip('Onboarding V2', () => {

  const username = generateRandomId();
  const password = `${generateRandomId()}0oA!`;
  const email = 'test@minds.com';

  const usernameField = 'minds-form-register #username';
  const emailField = 'minds-form-register #email';
  const passwordField = 'minds-form-register #password';
  const password2Field = 'minds-form-register #password2';
  const checkbox = '[data-cy=minds-accept-tos-input] [type=checkbox]';
  const submitButton = '.m-shadowboxSubmitButton';
  const letsGetSetupButton = '[data-cy=onboarding-lets-get-setup-button]';

  beforeEach(() => {
    cy.server();
    cy.route("POST", "**/api/v1/register").as("register");
    cy.route('POST', '**/api/v2/onboarding/onboarding_shown').as('postOnboarding');

    cy.clearCookies();

    cy.visit('/register')
      .location('pathname')
      .should('eq', '/register');
  
    cy.get(usernameField)
      .focus()
      .type(username);

    cy.get(emailField)
      .focus()
      .type(email);

    cy.get(passwordField)
      .focus()
      .type(password);

    cy.get(password2Field)
      .focus()
      .type(password);

    cy.get(checkbox)
      .click({ force: true });

    cy.completeCaptcha();

    //submit
    cy.get(submitButton)
      .click()
      .wait('@register')
      .then((xhr) => {
          expect(xhr.status).to.equal(200);
        }
      ).location('pathname').should('eq', '/onboarding/notice');
  });

  after(() => {
    cy.deleteUser(username, password);
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it('should go through the process of onboarding', () => {
    // notice should appear
    cy.get('h1.m-onboarding__noticeTitle').contains('Welcome to the Minds Community');
    cy.get('h2.m-onboarding__noticeTitle').contains(username);

    cy.wait(5000);

    // should redirect to /hashtags
    cy.get(letsGetSetupButton)
      .click({force: true});

    // should be in the hashtags step


    // should have a Profile Setup title
    cy.get('.m-onboarding__form > h2').contains('Profile Setup');


    // should have a progressbar, with the hashtags step highlighted
    cy.get('.m-onboardingProgressbar__item--selected span').contains('1');
    cy.get('.m-onboardingProgressbar__item--selected span').contains('Hashtags');

    // should have a description
    cy.get('.m-onboarding__form .m-onboarding__description').contains('Select some hashtags that are of interest to you.');

    // should have a list of selectable hashtags
    cy.get('.m-hashtags__list li.m-hashtagsList__item').contains('Art').click();
    cy.get('.m-hashtags__list li.m-hashtagsList__item.m-hashtagsList__item--selected').contains('Art');
    cy.get('.m-hashtags__list li.m-hashtagsList__item').contains('Journalism').click();
    cy.get('.m-hashtags__list li.m-hashtagsList__item.m-hashtagsList__item--selected');
    cy.get('.m-hashtags__list li.m-hashtagsList__item').contains('Music').click();
    cy.get('.m-hashtags__list li.m-hashtagsList__item.m-hashtagsList__item--selected');

    // should have a continue and a skip button
    cy.get('button.mf-button--hollow').contains('Skip');
    cy.get('button.mf-button--alt').contains('Continue').click();

    // should be in the info step
    cy.get('.m-onboardingProgressbar__item--selected span').contains('2');
    cy.get('.m-onboardingProgressbar__item--selected span').contains('Info');

    // should have a Mobile Phone Number input
    cy.get('.m-onboarding__controls .m-onboarding__control label').contains('Mobile Phone Number');

    // should have a Location input
    cy.get('.m-onboarding__controls > .m-onboarding__control label[data-minds=location]').contains('Location');

    // should have Date of Birth inputs
    cy.get('.m-onboarding__controls > .m-onboarding__control label[data-minds=dateOfBirth]').contains('Date of Birth');

    // every input should be optional, so we should be able to click on "Continue"

    cy.get('button.mf-button--alt').contains('Continue').click({force: true});
    cy.visit('/onboarding/info');

    // cy.get('.m-onboarding__controls > .m-onboarding__control input[data-minds=locationInput]').type('London');
    // cy.get('ul.m-onboarding__cities > li:first-child').click();

    // open month selection and pick February
    cy.get('.m-onboarding__controls > .m-onboarding__control select[data-minds=monthDropdown]').select('February');

    // open day selection and pick 2nd
    cy.get('.m-onboarding__controls > .m-onboarding__control select[data-minds=dayDropdown]').select('2');

    // open year selection and pick 1991
    cy.get('.m-onboarding__controls > .m-onboarding__control select[data-minds=yearDropdown]').select('1991');

    // should have a continue and a skip button
    cy.get('button.mf-button--alt').contains('Continue').click({force: true});

    // should be in the Avatar step
    // should have a continue and a skip button
    cy.get('button.mf-button--hollow').contains('Skip');
    cy.get('button.mf-button--alt').contains('Upload a Photo');

    // add avatar
    cy.uploadFile(
      '#onboarding-avatar-input',
      '../fixtures/international-space-station-1776401_1920.jpg',
      'image/jpg'
    );

    // continue should move you to the next step (groups)
    cy.contains('Finish').click();

    // cy.get('.m-onboarding__groupList').should('exist');

    // go back to avatar and test Cancel
    cy.visit(`/onboarding/avatar`);

    cy.location('pathname')
      .should('eq', '/onboarding/avatar');

    // add avatar
    cy.uploadFile(
      '#onboarding-avatar-input',
      '../fixtures/international-space-station-1776401_1920.jpg',
      'image/jpg'
    );

    // should cancel cropping
    cy.get('button.mf-button--hollow').contains('Cancel').click();

    // should redirect to next step
    cy.get('button.mf-button--hollow').contains('Skip').click();

    // should be in the Groups step

    // should have a groups list
    // cy.get('.m-onboarding__groupList').should('exist');

    // clicking on a group join button should join the group
    // cy.get('.m-groupList__list .m-groupList__item:first-child .m-join__subscribe').contains('add').click();
    // button should change to a check, and clicking on it should leave the group
    // cy.get('.m-groupList__list .m-groupList__item:first-child .m-join__subscribed').contains('check').click();
    // cy.get('.m-groupList__list .m-groupList__item:first-child .m-join__subscribe i').contains('add');

    // should have a continue and a skip button
    // cy.get('button.mf-button--hollow').contains('Skip');
    // cy.get('button.mf-button--alt').contains('Continue').click();


    // should be in the Channels step
    // cy.get('.m-onboarding__channelList').should('exist');

    // should have a channels list
    // cy.get('.m-channelList__list').should('exist');
    // // clicking on a group join button should join the group
    // cy.get('.m-channelList__list .m-channelList__item:first-child .m-join__subscribe').contains('add').click();
    // // button should change to a check, and clicking on it should leave the channel
    // cy.get('.m-channelList__list .m-channelList__item:first-child .m-join__subscribed').contains('check').click();
    // cy.get('.m-channelList__list .m-channelList__item:first-child .m-join__subscribe i').contains('add');

    // should have a continue and a skip button
    // cy.get('button.mf-button--hollow').contains('Skip');
    // cy.get('button.mf-button--alt').contains('Finish').click();

    // should be in the newsfeed
    // cy.location('pathname').should('eq', '/newsfeed/subscriptions');
  });
});
