context('Pro Product Page', () => {
  before(() => {
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (!sessionCookie) {
        return cy.login(true);
      }
    });
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  const contactUsButton = '.m-marketing__mainWrapper .mf-button';

  it('should have a contact us button', () => {
    cy.visit('/nodes', {
      onBeforeLoad(_window) {
        cy.stub(_window, 'open');
      },
    });

    cy.get(contactUsButton)
      .should('be.visible')
      .should('contain', 'Contact us for details')
      .click();

    cy.window()
      .its('open')
      .should('be.called');
  });
});
