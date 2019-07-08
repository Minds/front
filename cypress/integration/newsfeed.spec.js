context('Newsfeed', () => {
  beforeEach(() => {
    cy.login(true);

    cy.location('pathname', { timeout: 5000 }).should('eq', '/newsfeed/subscriptions');
  })
  it('should post an activity picking hashtags from the dropdown', () => {
    cy.get('minds-newsfeed-poster').should('be.visible');

    cy.get('minds-newsfeed-poster textarea').type('This is a post');

    // click on hashtags dropdown
    cy.get('minds-newsfeed-poster m-hashtags-selector .m-dropdown--label-container').click();

    // select #ART
    cy.get('minds-newsfeed-poster m-hashtags-selector  m-dropdown m-form-tags-input > div:nth-child(1) > span').contains('#art').click();

    // type in another hashtag manually
    cy.get('minds-newsfeed-poster m-hashtags-selector m-form-tags-input input').type('hashtag{enter}').click();

    // click away
    cy.get('minds-newsfeed-poster m-hashtags-selector .minds-bg-overlay').click();

    cy.get('.m-posterActionBar__PostButton').click();

    cy.wait(100);

    cy.get('.minds-list > minds-activity:first-child .message').contains('This is a post #art #hashtag');

    cy.get('.minds-list > minds-activity:first-child .message a:first-child').contains('#art').should('have.attr', 'href', '/newsfeed/global/top;hashtag=art;period=24h');
    cy.get('.minds-list > minds-activity:first-child .message a:last-child').contains('#hashtag').should('have.attr', 'href', '/newsfeed/global/top;hashtag=hashtag;period=24h');

    // cleanup
    cy.get('.minds-list > minds-activity:first-child m-post-menu .minds-more').click();
    cy.get('.minds-list > minds-activity:first-child m-post-menu .minds-dropdown-menu .mdl-menu__item:nth-child(4)').click();
    cy.get('.minds-list > minds-activity:first-child m-post-menu m-modal-confirm .mdl-button--colored').click();
  })

  it('should post an activity with an image attachment', () => {
    cy.get('minds-newsfeed-poster').should('be.visible');

    cy.get('minds-newsfeed-poster textarea').type('This is a post with an image');

    cy.uploadFile('#attachment-input-poster', '../fixtures/international-space-station-1776401_1920.jpg', 'image/jpg');

    cy.wait(1000);

    cy.get('.m-posterActionBar__PostButton').click();

    cy.wait(300);

    cy.get('.minds-list > minds-activity:first-child .message').contains('This is a post with an image');

    // assert image
    cy.get('.minds-list > minds-activity:first-child  .item-image img').should('be.visible');

    cy.get('.minds-list > minds-activity:first-child m-post-menu .minds-more').click();
    cy.get('.minds-list > minds-activity:first-child m-post-menu .minds-dropdown-menu .mdl-menu__item:nth-child(4)').click();
    cy.get('.minds-list > minds-activity:first-child m-post-menu m-modal-confirm .mdl-button--colored').click();
  })

  it('should post a nsfw activity', () => {
    cy.get('minds-newsfeed-poster').should('be.visible');

    cy.get('minds-newsfeed-poster textarea').type('This is a nsfw post');

    // click on nsfw dropdown
    cy.get('minds-newsfeed-poster m-nsfw-selector .m-dropdown--label-container').click();

    // select Nudity
    cy.get('minds-newsfeed-poster m-nsfw-selector .m-dropdownList__item').contains('Nudity').click();

    // click away
    cy.get('minds-newsfeed-poster m-nsfw-selector .minds-bg-overlay').click();

    cy.get('.m-posterActionBar__PostButton').click();

    cy.wait(100);

    // should have the mature text toggle
    cy.get('.minds-list > minds-activity:first-child .message .m-mature-text-toggle').should('not.have.class', 'mdl-color-text--red-500');
    cy.get('.minds-list > minds-activity:first-child .message .m-mature-message-content').should('have.class', 'm-mature-text');


    // click the toggle
    cy.get('.minds-list > minds-activity:first-child .message .m-mature-text-toggle').click();

    // text should be visible now
    cy.get('.minds-list > minds-activity:first-child .message .m-mature-text-toggle').should('have.class', 'mdl-color-text--red-500');
    cy.get('.minds-list > minds-activity:first-child .message .m-mature-message-content').should('not.have.class', 'm-mature-text');

    cy.get('.minds-list > minds-activity:first-child .message .m-mature-message-content').contains('This is a nsfw post');

    // cleanup
    cy.get('.minds-list > minds-activity:first-child m-post-menu .minds-more').click();
    cy.get('.minds-list > minds-activity:first-child m-post-menu .minds-dropdown-menu .mdl-menu__item:nth-child(4)').click();
    cy.get('.minds-list > minds-activity:first-child m-post-menu m-modal-confirm .mdl-button--colored').click();
  })

  it('should vote an activity', () => {
    cy.get('minds-newsfeed-poster textarea').type('This is an upvoted post');

    cy.get('.m-posterActionBar__PostButton').click();

    // upvote
    cy.get('.minds-list > minds-activity:first-child minds-button-thumbs-up a').should('not.have.class', 'selected');
    cy.get('.minds-list > minds-activity:first-child minds-button-thumbs-up a').click();
    cy.get('.minds-list > minds-activity:first-child minds-button-thumbs-up a').should('have.class', 'selected');
    cy.get('.minds-list > minds-activity:first-child minds-button-thumbs-up span').contains('1');

    cy.get('.minds-list > minds-activity:first-child minds-button-thumbs-up a').click();
    cy.get('.minds-list > minds-activity:first-child minds-button-thumbs-up a').should('not.have.class', 'selected');

    // downvote
    cy.get('.minds-list > minds-activity:first-child minds-button-thumbs-down a').should('not.have.class', 'selected');
    cy.get('.minds-list > minds-activity:first-child minds-button-thumbs-down a').click();
    cy.get('.minds-list > minds-activity:first-child minds-button-thumbs-down a').should('have.class', 'selected');
    cy.get('.minds-list > minds-activity:first-child minds-button-thumbs-down span').contains('1');

    cy.get('.minds-list > minds-activity:first-child minds-button-thumbs-down a').click();
    cy.get('.minds-list > minds-activity:first-child minds-button-thumbs-down a').should('not.have.class', 'selected');

    // cleanup
    cy.get('.minds-list > minds-activity:first-child m-post-menu .minds-more').click();
    cy.get('.minds-list > minds-activity:first-child m-post-menu .minds-dropdown-menu .mdl-menu__item:nth-child(4)').click();
    cy.get('.minds-list > minds-activity:first-child m-post-menu m-modal-confirm .mdl-button--colored').click();
  })

  it('should have an "Upgrade to Plus" button and it should redirect to /plus', () => {
    cy.get('.m-page--sidebar--navigation a.m-page--sidebar--navigation--item:first-child span')
      .contains('Upgrade to Plus');

    cy.get('.m-page--sidebar--navigation a.m-page--sidebar--navigation--item:first-child').should('have.attr', 'href', '/plus')
      .click();

    cy.location('pathname').should('eq', '/plus');
  })

  it('should have a "Buy Tokens" button and it should redirect to /token', () => {
    cy.get('.m-page--sidebar--navigation a.m-page--sidebar--navigation--item:last-child span')
      .contains('Buy Tokens');

    cy.get('.m-page--sidebar--navigation a.m-page--sidebar--navigation--item:last-child').should('have.attr', 'href', '/tokens')
      .click();

    cy.location('pathname').should('eq', '/token');
  })

  it('"create blog" button in poster should redirect to /blog/edit/new', () => {
    cy.get('minds-newsfeed-poster .m-posterActionBar__CreateBlog')
      .contains('Create blog')
      .click();

    cy.location('pathname').should('eq', '/blog/edit/new');
  })

  it('clicking on "create blog" button in poster should prompt a confirm dialog and open a new blog with the currently inputted text', () => {
    cy.get('minds-newsfeed-poster textarea').type('#thegreatmigration');

    const stub = cy.stub();
    cy.on('window:confirm', stub);
    cy.get('minds-newsfeed-poster .m-posterActionBar__CreateBlog')
      .contains('Create blog').click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith('Are you sure? The content will be moved to the blog editor.')
      });

    cy.location('pathname').should('eq', '/blog/edit/new');

    cy.get('m-inline-editor .medium-editor-element.medium-editor-insert-plugin p').contains('#thegreatmigration');
  })

  it('should record a view when the user scrolls and an activity is visible', () => {
    cy.server();
    cy.route("POST", "**/api/v2/analytics/views/activity/*").as("view");
    // create the post
    cy.get('minds-newsfeed-poster textarea').type('This is a post that will record a view');

    cy.get('.m-posterActionBar__PostButton').click();

    cy.wait(200);

    cy.scrollTo(0, '20px');

    cy.wait('@view', { requestTimeout: 2000 }).then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body).to.deep.equal({ status: 'success' });
    });

    // cleanup
    cy.get('.minds-list > minds-activity:first-child m-post-menu .minds-more').click();
    cy.get('.minds-list > minds-activity:first-child m-post-menu .minds-dropdown-menu .mdl-menu__item:nth-child(4)').click();
    cy.get('.minds-list > minds-activity:first-child m-post-menu m-modal-confirm .mdl-button--colored').click();
  })

  it('clicking on the plus button on the sidebar should redirect the user to  /groups/create', () => {
    cy.get('m-group--sidebar-markers .m-groupSidebarMarkers__list li:first-child')
      .contains('add')
      .click();

    cy.location('pathname').should('eq', '/groups/create');
  })

  it("clicking on the dropdown on the right should allow to go to the user's channel", () => {
    // open the menu
    cy.get('m-user-menu .m-user-menu__Anchor').click();

    cy.get('m-user-menu .m-user-menu__Dropdown li:nth-child(1)')
      .contains('View Channel')
      .click();

    cy.location('pathname').should('eq', `/${Cypress.env().username}`);
  })

  it('clicking on the dropdown on the right should allow to go to settings', () => {
    // open the menu
    cy.get('m-user-menu .m-user-menu__Anchor').click();

    cy.get('m-user-menu .m-user-menu__Dropdown li:nth-child(2)')
      .contains('Settings')
      .click();

    cy.location('pathname').should('eq', '/settings/general');
  })

  it('clicking on the dropdown on the right should allow to go to the boost console', () => {
    // open the menu
    cy.get('m-user-menu .m-user-menu__Anchor').click();

    cy.get('m-user-menu .m-user-menu__Dropdown li:nth-child(3)')
      .contains('Boost Console')
      .click();

    cy.location('pathname').should('eq', '/boost/console/newsfeed/history');
  })

  it('clicking on the dropdown on the right should allow to go to the boost console', () => {
    // open the menu
    cy.get('m-user-menu .m-user-menu__Anchor').click();

    cy.get('m-user-menu .m-user-menu__Dropdown li:nth-child(4)')
      .contains('Help Desk')
      .click();

    cy.location('pathname').should('eq', '/help');
  })

  it('clicking on the dropdown on the right should allow to view the whitepaper', () => {
    // open the menu
    cy.get('m-user-menu .m-user-menu__Anchor').click();

    cy.get('m-user-menu .m-user-menu__Dropdown li:nth-child(5)')
      .contains('Whitepaper');

    cy.get('m-user-menu .m-user-menu__Dropdown li:nth-child(5) a')
      .should('have.attr', 'href')
      .and('include', '/assets/documents/Whitepaper-v0.3.pdf');
  })

  it('clicking on the dropdown on the right should redirect to /canary', () => {
    // open the menu
    cy.get('m-user-menu .m-user-menu__Anchor').click();

    cy.get('m-user-menu .m-user-menu__Dropdown li:nth-child(6)')
      .contains('Canary')
      .click();

    cy.location('pathname').should('eq', '/canary');
  })

  it('clicking on the dropdown on the right should allow to toggle Dark Mode', () => {
    // open the menu
    cy.get('m-user-menu .m-user-menu__Anchor').click();

    cy.get('body.m-theme__light').should('be.visible');

    cy.get('m-user-menu .m-user-menu__Dropdown li:nth-child(7)')
      .contains('Dark Mode')
      .click();

    cy.get('body.m-theme__dark').should('be.visible');

    cy.get('m-user-menu .m-user-menu__Dropdown li:nth-child(7)')
      .contains('Light Mode')
      .click();

    cy.get('body.m-theme__light').should('be.visible');
  })

  it('clicking on the bulb on the topbar should redirect to /newsfeed/subscriptions', () => {
    cy.get('.m-v2-topbarNavItem__Logo img').should('be.visible');

    cy.get('.m-v2-topbarNavItem__Logo').click();

    cy.location('pathname').should('eq', '/newsfeed/subscriptions');
  })

  it('clicking on the bell should open the notifications dropdown, and allow to view all notifications by redirecting to /notifications', () => {
    cy.get('.m-v2-topbar__UserMenu m-notifications--flyout').should('not.be.visible');

    cy.get('.m-v2-topbar__UserMenu a.m-notifications--topbar-toggle--icon')
      .should('be.visible')
      .click();

    cy.get('.m-v2-topbar__UserMenu m-notifications--flyout').should('be.visible');

    cy.get('.m-notifications--flyout--bottom-container a')
      .click();

    cy.location('pathname').should('eq', '/notifications');
  })
})
