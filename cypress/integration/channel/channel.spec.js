// skipped until feat release
context.skip('Channel', () => {
  before(() => {
    cy.getCookie('minds_sess')
    .then((sessionCookie) => {
      if (sessionCookie === null) {
       return cy.login(true);
      }
    });
    cy.visit(`/${Cypress.env().username}`);
  });

  beforeEach(()=> {
    cy.preserveCookies();
  });

  after(()=> {
    cy.get('.m-channel-mode-selector--dropdown')
    .click()
    .find(".m-dropdown--list--item:contains('Public')")
    .should('be.visible')
    .click();
  });

  it('should change channel mode to public', () => {
    cy.get('.m-channel-mode-selector--dropdown')
      .click()
      .find(".m-dropdown--list--item:contains('Public')")
      .should('be.visible')
      .click();

    cy.get('.m-channel-mode-selector--dropdown')
      .find('label').contains('Public');
  });

  it('should change channel mode to moderated', () => {
    cy.get('.m-channel-mode-selector--dropdown')
      .click()
      .find(".m-dropdown--list--item:contains('Moderated')")
      .should('be.visible')
      .click();

    cy.get('.m-channel-mode-selector--dropdown')
      .find('label').contains('Moderated');
  });

  it('should change channel mode to closed', () => {
    cy.get('.m-channel-mode-selector--dropdown')
      .click()
      .find(".m-dropdown--list--item:contains('Closed')")
      .should('be.visible')
      .click();

    cy.get('.m-channel-mode-selector--dropdown')
      .find('label').contains('Closed');
  });

});
