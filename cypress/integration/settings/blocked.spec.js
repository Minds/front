/**
 * @author Ben Hayward
 * @desc Spec tests for blocking users.
 */
import generateRandomId from '../../support/utilities';

context('Blocked', () => {

  const testUsername = generateRandomId(); 
  const testPassword = generateRandomId()+'X#';

  const userDropdown = '[data-cy=data-minds-user-dropdown]';
  const userDropdownBlockButton = '[data-cy=data-minds-user-dropdown-block]';

  const userMenu = '[data-cy=data-minds-user-menu]';
  const userMenuSettings = '[data-cy=data-minds-user-menu-settings]';
  
  const blockedChannelsButton = '[data-cy=data-minds-settings-banned-channels]'
  const blockedChannelsContainer = '[data-cy=data-minds-blocked-channels]';

  before(() => {
    cy.newUser(testUsername, testPassword);
    cy.logout();
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.overrideFeatureFlags({
      channels: false,
    });
    cy.server();
    cy.route('PUT', '**/api/v1/block/**').as('putBlock');
    cy.route('GET', '**/api/v1/block/**').as('getBlock');
    cy.route('DELETE', '**/api/v1/block/**').as('deleteBlock');
  });

  after(() => {
    cy.logout();
    cy.login(true, testUsername, testPassword);
    cy.deleteUser(testUsername, testPassword);
    cy.clearCookies({log: true});
  });

  it('should show nothing more to load when no users', () => {
    navigateToBlockedChannels();
    cy.contains("Nothing more to load");
  });

  it('should let a user block another user', () => {
    cy.visit(`/${testUsername}`);

    cy.get(userDropdown).click();
    
    cy.get(userDropdownBlockButton)
      .click()
      .wait('@putBlock').then(xhr => {
        expect(xhr.status).to.equal(200);
      });
  });

  it('should allow a user to remove the user from their block list', () => {
    navigateToBlockedChannels();    
    cy.get(blockedChannelsContainer)
      .within(($list) => {
        cy.contains(testUsername);
        cy.contains('Unblock')
          .click()
          .wait('@deleteBlock').then(xhr => {
            expect(xhr.status).to.equal(200);
          });
      });
  });

  function navigateToBlockedChannels() {
    cy.get(userMenu).click();
    cy.get(userMenuSettings).click();
    cy.get(blockedChannelsButton).click();
  }

});
