import generateRandomId from '../../support/utilities';

context('Channel', () => {

  const channelEditButton = "[data-cy=data-minds-channel-edit-button]";
  const aboutButton = "[data-cy=data-minds-channel-about-button]";

  const avatarInput = "[data-cy=data-minds-channel-avatar-upload]";
  const bannerInput = "[data-cy=data-minds-channel-banner-upload]";
  const bioInput = "[data-cy=data-minds-channel-bio-textarea]";
  const displayNameInput = "[data-cy=data-minds-channel-display-name]";
  const locationInput = "[data-cy=data-minds-channel-location] input";

  const dobInput = {
    year: 'select[data-minds=yearDropdown]',
    month: 'select[data-minds=monthDropdown]',
    day: 'select[data-minds=dayDropdown]'
  }
  const dobPublicCheckbox = '[data-cy=data-minds-channel-public-dob-checkbox]';

  const channelBanner = '[data-cy=data-minds-channel-banner]';
  const channelAvatar = '[data-cy=data-minds-channel-banner]';
  const channelBio = '[data-cy=data-minds-channel-bio]';

  const hashtagsInput = "[data-cy=data-minds-hashtags-typeahead-input]";
  const hashtagAddButton = "[data-cy=data-minds-hashtag-add-button]";
  const hashtagRemoveButton = "[data-cy=data-minds-hashtag-remove-button]";

  const socialMediaInput = '[data-cy=data-minds-social-link-input]';
  const socialMediaAddButton = '[data-cy=data-minds-social-link-add-button]';
  const socialMediaRemoveButton = '[data-cy=data-minds-social-link-remove-button]';

  const dayNumber = (Math.floor(Math.random() * 28) + 1).toString();
  const bioText = generateRandomId();
  const nameText = generateRandomId();
  const locationText = generateRandomId();
  const hashtagText = generateRandomId();
  const hashtag2Text = generateRandomId();

  const fixtures = {
    banner: '../fixtures/international-space-station-1776401_1920.jpg',
    avatar: '../fixtures/avatar.jpeg'
  }

  before(() => {
    cy.getCookie('minds_sess')
    .then((sessionCookie) => {
      if (sessionCookie === null) {
       return cy.login(true);
      }
    });
    cy.intercept('GET', '**/api/v1/channel/**').as('GETChannel');

    cy.get('.m-sidebarNavigation__list')
      .contains(`${Cypress.env().username}`)
      .click()
      .wait('@GETChannel')
      .its('response.statusCode')
      .should('eq', 200);
  });

  beforeEach(()=> {
    cy.preserveCookies();
    cy.viewport(1920, 1080);
  });

  it('should allow a user to edit their avatar banner and bio', () => {
    // get style attribute value for banner and avatar to check later
    cy.get(channelBanner).invoke('attr', 'style').then((originalBanner) => {
      cy.get(channelAvatar).invoke('attr', 'style').then((originalAvatar) => {  
        cy.get(channelEditButton).click();

        // switch avatar to banner image
        cy.uploadFile(
          avatarInput,
          fixtures.banner,
          'image/jpg'
        );

        // switch banner to avatar image.
        cy.uploadFile(
          bannerInput,
          fixtures.avatar,
          'image/jpg'
        );

        // change bio to random string
        cy.get(bioInput).clear().type(bioText);

        cy.intercept('**/api/v1/channel/info').as('POSTChannelInfo');

        save();

        // check avatar and banner have switched
        cy.get(channelBanner).invoke('attr', 'style').should('not.eq', originalBanner);
        cy.get(channelAvatar).invoke('attr', 'style').should('not.eq', originalAvatar);
        cy.get(channelBio).contains(bioText);
      });
    });

    // reset
    cy.get(channelEditButton).click();

    // switch avatar to banner image
    cy.uploadFile(
      avatarInput,
      fixtures.avatar,
      'image/jpg'
    );

    // switch banner to avatar image.
    cy.uploadFile(
      bannerInput,
      fixtures.banner,
      'image/jpg'
    );

    // save - note no data attribute due to ongoing submit button refactoring (2020-11-30)
    save();
  });

  it('should allow a user to edit their about info', () => {
    // click to navigate to correct area
    cy.get(channelEditButton).click();
    cy.contains('About Info').click();
    
    // Input a display name
    cy.get(displayNameInput).clear().type(nameText);
    
    // Input a location
    cy.get(locationInput).clear().type(locationText);
    
    // Input date of birth
    cy.get(dobInput.month).select('February');
    cy.get(dobInput.day).select(dayNumber);
    cy.get(dobInput.year).select('1991');
    
    // Make date of birth public
    cy.get(dobPublicCheckbox).click({force: true});

    // Save
    save();

    // nav to about section of channel
    cy.get(aboutButton).click();

    // verify data is there after being saved.
    cy.contains(nameText);
    cy.contains(locationText);
    cy.contains(`Feb ${dayNumber}, 1991`);

    
    // Reset
    cy.get(channelEditButton).click();
    cy.contains('About Info').click();
    
    cy.get(displayNameInput).clear().type('minds_cypress_tests');
    cy.get(locationInput).clear();

    cy.get(dobPublicCheckbox).click({force: true});
    save();
  });

  
  it('should allow a user to edit their hashtags', () => {
    // click to navigate to correct area
    cy.get(channelEditButton).click();

    // click Hashtags (in accordian pane only)
    cy.get('m-accordion__pane').within($list => { 
      cy.contains('Hashtags').click({force: true})
    });

    // type and add hashtags - force type as this can be offscreen
    cy.get(hashtagsInput).type(hashtagText, {force: true});
    cy.get(hashtagAddButton).click({force: true});

    cy.get(hashtagsInput).type(hashtag2Text, {force: true});
    cy.get(hashtagAddButton).click({force: true});

    save();

    // nav to about section of channel
    cy.get(aboutButton).click();
    cy.contains(hashtagText);
    cy.contains(hashtag2Text);

    // reset
    cy.get(channelEditButton).click();
    cy.get('m-accordion__pane').within($list => {
      cy.contains('Hashtags').click({force: true})
    });
    cy.get(hashtagRemoveButton).click({ multiple: true, force: true }); // if any flake and get leftover
    
    save();
  });

  
  it('should allow a channel to edit its social media links', () => {
    // click to navigate to correct area
    cy.get(channelEditButton).click();
    cy.get('.m-modalV2__inner').within($then => {
      cy.contains('Social Links').click({force: true});
    });

    cy.get(socialMediaInput).type('https://www.gitlab.com/minds/');
    cy.get(socialMediaAddButton).click();
    
    save();
    
    // nav to about section of channel
    cy.get(aboutButton).click();
    cy.get('m-channel__socialLinks').within($list => {
      cy.get('a').should('have.attr', 'href').and('include', 'https://www.gitlab.com/minds/')
    });

    // reset
    cy.get(channelEditButton).click();
    cy.contains('Social Links').click({force: true});
    cy.get(socialMediaRemoveButton).click({force: true, multiple: true});

    save();
  });

  it('should make a request to load the feed', () => {
    cy.intercept('GET', '**/api/v2/feeds/container/*/activities**').as('GETfeed');

    lazyRefresh();

    cy.wait('@GETfeed').then((interception) => {
      expect(interception.response.body);
    });
    
    expect('m-activity').to.exist;
  });

  it('should have composer', () => {
    expect(cy.get('m-composer__base')).to.exist;
  });
  
  // save button click - note no data attribute due to ongoing
  //  submit button refactoring (2020-11-30)
  const save = () => {
    cy.intercept('**/api/v1/channel/info').as('POSTChannelInfo');
    cy.contains('Save')
      .click({force: true})
      .wait('@POSTChannelInfo')
      .its('response.statusCode')
      .should('eq', 200);
  }

  const lazyRefresh = () => {
    cy.get('.m-sidebarNavigation__list')
      .contains(`Newsfeed`)
      .click();

    cy.intercept('GET', '**/api/v1/channel/**').as('GETChannel');

    cy.get('.m-sidebarNavigation__list')
      .contains(`${Cypress.env().username}`)
      .click()
      .wait('@GETChannel')
      .its('response.statusCode')
      .should('eq', 200);
    
  }
});
