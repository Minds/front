context('Onboarding', () => {

  const remindText = 'remind test text';

  before(() => {
    cy.getCookie('minds_sess')
      .then((sessionCookie) => {
        if (sessionCookie === null) {
          return cy.login(true);
        }
      });
    cy.visit(`/onboarding`);

    // create two test groups
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it('should go through the process of onboarding', () => {
    // notice should appear
    cy.get('h1.m-onboarding__noticeTitle').contains('Welcome to the Minds Community');
    cy.get('h2.m-onboarding__noticeTitle').contains(`@${Cypress.env().username}`);

    // should redirect to /hashtags
    cy.get('.m-onboarding__form button.mf-button').contains("Let's Get Setup").click();
    cy.wait(1000);


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

    // open country dropdown
    cy.get('.m-onboarding__controls .m-phone-input--selected-flag').click();
    // click on UK
    cy.get('.m-phone-input--country-list li span[data-minds=54]').click();
    // Uk should be selected
    cy.get('.m-phone-input--selected-flag .m-phone-input--dial-code').contains('+54');

    // add the number
    cy.get('#phone').type('012345678');

    // should have a Location input
    cy.get('.m-onboarding__controls > .m-onboarding__control label[data-minds=location]').contains('Location');
    // cy.get('.m-onboarding__controls > .m-onboarding__control input[data-minds=locationInput]').type('London');
    // cy.get('ul.m-onboarding__cities > li:first-child').click();


    // should have Date of Birth inputs
    cy.get('.m-onboarding__controls > .m-onboarding__control label[data-minds=dateOfBirth]').contains('Date of Birth');

    // open month selection and pick February
    cy.get('.m-onboarding__controls > .m-onboarding__control select[data-minds=monthDropdown]').select('February');

    // open day selection and pick 2nd
    cy.get('.m-onboarding__controls > .m-onboarding__control select[data-minds=dayDropdown]').select('2');

    // open year selection and pick 1991
    cy.get('.m-onboarding__controls > .m-onboarding__control select[data-minds=yearDropdown]').select('1991');

    // should have a continue and a skip button
    cy.get('button.mf-button--hollow').contains('Skip');
    cy.get('button.mf-button--alt').contains('Finish').click();

    // TODO: disable the following line and uncomment the rest when we re-enable the screens
    // should be in the newsfeed
    cy.location('pathname').should('eq', '/newsfeed/subscriptions');

    // should be in the Groups step

    // should have a groups list
    // cy.get('.m-groupList__list').should('exist');

    // clicking on a group join button should join the group
    // cy.get('.m-groupList__list .m-groupList__item:first-child .m-join__subscribe').contains('add').click();
    // // button should change to a check, and clicking on it should leave the group
    // cy.get('.m-groupList__list .m-groupList__item:first-child .m-join__subscribed').contains('check').click();
    // cy.get('.m-groupList__list .m-groupList__item:first-child .m-join__subscribe i').contains('add');

    // should have a continue and a skip button
    // cy.get('button.mf-button--hollow').contains('Skip');
    // cy.get('button.mf-button--alt').contains('Continue').click();


    // should be in the Channels step

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
