context('Settings', () => {
  before(() => {
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });
  });

  it('should load settings', () => {
    cy.visit('/settings');
  });

  it('should load settings canary', () => {
    cy.visit('/settings/canary');
  });
});
