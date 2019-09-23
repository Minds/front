/**
 * @author Marcelo Rivera
 * @desc E2E testing for Minds Pro's standalone pages.
 */
context('Pro Page', () => {

  const topBar = '.m-proChannel__topbar';

  let categories = [
    { label: 'Technology', tag: '#technology' },
    { label: 'Food', tag: '#food' },
    { label: 'News', tag: '#news' }
  ];

  let footerLinks = [
    { label: 'Minds', link: 'https://www.minds.com/' },
    { label: 'Careers', link: 'https://www.minds.com/careers' },
  ];

  function resetSettings() {
    cy.visit(`/pro/settings`);

    cy.route("POST", "**/api/v2/pro/settings").as("settings");

    cy.get('#title').focus().clear().type('Title');
    cy.get('#headline').focus().clear().type('This is a headline');

    cy.contains('Hashtags')
      .click();

    // remove all hashtags
    removeInputs();

    for (let i = 0; i < categories.length; i++) {
      let cat = categories[i];
      addTag(cat.label, cat.tag, i);
    }
    cy.contains('Footer')
      .click();

    cy.get('#footer_text')
      .clear()
      .type('This is the footer text');

    // remove all footer links
    removeInputs();

    for (let i = 0; i < footerLinks.length; i++) {
      let link = footerLinks[i];
      addFooterLink(link.label, link.link, i);
    }

    cy.contains('Domain')
      .click();

    cy.get('#domain')
      .clear()
      .type(Cypress.env().username + '.com');

    cy.contains('Save')
      .click()
      .wait('@settings').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body).to.deep.equal({ status: 'success' });
      }
    );
  }

  function removeInputs() {
    cy.get('.m-draggableList__list .m-proSettings__field .m-proSettings__flexInputs').should('be.visible').within($el => {
      for (let i = $el.length - 1; i >= 0; i--) { // flexInput. Start from the last one
        let c = $el[i];
        for (let j = 0; j < c.children.length; j++) { // inputs and the X button
          let cc = c.children[j];
          if (cc.nodeName === 'I') { // if it's the X button, click on it
            cy.wrap(cc).click();
          }
        }
      }
    });
  }

  function addTag(label, tag, index) {
    cy.contains('+ Add Tag')
      .click();

    cy.get(`#tag-label-${index}`)
      .clear()
      .type(label);

    cy.get(`#tag-tag-${index}`)
      .clear()
      .type(tag);
  }

  function addFooterLink(label, link, index) {
    cy.contains('Add Link')
      .click();

    cy.get(`#footer_link-title-${index}`)
      .clear()
      .type(label);

    cy.get(`#footer_link-href-${index}`)
      .clear()
      .type(link);
  }

  before(() => {
    cy.clearCookies();

    cy.setCookie('cypress:pro-standalone', Cypress.env().username + '.com'); // polyfill window.Minds.pro just so it actually loads the standalone site

    cy.getCookie('minds_sess')
      .then((sessionCookie) => {
        if (sessionCookie === null) {
          return cy.login(true);
        }
      });

    cy.setCookie('cypress:pro-standalone', Cypress.env().username + '.com'); // polyfill window.Minds.pro just so it actually loads the standalone site

    // after logging in, we need to get to settings and set everything up
    // resetSettings();

    // go to pro page
    cy.visit(`/`);

    cy.get(topBar);
  });

  beforeEach(() => {
    cy.server();
    cy.preserveCookies();
  });

  it('should neither have the minds topbar, the groups sidebar nor the chat', () => {
    cy.get('m-v2-topbar').should('not.exist');
    cy.get('m-sidebar--markers').should('not.exist');
    cy.get('m-messenger').should('not.exist');
  })

})
