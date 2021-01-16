import generateRandomId from '../../support/utilities';

const groupId = generateRandomId();

const member = {
  username: generateRandomId(),
  password: generateRandomId() + 'A1a#!',
};

const postContent = generateRandomId();

context.skip('Groups', () => {
  before(() => {
    // cy.newUser(member.username, member.password);
    // cy.logout();
    // cy.login(true);
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });
  });

  beforeEach(() => {
    // This test makes use of cy.post()
    cy.overrideFeatureFlags({ 'activity-composer': true, navigation: false });
    cy.preserveCookies();
    cy.server();
    cy.route('GET', '**/api/v2/feeds/container/**').as('getGroupsFeed');
    cy.route('POST', '**/api/v1/groups/group*').as('postGroup');
    cy.route('GET', '**/api/v1/groups/member/**').as('getGroupsMember');
    cy.route('GET', '**/v1/groups/group/**').as('getGroupsGroup');
  });

  // after(() => {
  //   cy.logout(true);
  //   cy.login(false, member.username, member.password);
  //   cy.deleteUser(member.username, member.password);
  // });

  it('should create and edit a group', () => {
    cy.get('m-group--sidebar-markers li:first-child')
      .contains('New group')
      .click();

    cy.location('pathname').should('eq', '/groups/create');

    // add a banner
    cy.uploadFile(
      '[data-cy="minds-groups-create-banner"]',
      '../fixtures/international-space-station-1776401_1920.jpg',
      'image/jpg'
    );

    // add a name
    cy.get('[data-cy="minds-groups-create-name-input"]').type(groupId);
    // add a description
    cy.get('[data-cy="minds-groups-create-description-input"]').type(
      'This is a test'
    );

    cy.get('[data-cy="minds-groups-create-submit"]')
      .contains('Create')
      .click();
    cy.route('POST', '**/api/v1/groups/group/*/banner*').as('postBanner');

    // get current groups count of sidebar
    cy.get('.m-groupSidebarMarkers__list')
      .children()
      .its('length')
      .then(size => {
        cy.wait('@postGroup')
          .then(xhr => {
            expect(xhr.status).to.equal(200);
            expect(xhr.response.body.status).to.equal('success');
          })
          .wait('@postBanner')
          .then(xhr => {
            expect(xhr.status).to.equal(200);
            expect(xhr.response.body.status).to.equal('success');
          });

        //check count changed.
        cy.get('.m-groupSidebarMarkers__list')
          .children()
          .should('have.length', size + 1);
      });
    cy.get('.m-groupInfo__name').contains(groupId);
    cy.get('.m-groupInfo__description').contains('This is a test');

    // open settings button
    cy.get('minds-groups-settings-button > button').click();

    cy.get('minds-groups-settings-button ul.minds-dropdown-menu li:first-child')
      .contains('Edit')
      .click();

    // edit name
    cy.get('.m-groupInfo__name input').type(' edit');

    // edit description
    cy.get('.m-groupInfo__description textarea').type(' group');

    // open settings button
    cy.get('minds-groups-settings-button > button').click();

    cy.get('minds-groups-settings-button ul.minds-dropdown-menu li:first-child')
      .contains('Save')
      .click();

    cy.get('.m-groupInfo__name').contains(groupId + ' edit');
    cy.get('.m-groupInfo__description').contains('This is a test group');
  });

  it('should be able to toggle conversation and comment on it', () => {
    cy.viewport(1200, 900);

    cy.contains(groupId).click({ force: true });

    // toggle the conversation
    cy.get('.m-groupGrid__right').should('be.visible');
    cy.get('.m-groupGrid__toggleBtn').click();
    cy.get('.m-groupGrid__right').should('not.be.visible');
    cy.get('.m-groupGrid__toggleBtn').click();

    // comment
    cy.get(
      'minds-groups-profile-conversation m-comments__tree minds-textarea .m-editor'
    ).type('lvl 1 comment');
    cy.get(
      'minds-groups-profile-conversation m-comments__tree a.m-post-button'
    ).click();

    // comment should appear on the list
    cy.get(
      'minds-groups-profile-conversation m-comments__tree > m-comments__thread .m-comment__message'
    ).contains('lvl 1 comment');

    cy.on('window:confirm', str => {
      return true;
    });
  });

  it('should be able to toggle conversations', () => {
    cy.contains(groupId).click();

    cy.get('minds-groups-settings-button > button').click();
    cy.contains('Disable Conversation').click();

    cy.get('.m-groupGrid__right').should('not.exist');

    cy.get('minds-groups-settings-button > button').click();
    cy.contains('Enable Conversation').click();

    cy.get('.m-groupGrid__right').should('exist');
  });

  it('should post an activity inside the group and record the view when scrolling', () => {
    cy.contains(groupId).click();

    cy.reload(); // Reload because the feature flag may not be here

    cy.server();
    cy.route('POST', '**/api/v2/analytics/views/activity/*').as('view');

    cy.post('This is a post');

    // the activity should show that it was posted in this group
    cy.get('.minds-list minds-activity .body a:nth-child(2)').contains(
      `(${groupId} edit)`
    );

    cy.get('.minds-list minds-activity .m-mature-message-content').contains(
      'This is a post'
    );

    // create the post
    cy.post('This is a post that will record a view');

    cy.scrollTo(0, '20px');

    cy.wait('@view').then(xhr => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body).to.deep.equal({ status: 'success' });
    });
  });

  it('should navigate to discovery when Find a Group clicked', () => {
    cy.contains('Discover Groups').click();
    cy.location('pathname').should(
      'eq',
      '/newsfeed/global/top;period=12h;type=groups;all=1'
    );
  });

  it.skip('should allow a user to join the group', () => {
    // load group as group owner
    cy.contains(groupId)
      .click()
      .wait('@getGroupsFeed')
      .then(xhr => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal('success');
      });

    // store URL
    cy.url().then(url => {
      // logout and login as new user.
      cy.logout();
      cy.login(true, member.username, member.password);

      // go to group as new user.
      cy.visit(url)
        .wait('@getGroupsFeed')
        .then(xhr => {
          expect(xhr.status).to.equal(200);
          expect(xhr.response.body.status).to.equal('success');
        });

      // join.
      cy.get('.m-groupInfo__actionButtons')
        .contains('Join')
        .click();

      // make a post.
      cy.post(postContent);
    });
  });

  // Causes pipeline to hang currently.
  it.skip('should allow an admin to kick the new user by post menu', () => {
    // nav to group organically.
    cy.contains(groupId)
      .click()
      .wait('@getGroupsFeed')
      .then(xhr => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal('success');
      });

    // get the parental activity, and within it...
    cy.contains(postContent)
      .parentsUntil('minds-activity')
      .parent()
      .within($list => {
        // click dropdown and then remove option.
        cy.get('[data-cy=data-minds-post-menu-button]').click();
        cy.get('[data-cy=data-minds-group-dropdown-remove]').click();
      });

    // confirm
    cy.get('[data-cy=data-minds-kick-modal-confirm]').click();
    cy.get('[data-cy=data-minds-kick-modal-okay]').click();

    // reset state.
    cy.logout();
    cy.login();
  });

  it.skip('should allow an admin to kick the new user by members menu', () => {
    // nav to group.
    cy.contains(groupId)
      .click()
      .wait('@getGroupsFeed')
      .then(xhr => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal('success');
      });

    cy.contains('+ Members')
      .click()
      .wait('@getGroupsGroup')
      .then(xhr => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal('success');
      });
    cy.get('.minds-usercard-buttons')
      .contains('settings')
      .click();

    cy.contains('Remove from Group').click();
    cy.get('[data-cy=data-minds-modal-confirm]').click();
  });

  it('should delete a group', () => {
    // nav to group.
    cy.contains(groupId)
      .click()
      .wait('@getGroupsFeed')
      .then(xhr => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal('success');
      });

    // click settings cog.
    cy.get('minds-groups-settings-button > button').click();

    cy.wait(500);

    // hit delete group, and confirm.
    cy.get('[data-cy=data-minds-group-dropdown-delete]').click({ force: true });

    cy.wait(500);

    cy.contains('Confirm')
      .click()
      .location('pathname')
      .should('eq', '/');

    // assert groupId no longer exists on sidebar.
    //cy.contains(groupId).should('not.exist');
  });
});
