/**
 * @author Ben Hayward
 * @desc E2E testing for Minds Pro's settings.
 */
context('Pro Settings', () => {
  if (Cypress.env().pro_password) {
    // required to run tests against pro user only.
    function data(str) {
      return `[data-minds=${str}]`;
    }

    const activityContainer = 'minds-activity';
    const sidebarMenu = data('sidebarMenuLinks');

    const general = {
      title: data('title'),
      headline: data('headline'),
      publish: data('publish'),
      strings: {
        title: 'Minds Pro E2E',
        headline: 'This headline is a test',
      },
    };

    const theme = {
      textColor: data('textColor'),
      primaryColor: data('primaryColor'),
      plainBgColor: data('plainBgColor'),
      schemeLight: data('schemeLight'),
      schemeDark: data('schemeDark'),
      aspectRatio: {
        169: data('tileRatio_16:9'), //  16:9
        1610: data('tileRatio_16:10'), // 16:10
        43: data('tileRatio_4:3'), // 4:3
        11: data('tileRatio_1:1'), // 1:1
      },
      strings: {
        textColor: '#4690df',
        primaryColor: '#cb7848',
        plainBgColor: '#b4bbf0',
        textColorRgb: 'rgb(70, 144, 223)',
        primaryColorRgb: 'rgb(203, 120, 72)',
        plainBgColorRgba: 'rgba(180, 187, 240, 0.627)',
        resetColor: '#ffffff',
      },
    };

    const assets = {
      logo: data('logo'),
      background: data('background'),
      strings: {
        logoFixture: '../../fixtures/avatar.jpeg',
        backgroundFixture:
          '../../fixtures/international-space-station-1776401_1920.jpg',
      },
    };

    const hashtags = {
      add: data('addHashtag'),
      label0: data('tag__label--0'),
      tag0: data('tag__tag--0'),
      label1: data('tag__label--1'),
      tag1: data('tag__tag--1'),
      strings: {
        label0: 'Label0',
        label1: 'Label1',
        tag0: '#hashtag0',
        tag1: '#hashtag1',
      },
    };

    const footer = {
      text: data('footerText'),
      add: data('addFooterLink'),
      linkTitle: data('footerLink__title--0'),
      linkHref: data('footerLink__href--0'),
      strings: {
        text: 'This is a footer',
        linkTitle: 'Minds',
        linkHref: 'https://www.minds.com/',
      },
    };

    before(() => {
      cy.login(true, Cypress.env().pro_username, Cypress.env().pro_password);

      // Make a post
      cy.route('POST', '**/api/v1/newsfeed').as('newsfeed');
      cy.visit('/newsfeed/subscriptions');
      cy.get('minds-newsfeed-poster textarea')
        .click()
        .type('Testing 1-2-3');
      cy.get('minds-newsfeed-poster .m-posterActionBar__PostButton').click();
      cy.wait('@newsfeed').then(xhr => {
        expect(xhr.status).to.equal(200);
      });
    });

    beforeEach(() => {
      cy.preserveCookies();
      cy.server();
      cy.route('POST', '**/api/v2/pro/settings').as('settings');

      cy.visit('/pro/' + Cypress.env().pro_username + '/settings/general')
        .location('pathname')
        .should(
          'eq',
          '/pro/' + Cypress.env().pro_username + '/settings/general'
        );

      // ensure window is wide enough to find pro topbar links
      cy.viewport(1300, 768);
    });

    it.skip('should update the title and headline', () => {
      //enter data
      cy.get(general.title)
        .focus()
        .clear()
        .type(general.strings.title);

      cy.get(general.headline)
        .focus()
        .clear()
        .type(general.strings.headline);

      saveAndPreview();
      //check tab title
      cy.title().should(
        'eq',
        general.strings.title + ' - ' + general.strings.headline + ' | Minds'
      );
    });

    it('should allow the user to set theme colors', () => {
      cy.get(sidebarMenu)
        .contains('Theme')
        .click();

      // reset colors so changes will be submitted
      cy.get(theme.textColor)
        .click()
        .clear()
        .type(theme.strings.resetColor);

      cy.get(theme.primaryColor)
        .click()
        .clear()
        .type(theme.strings.resetColor);

      cy.get(theme.plainBgColor)
        .click()
        .clear()
        .type(theme.strings.resetColor);

      save();

      // set theme colors to be tested
      cy.get(theme.textColor)
        .click()
        .clear()
        .type(theme.strings.textColor);

      cy.get(theme.primaryColor)
        .click()
        .clear()
        .type(theme.strings.primaryColor);

      cy.get(theme.plainBgColor)
        .click()
        .clear()
        .type(theme.strings.plainBgColor);

      saveAndPreview();

      cy.get('.m-pro__searchBox input').should(
        'have.css',
        'background-color',
        theme.strings.plainBgColorRgba
      );

      cy.get('.m-proChannelTopbar__navItem')
        .contains('Videos')
        .should('have.css', 'color', theme.strings.textColorRgb);

      cy.get('.m-proChannelTopbar__navItem')
        .contains('Feed')
        .click();

      // make window narrow enough to show hamburger icon/menu
      cy.viewport('ipad-mini');
      cy.get('.m-proHamburgerMenu__trigger')
        .click()
        .get('.m-proHamburgerMenu__item--active')
        .should('have.css', 'color')
        .and('eq', theme.strings.primaryColorRgb);
    });

    // Skipping until Emi changes feeds from 'top' to 'latest'
    it.skip('should allow the user to set a dark theme for posts', () => {
      cy.get(sidebarMenu)
        .contains('Theme')
        .click();

      // Toggle radio to enable submit button
      cy.get(theme.schemeLight).click({ force: true });
      cy.get(theme.schemeDark).click({ force: true });

      saveAndPreview();

      cy.get('.m-proChannelTopbar__navItem')
        .contains('Feed')
        .click();

      cy.get(activityContainer)
        .should('have.css', 'background-color')
        .and('eq', 'rgb(35, 35, 35)');
    });

    // Skipping until Emi changes feeds from 'top' to 'latest'
    it.skip('should allow the user to set a light theme for posts', () => {
      cy.get(sidebarMenu)
        .contains('Theme')
        .click();

      // Toggle radio to enable submit button
      cy.get(theme.schemeDark).click({ force: true });
      cy.get(theme.schemeLight).click({ force: true });

      saveAndPreview();

      cy.get('.m-proChannelTopbar__navItem')
        .contains('Feed')
        .click();

      cy.get(activityContainer)
        .should('have.css', 'background-color')
        .and('eq', 'rgb(255, 255, 255)');
    });

    it.skip('should allow the user to upload logo and background images', () => {
      cy.get(sidebarMenu)
        .contains('Assets')
        .click();

      cy.uploadFile(assets.logo, assets.strings.logoFixture, 'image/jpeg');

      cy.uploadFile(
        assets.background,
        assets.strings.backgroundFixture,
        'image/jpg'
      );

      saveAndPreview();

      // cy.get('.m-proChannelTopbar__logo').should('have.attr', 'src', Cypress.env().url + '/fs/v1/pro/930229554033729554/logo/1574379135');

      // cy.get(m-proChannel).should('have.attr', 'background-image', 'url(' + Cypress.env().url + '/fs/v1/banners/998753812159717376/fat/1563497464)');
    });

    it('should allow the user to set category hashtags', () => {
      cy.get(sidebarMenu)
        .contains('Hashtags')
        .click();

      cy.get(hashtags.add).click();
      cy.get('m-draggableList')
        .contains('clear')
        .click({ multiple: true });

      cy.get(hashtags.add).click();

      cy.get(hashtags.label0)
        .clear()
        .type(hashtags.strings.label0);

      cy.get(hashtags.tag0)
        .clear()
        .type(hashtags.strings.tag0);

      cy.get(hashtags.add).click();

      cy.get(hashtags.label1)
        .clear()
        .type(hashtags.strings.label1);

      cy.get(hashtags.tag1)
        .clear()
        .type(hashtags.strings.tag1);

      saveAndPreview();

      //check the labels are present and clickable.
      cy.contains(hashtags.strings.label0);
      cy.contains(hashtags.strings.label1);
    });

    it('should allow the user to set footer', () => {
      cy.get(sidebarMenu)
        .contains('Footer')
        .click();

      // clear any existing footer links
      cy.get(footer.add).click();
      cy.get('m-draggableList')
        .contains('clear')
        .click({ multiple: true });

      // add a new footer link
      cy.get(footer.add).click();

      cy.get(footer.linkHref)
        .clear()
        .type(footer.strings.linkHref);

      cy.get(footer.linkTitle)
        .clear()
        .type(footer.strings.linkTitle);

      // add footer text
      cy.get(footer.text)
        .clear()
        .type(footer.strings.text);

      saveAndPreview();

      cy.contains(footer.strings.linkTitle)
        .should('have.attr', 'href')
        .should('contain', footer.strings.linkHref);

      cy.get(footer.text).should('contain', footer.strings.text);
    });

    function save() {
      //save and await response
      cy.get('.m-shadowboxSubmitButton')
        .contains('Save')
        .click({ force: true })
        .wait('@settings')
        .then(xhr => {
          expect(xhr.status).to.equal(200);
          expect(xhr.response.body).to.deep.equal({ status: 'success' });
        });
    }

    function saveAndPreview() {
      save();

      //go to pro page
      cy.visit('/pro/' + Cypress.env().pro_username);
    }
  }
});
