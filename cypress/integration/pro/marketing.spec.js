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

  const upgradeButton = 'm-pro--subscription .mf-button';
  const wirePaymentsComponent = 'm-wire__paymentscreator .m-wire--creator';

  it('should show a coming soon button', () => {
    cy.visit('/pro');

    cy.get(upgradeButton)
      .should('be.visible')
      .should('contain', 'Coming soon')
      .click();
  });

  // it('should open the Wire Payment modal', () => {
  //
  //   cy.visit('/pro');
  //
  //   cy.get(upgradeButton)
  //     .should('be.visible')
  //     .should('contain', 'Upgrade to Pro')
  //     .click();
  //
  //   cy.get(wirePaymentsComponent).should('be.visible');
  // });
  //
  // it('should automatically open the Wire Payment modal', () => {
  //   cy.visit('/pro?i=yearly&c=tokens');
  //
  //   cy.get(wirePaymentsComponent).should('be.visible');
  // });
});
