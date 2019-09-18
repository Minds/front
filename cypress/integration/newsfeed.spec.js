context('Newsfeed', () => {
  before(() => {
    cy.getCookie('minds_sess')
    .then((sessionCookie) => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });  
  })

  beforeEach(()=> {
    cy.preserveCookies();
    cy.server();
    cy.route("POST", "**/api/v1/newsfeed").as("newsfeedPOST");
    cy.route("POST", "**/api/v1/media").as("mediaPOST");  
  });

  it('should post an activity picking hashtags from the dropdown', () => {
    cy.get('minds-newsfeed-poster').should('be.visible');

    cy.get('minds-newsfeed-poster textarea').type('This is a post');

    // click on hashtags dropdown
    cy.get('minds-newsfeed-poster m-hashtags-selector .m-dropdown--label-container').click();

    // select #ART
    cy.get('minds-newsfeed-poster m-hashtags-selector  m-dropdown m-form-tags-input > div > span').contains('#art').click();

    // type in another hashtag manually
    cy.get('minds-newsfeed-poster m-hashtags-selector m-form-tags-input input').type('hashtag{enter}').click();

    // click away on arbitrary area.
    cy.get('minds-newsfeed-poster m-hashtags-selector .minds-bg-overlay').click({force: true});
  
    // define request
    cy.get('.m-posterActionBar__PostButton').click();
 
    //await response
    cy.wait('@newsfeedPOST').then((xhr) => {
      expect(xhr.status).to.equal(200);
    });

    cy.get('.mdl-card__supporting-text.message.m-mature-message > span').first().contains('This is a post #art #hashtag');

    cy.get('.minds-list > minds-activity:first-child .message a:first-child').contains('#art').should('have.attr', 'href', '/newsfeed/global/top;hashtag=art;period=24h');
    cy.get('.minds-list > minds-activity:first-child .message a:last-child').contains('#hashtag').should('have.attr', 'href', '/newsfeed/global/top;hashtag=hashtag;period=24h');

    // cleanup
    cy.get('.minds-list > minds-activity:first-child m-post-menu .minds-more').click();
    cy.get('.minds-list > minds-activity:first-child m-post-menu .minds-dropdown-menu .mdl-menu__item:nth-child(4)').click();
    cy.get('.minds-list > minds-activity:first-child m-post-menu m-modal-confirm .mdl-button--colored').click();
  })

  it('should be able to post an activity picking a scheduled date and the edit it', () => {
    cy.get('minds-newsfeed-poster').should('be.visible');

    cy.get('minds-newsfeed-poster textarea').type('This is a post');

    // set scheduled date
    cy.get('.m-poster-date-selector__input').click();
    cy.get('button.c-datepicker__next').click();
    cy.get('tr.c-datepicker__days-row:nth-child(2) td.c-datepicker__day-body:first-child').click();
    cy.get('a.c-btn.c-btn--flat.js-ok').click();

    // get setted date to compare
    let scheduledDate;
    cy.get('div.m-poster-date-selector__input div.m-tooltip--bubble')
      .invoke('text').then((text) => {
        scheduledDate = text;
      });

    cy.get('.m-posterActionBar__PostButton').click();

    cy.wait(100);

    // compare setted date with time_created
    cy.get('.minds-list > minds-activity:first-child div.mdl-card__supporting-text > div.body > a.permalink > span')
      .invoke('text').then((text) => {
        const time_created = new Date(text).getTime();
        scheduledDate = new Date(scheduledDate).getTime();
        expect(scheduledDate).to.equal(time_created);
      });

    // prepare to listen
    cy.server();
    cy.route("POST", '**/api/v1/newsfeed/**').as("saveEdited");

    // edit the activity
    cy.get('.minds-list > minds-activity:first-child m-post-menu > button.minds-more').click();
    cy.get('.minds-list > minds-activity:first-child li.mdl-menu__item:first-child').click();
    cy.get('.minds-list > minds-activity:first-child .m-poster-date-selector__input').click();
    cy.get('button.c-datepicker__next').click();
    cy.get('tr.c-datepicker__days-row:nth-child(3) td.c-datepicker__day-body:first-child').click();
    cy.get('a.c-btn.c-btn--flat.js-ok').click();

    // get setted date to compare
    cy.get('.minds-list > minds-activity:first-child div.m-poster-date-selector__input div.m-tooltip--bubble')
      .invoke('text').then((text) => {
        scheduledDate = text;
      });

    // compare setted date with time_created
    cy.get('.minds-list > minds-activity:first-child div.mdl-card__supporting-text > div.body > a.permalink > span')
      .invoke('text').then((text) => {
        const time_created = new Date(text).getTime();
        scheduledDate = new Date(scheduledDate).getTime();
        expect(scheduledDate).to.equal(time_created);
      });

    // Save
    cy.get('.minds-list > minds-activity:first-child button.mdl-button.mdl-button--colored').click();
    cy.wait('@saveEdited', { requestTimeout: 5000 }).then((xhr) => {
      expect(xhr.status).to.equal(200, '**/api/v1/newsfeed/** request status');
    });

    // cleanup
    cy.get('.minds-list > minds-activity:first-child m-post-menu .minds-more').click();
    cy.get('.minds-list > minds-activity:first-child m-post-menu .minds-dropdown-menu .mdl-menu__item:nth-child(4)').click();
    cy.get('.minds-list > minds-activity:first-child m-post-menu m-modal-confirm .mdl-button--colored').click();
  })

  it('should list scheduled activies', () => {
    cy.server();
    cy.route("GET", '**/api/v2/feeds/scheduled/**/count?').as("scheduledCount");
    cy.route("GET", '**/api/v2/feeds/scheduled/**/activities?**').as("scheduledActivities");

    cy.visit(`/${Cypress.env().username}`);

    cy.wait('@scheduledCount', { requestTimeout: 2000 }).then((xhr) => {
      expect(xhr.status).to.equal(200, 'feeds/scheduled/**/count request status');
    });

    cy.get('div.m-mindsListTools__scheduled').click();

    cy.wait('@scheduledActivities', { requestTimeout: 2000 }).then((xhr) => {
      expect(xhr.status).to.equal(200, 'feeds/scheduled/**/activities request status');
    });

  })

  it('should post an activity with an image attachment', () => {
    cy.get('minds-newsfeed-poster').should('be.visible');

    cy.get('minds-newsfeed-poster textarea').type('This is a post with an image');

    cy.uploadFile('#attachment-input-poster', '../fixtures/international-space-station-1776401_1920.jpg', 'image/jpg');
    
    cy.wait('@mediaPOST').then((xhr) => {
      expect(xhr.status).to.equal(200);
    });
    
    cy.get('.m-posterActionBar__PostButton').click();
 
    //await response
    cy.wait('@newsfeedPOST').then((xhr) => {
      expect(xhr.status).to.equal(200);
    });
    
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

    //await response
    cy.wait('@newsfeedPOST').then((xhr) => {
      expect(xhr.status).to.equal(200);
    });

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
    cy.get('.m-page--sidebar--navigation a.m-page--sidebar--navigation--item:nth-child(2) span')
      .contains('Upgrade to Plus');

    cy.get('.m-page--sidebar--navigation a.m-page--sidebar--navigation--item:nth-child(2)').should('have.attr', 'href', '/plus')
      .click();

    cy.location('pathname').should('eq', '/plus');
  })

  it('should have a "Buy Tokens" button and it should redirect to /token', () => {
    cy.visit('/');
    cy.get('.m-page--sidebar--navigation a.m-page--sidebar--navigation--item:last-child span')
      .contains('Buy Tokens');

    cy.get('.m-page--sidebar--navigation a.m-page--sidebar--navigation--item:last-child').should('have.attr', 'href', '/tokens')
      .click();

    cy.location('pathname').should('eq', '/token');
  })

  it('"create blog" button in poster should redirect to /blog/edit/new', () => {
    cy.visit('/');

    cy.get('minds-newsfeed-poster .m-posterActionBar__CreateBlog')
      .contains('Create blog')
      .click();

    cy.location('pathname').should('eq', '/blog/edit/new');
  })

  it('clicking on "create blog" button in poster should prompt a confirm dialog and open a new blog with the currently inputted text', () => {
    cy.visit('/');

    cy.get('minds-newsfeed-poster textarea').type('thegreatmigration'); // TODO: fix UX issue when hashtag element is overlapping input

    const stub = cy.stub();
    cy.on('window:confirm', stub);
    cy.get('minds-newsfeed-poster .m-posterActionBar__CreateBlog')
      .contains('Create blog').click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith('Are you sure? The content will be moved to the blog editor.')
      });

    cy.location('pathname').should('eq', '/blog/edit/new');

    cy.get('m-inline-editor .medium-editor-element.medium-editor-insert-plugin p').contains('thegreatmigration');
  })

  it('should record a view when the user scrolls and an activity is visible', () => {
    cy.visit('/');

    cy.server();
    cy.route("POST", "**/api/v2/analytics/views/activity/*").as("view");
    // create the post
    cy.get('minds-newsfeed-poster textarea').type('This is a post that will record a view');

    cy.get('.m-posterActionBar__PostButton').click();

    //await response
    cy.wait('@newsfeedPOST').then((xhr) => {
      expect(xhr.status).to.equal(200);
    });

    cy.scrollTo(0, '20px');

    cy.wait('@view').then((xhr) => {
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

})
