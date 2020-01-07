/**
 * @author Ben Hayward
 * @desc E2E testing for Minds Pro's pages.
 */
context('Pro Page', () => {
  if (Cypress.env().pro_password) {
    // required to run tests against pro user only.
    const topBar = '.m-proChannel__topbar';

    let categories = [
      { label: 'Technology', tag: '#technology' },
      { label: 'Food', tag: '#food' },
      { label: 'News', tag: '#news' },
    ];

    let footerLinks = [
      { label: 'Minds', link: 'https://www.minds.com/' },
      { label: 'Careers', link: 'https://www.minds.com/careers' },
    ];

    const proButton = 'data-minds-sidebar-admin-pro-button';

    function resetSettings() {
      cy.visit(`/pro/settings`);

      cy.route('POST', '**/api/v2/pro/settings').as('settings');

      cy.get('#title')
        .focus()
        .clear()
        .type('Title');
      cy.get('#headline')
        .focus()
        .clear()
        .type('This is a headline');

      cy.contains('Hashtags').click();

      // remove all hashtags
      removeInputs();

      for (let i = 0; i < categories.length; i++) {
        let cat = categories[i];
        addTag(cat.label, cat.tag, i);
      }
      cy.contains('Footer').click();

      cy.get('#footer_text')
        .clear()
        .type('This is the footer text');

      // remove all footer links
      removeInputs();

      for (let i = 0; i < footerLinks.length; i++) {
        let link = footerLinks[i];
        addFooterLink(link.label, link.link, i);
      }

      cy.contains('Save')
        .click()
        .wait('@settings')
        .then(xhr => {
          expect(xhr.status).to.equal(200);
          expect(xhr.response.body).to.deep.equal({ status: 'success' });
        });
    }

    function removeInputs() {
      cy.get(
        '.m-draggableList__list .m-proSettings__field .m-proSettings__dragDropRow--input'
      )
        .should('be.visible')
        .within($el => {
          for (let i = $el.length - 1; i >= 0; i--) {
            // flexInput. Start from the last one
            let c = $el[i];
            for (let j = 0; j < c.children.length; j++) {
              // inputs and the X button
              let cc = c.children[j];
              if (cc.nodeName === 'I') {
                // if it's the X button, click on it
                cy.wrap(cc).click();
              }
            }
          }
        });
    }

    function addTag(label, tag, index) {
      cy.contains('+ Add Tag').click();

      cy.get(`#tag-label-${index}`)
        .clear()
        .type(label);

      cy.get(`#tag-tag-${index}`)
        .clear()
        .type(tag);
    }

    function addFooterLink(label, link, index) {
      cy.contains('Add Link').click();

      cy.get(`#footer_link-title-${index}`)
        .clear()
        .type(label);

      cy.get(`#footer_link-href-${index}`)
        .clear()
        .type(link);
    }

    before(() => {
      cy.login(true, Cypress.env().pro_username, Cypress.env().pro_password);
      // after logging in, we need to get to settings and set everything up
      resetSettings();
      // go to pro page
      cy.visit(`/pro/${Cypress.env().pro_username}`);
      cy.get(topBar);
    });

    beforeEach(() => {
      cy.server();
      cy.preserveCookies();
    });

    it('should load the feed tab', () => {
      cy.route('GET', '**/api/v2/pro/content/*/activities/top**').as(
        'activities'
      );
      cy.contains('Feed')
        .click()
        .wait('@activities')
        .then(xhr => {
          expect(xhr.status).to.equal(200);
        });
    });

    it('should load the videos tab', () => {
      cy.route('GET', '**/api/v2/pro/content/*/videos/top**').as('videos');
      cy.contains('Videos')
        .click()
        .wait('@videos')
        .then(xhr => {
          expect(xhr.status).to.equal(200);
        });
    });

    it('should load the images tab', () => {
      cy.route('GET', '**/api/v2/pro/content/*/images/top**').as('images');
      cy.contains('Images')
        .click()
        .wait('@images')
        .then(xhr => {
          expect(xhr.status).to.equal(200);
        });

      // should have sub-categories
      cy.get('m-pro--channel--categories > .m-proChannel__category').each(
        ($el, $index) => {
          let c = categories.slice(0);
          c.unshift({ label: 'All', tag: '#all' });
          expect($el.text()).to.contain(c[$index].label);
        }
      );

      cy.get('m-pro--channel .m-overlay-modal').should('not.be.visible');

      // click on tile
      cy.get(
        '.m-proChannelListContent__list li:first-child m-pro--channel-tile'
      ).click();
      cy.wait(200);

      // media modal should appear
      cy.get('m-pro--channel .m-overlay-modal').should('be.visible');

      // close media modal
      cy.get('m-pro--channel .m-overlay-modal--close').click();
    });

    it('should load the articles tab', () => {
      cy.route('GET', '**/api/v2/pro/content/*/blogs/top**').as('blogs');
      cy.contains('Articles')
        .click()
        .wait('@blogs')
        .then(xhr => {
          expect(xhr.status).to.equal(200);
        });
    });

    it('should load the groups tab', () => {
      cy.route('GET', '**/api/v2/pro/content/*/groups/top**').as('groups');
      cy.contains('Groups')
        .click()
        .wait('@groups')
        .then(xhr => {
          expect(xhr.status).to.equal(200);
        });
    });

    it('should have a footer', () => {
      // should have a footer text
      cy.get('.m-proChannelFooter__text').contains('This is the footer text');

      // should have footer links
      cy.get(
        '.m-proChannel__footer .m-proChannelFooter .m-proChannelFooter__link'
      )
        .should('be.visible')
        .each(($el, $index) => {
          expect($el.text()).to.contain(footerLinks[$index].label);
          expect($el.attr('href')).to.contain(footerLinks[$index].link);
        });
    });
  }
});
