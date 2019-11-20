/**
 * @author Ben Hayward
 * @desc E2E testing for Minds Pro's settings.
 */
context('Pro Settings', () => {
  if (Cypress.env().pro_password) {
    // required to run tests against pro user only.
    const title = '#title';
    const headline = '#headline';
    const activityContainer = 'minds-activity';
    const footerText = '#footer_text';

    const theme = {
      textColor: '#textColor',
      primaryColor: '#primaryColor',
      plainBackgroundColor: '#plainBgColor',
      schemeLight: '#scheme_light',
      schemeDark: '#scheme_dark',
      aspectRatio: {
        169: '#tile_ratio_16:9', //  16:9
        1610: '#tile_ratio_16:10', // 16:10
        43: '#tile_ratio_4:3', // 4:3
        11: '#tile_ratio_1:1', // 1:1
      },
    };

    const hashtags = {
      labelInput0: '#tag-label-0',
      hashtagInput0: '#tag-tag-0',
      labelInput1: '#tag-label-1',
      hashtagInput1: '#tag-tag-1',
      label1: 'label1',
      label2: 'label2',
      label3: 'label3',
      hashtag1: '#hashtag1',
      hashtag2: '#hashtag2',
      hashtag3: '#hashtag3',
    };

    const footer = {
      hrefInput: `#footer_link-href-0`,
      titleInput: `#footer_link-title-0`,
    };

    const strings = {
      title: 'Minds Pro E2E',
      headline: 'This headline is a test',
      footer: 'This is a footer',
      footerTitle: 'Minds',
      footerHref: 'https://www.minds.com/',
    };

    before(() => {
      cy.login(true, Cypress.env().pro_username, Cypress.env().pro_password);
    });

    after(() => {
      // cy.visit(`/${Cypress.env().username}`);
      cy.visit('/pro/' + Cypress.env().pro_username + '/settings/hashtags')
        .location('pathname')
        .should(
          'eq',
          '/pro/' + Cypress.env().pro_username + '/settings/hashtags'
        );
      clearHashtags();
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
    });

    it('should update the title and headline', () => {
      //enter data
      cy.get(title)
        .focus()
        .clear()
        .type(strings.title);

      cy.get(headline)
        .focus()
        .clear()
        .type(strings.headline);

      saveAndPreview();
      //check tab title.
      cy.title().should(
        'eq',
        strings.title + ' - ' + strings.headline + ' | Minds'
      );
    });

    // Need to find a way around the color input in Cypress.

    it('should allow the user to set a dark theme for posts', () => {
      cy.contains('Theme').click();

      cy.get(theme.schemeDark).click();

      saveAndPreview();

      cy.contains('Feed').click();

      cy.get(activityContainer)
        .should('have.css', 'background-color')
        .and('eq', 'rgb(35, 35, 35)');
    });

    it('should allow the user to set a light theme for posts', () => {
      cy.contains('Theme').click();

      cy.get(theme.schemeLight).click();

      saveAndPreview();

      cy.contains('Feed').click();

      cy.get(activityContainer)
        .should('have.css', 'background-color')
        .and('eq', 'rgb(255, 255, 255)');
    });

    it('should allow the user to set category hashtags', () => {
      cy.contains('Hashtags').click();

      cy.contains('Add').click();

      cy.get(hashtags.labelInput0)
        .clear()
        .type(hashtags.label1);

      cy.get(hashtags.hashtagInput0)
        .clear()
        .type(hashtags.hashtag1);

      cy.contains('Add').click();

      cy.get(hashtags.labelInput1)
        .first()
        .clear()
        .type(hashtags.label2);

      cy.get(hashtags.hashtagInput1)
        .first()
        .clear()
        .type(hashtags.hashtag2);

      saveAndPreview();

      //check the labels are present and clickable.
      cy.contains('label1');
      cy.contains('label2');
    });

    it('should allow the user to set footer', () => {
      cy.contains('Footer').click();

      cy.get(footerText)
        .clear()
        .type(strings.footer);

      cy.contains('Add Link').click();

      cy.get(footer.hrefInput)
        .clear()
        .type(strings.footerHref);

      cy.get(footer.titleInput)
        .clear()
        .type(strings.footerTitle);

      saveAndPreview();

      cy.contains(strings.footerTitle)
        .should('have.attr', 'href')
        .should('contain', strings.footerHref);
    });

    //save, await response, preview.
    function saveAndPreview() {
      //save and await response
      cy.contains('Save')
        .click()
        .wait('@settings')
        .then(xhr => {
          expect(xhr.status).to.equal(200);
          expect(xhr.response.body).to.deep.equal({ status: 'success' });
        });

      //go to pro page
      cy.contains('View Pro Channel').click();
    }

    function clearHashtags() {
      cy.contains('Hashtags').click();

      cy.contains('Add').click();

      cy.contains('clear').click({ multiple: true });
      saveAndPreview();
    }

    //
    // it.only('should update the theme', () => {
    //   // nav to theme tab
    //   cy.contains('Theme')
    //     .click();

    //   cy.get(theme.plainBackgroundColor).then(elem => {
    //     elem.val('#00dd00');
    //         //save and await response
    //     cy.contains('Save')
    //     .click()
    //     .wait('@settings').then((xhr) => {
    //       expect(xhr.status).to.equal(200);
    //       expect(xhr.response.body).to.deep.equal({ status: 'success' });
    //     });

    //   //go to pro page
    // cy.contains('View Pro Channel').click();

    // })
  }
});
