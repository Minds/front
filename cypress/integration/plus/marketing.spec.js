import generateRandomId from '../../support/utilities';

context('Plus Product Page', () => {

  const user = {
    username: generateRandomId(),
    password: generateRandomId()+'aA1!'
  }

  before(() => {
    cy.clearCookies()
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  const upgradeButton = 'm-plus--subscription m-button';
  const wirePaymentsComponent = '.m-wireCreator';

  it('should automatically open the register modal if not logged in', () => {
    cy.visit('/plus?i=yearly&c=tokens')
    cy.get('.m-authModal__orDivider').should('be.visible');
  });

  it('should open the Wire Payment modal', () => {
    cy.logout();
    cy.newUser(user.username, user.password);
    cy.visit('/plus');

    cy.get(upgradeButton)
      .should('be.visible')
      .should('contain', 'Start free trial')
      .click();

    cy.get(wirePaymentsComponent).should('be.visible');
    cy.deleteUser(user.username, user.password)
  });

});
