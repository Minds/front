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

  const upgradeButton = '[data-cy=data-minds-pro-upgrade-button]';
  const wirePaymentsComponent = 'm-wire__paymentscreator .m-wire--creator';

  it('should show an Upgrade to Pro button', () => {
    cy.visit('/pro')
      .location('pathname')
      .should('eq', '/pro');

    cy.get(upgradeButton)
      .should('be.visible')
      .should('contain', 'Upgrade to Pro')
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
