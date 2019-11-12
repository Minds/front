context('Plus Product Page', () => {
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

  const upgradeButton = 'm-plus--subscription .mf-button';
  const wirePaymentsComponent = 'm-wire__paymentscreator .m-wire--creator';

  it('should open the Wire Payment modal', () => {
    cy.visit('/plus');

    cy.get(upgradeButton)
      .should('be.visible')
      .should('contain', 'Upgrade to Plus')
      .click();

    cy.get(wirePaymentsComponent).should('be.visible');
  });

  it('should automatically open the Wire Payment modal', () => {
    cy.visit('/plus?i=yearly&c=tokens');

    cy.get(wirePaymentsComponent).should('be.visible');
  });
});
