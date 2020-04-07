/**
 * @author Ben Hayward
 * @desc Spec tests for blocking users.
 */
import generateRandomId from '../../support/utilities';

context('Blocked', () => {

  const testUsername = generateRandomId(); 
  const testPassword = generateRandomId()+'X#';
  const newUserPostContent = `Test post ${generateRandomId()}`;
  const groupId = generateRandomId();

  const userDropdown = '[data-cy=data-minds-user-dropdown]';
  const userDropdownBlockButton = '[data-cy=data-minds-user-dropdown-block]';

  const userMenu = '[data-cy=data-minds-user-menu]';
  const userMenuSettings = '[data-cy=data-minds-user-menu-settings]';
  
  const blockedChannelsButton = '[data-cy=data-minds-settings-banned-channels]'
  const blockedChannelsContainer = '[data-cy=data-minds-blocked-channels]';

  before(() => {
    // make test user
    cy.newUser(testUsername, testPassword);

    // make a new group
    newGroup();

    // make group post
    cy.post(newUserPostContent);
    cy.visit('/');

    // make a newsfeed post
    cy.post(newUserPostContent);

    cy.logout();
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.server();
    cy.route('PUT', '**/api/v1/block/**').as('putBlock');
    cy.route('GET', '**/api/v1/block/**').as('getBlock');
    cy.route('DELETE', '**/api/v1/block/**').as('deleteBlock');
    cy.route("POST", "**/api/v1/subscribe/*").as("postSubscribe");
  });

  // TODO: Clean up
  after(() => {
    cy.logout();
    cy.login(true, testUsername, testPassword)
    cy.deleteUser(testUsername, testPassword)
  });

  it('should show nothing more to load when no users', () => {
    navigateToBlockedChannels();
    cy.contains("Nothing more to load");
  });

  // initial assertions before we block, to save time blocking and unblocking to check.
  it('should show posts for an unblocked user', () => {
    // subscribe to user so we can see their post
    subscribe(testUsername);

    // visit newsfeed, test users post should be visible.
    cy.visit('/');
    cy.contains(newUserPostContent).should('exist');
    
    // go to group organically
    cy.contains(groupId)
      .click()
      .wait('@getGroupsFeed').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal("success");
      });

    // test users post should be visible in the group.
    cy.contains(newUserPostContent).should('exist');
  });

  it('should let a user block another user', () => {
    blockUser(testUsername);
  });

  it('should not show the blocked users content', () => {
    // visit newsfeed, test users post should be visible.
    cy.route('GET', "**/api/v1/groups/member**").as("getGroupsMember")

    cy.visit('/')

    cy.contains(newUserPostContent).should('not.exist');

    // go to group organically
    cy.contains(groupId)
      .click()
      .wait('@getGroupsFeed').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal("success");
      });
    
    // test users post should be visible in the group.
    cy.contains(newUserPostContent).should('not.exist');
  });

  it('should allow a user to remove the user from their block list', () => {
    unblockUser(testUsername);
  });

  function navigateToBlockedChannels() {
    cy.get(userMenu).click();
    cy.get(userMenuSettings).click();
    cy.get(blockedChannelsButton).click();
  }

  function blockUser(username) {
    cy.visit(`/${username}`);

    cy.get(userDropdown).click();
    
    cy.get(userDropdownBlockButton)
      .click()
      .wait('@putBlock').then(xhr => {
        expect(xhr.status).to.equal(200);
      });
  }

  function unblockUser(username) {
    navigateToBlockedChannels();
    cy.get(blockedChannelsContainer)
      .within(($list) => {
        cy.contains(username);
        cy.contains('Unblock')
          .click()
          .wait('@deleteBlock').then(xhr => {
            expect(xhr.status).to.equal(200);
          });
      });
  }

  function subscribe(username) {
    cy.visit(`/${username}`);

    cy.get('button')
      .contains('Subscribe')
      .click()
      .wait('@postSubscribe')
      .then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal("success");
      });
  }

  function newGroup() {
    cy.server();
    cy.route("POST", "**/api/v1/groups/group*").as("postGroup");
    
    cy.get('m-group--sidebar-markers li:first-child')
      .contains('New group')
      .click();

    cy.location('pathname').should('eq', '/groups/create');

    // add a name
    cy.get('.m-group-info-name > input').type(groupId);
    // add a description
    cy.get('.m-group-info-brief-description > textarea').type('This is a test');

    cy.get('.m-groups-save > button')
      .contains('Create')
      .click()
      .wait('@postGroup').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal('success');
      });

    cy.get('.m-groupInfo__name').contains(groupId);
    cy.get('.m-groupInfo__description').contains('This is a test');
  }

});
