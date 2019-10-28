context('Topbar', () => {
  before(() => {
    cy.getCookie('minds_sess')
    .then((sessionCookie) => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });
  });

  beforeEach(()=> {
    cy.preserveCookies();
  });

  it("clicking on the dropdown on the right should allow to go to the user's channel", () => {
    // open the menu
    cy.get('m-user-menu .m-user-menu__Anchor').click();

    cy.get('m-user-menu .m-user-menu__Dropdown li')
      .contains('View Channel')
      .click();

    cy.location('pathname').should('eq', `/${Cypress.env().username}/`);
  });

  it('clicking on the dropdown on the right should allow to go to settings', () => {
    // open the menu
    cy.get('m-user-menu .m-user-menu__Anchor').click();

    cy.get('m-user-menu .m-user-menu__Dropdown li')
      .contains('Settings')
      .click();

    cy.location('pathname').should('eq', '/settings/general');
  });

  it('clicking on the dropdown on the right should allow to go to the boost console', () => {
    // open the menu
    cy.get('m-user-menu .m-user-menu__Anchor').click();

    cy.get("m-user-menu .m-user-menu__Dropdown li:contains('Boost Console')")
      .click();

    cy.location('pathname').should('contain', '/boost/console/newsfeed/');
  });

  it('clicking on the dropdown on the right should allow to go to the help desk', () => {
    // open the menu
    cy.get('m-user-menu .m-user-menu__Anchor').click();

    cy.get("m-user-menu .m-user-menu__Dropdown li:contains('Help Desk')")
      .click();

    cy.location('pathname').should('eq', '/help');
  });

  it('clicking on the dropdown on the right should redirect to /canary', () => {
    // open the menu
    cy.get('m-user-menu .m-user-menu__Anchor').click();

    cy.get("m-user-menu .m-user-menu__Dropdown li:contains('Canary')")
      .click();

    cy.location('pathname').should('eq', '/canary');
  });

  it('clicking on the dropdown on the right should allow to toggle Dark Mode', () => {
    // open the menu
    cy.get('m-user-menu .m-user-menu__Anchor').click();

    cy.get('body.m-theme__light').should('be.visible');

    cy.get("m-user-menu .m-user-menu__Dropdown li:contains('Dark Mode')")
      .click();

    cy.get('body.m-theme__dark').should('be.visible');

    cy.get('m-user-menu .m-user-menu__Dropdown li')
      .contains('Light Mode')
      .click();

    cy.get('body.m-theme__light').should('be.visible');

    cy.get('m-user-menu .m-user-menu__Anchor').click({ force: true });
  });

  it('clicking on the bulb on the topbar should redirect to /newsfeed/subscriptions', () => {
    cy.get('.m-v2-topbarNavItem__Logo img').should('be.visible');

    cy.get('.m-v2-topbarNavItem__Logo').click();

    cy.location('pathname').should('eq', '/newsfeed/subscriptions');
  });

  it('clicking on the bell should open the notifications dropdown, and allow to view all notifications by redirecting to /notifications', () => {
    cy.get('.m-v2-topbar__UserMenu m-notifications--flyout').should('not.be.visible');

    cy.get('.m-v2-topbar__UserMenu a.m-notifications--topbar-toggle--icon')
      .should('be.visible')
      .click();

    cy.get('.m-v2-topbar__UserMenu m-notifications--flyout').should('be.visible');

    cy.get('.m-notifications--flyout--bottom-container a')
      .click();

    cy.location('pathname').should('eq', '/notifications');
  });
})
