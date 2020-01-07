import generateRandomId from '../support/utilities';

context('Newsfeed', () => {
  before(() => {
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.server();
    cy.route('POST', '**/api/v1/newsfeed').as('newsfeedPOST');
    cy.route('POST', '**/api/v1/media').as('mediaPOST');
    cy.route('POST', '**/api/v1/newsfeed/**').as('newsfeedEDIT');
    cy.route('POST', '**/api/v1/media/**').as('mediaEDIT');
    cy.visit('/newsfeed/subscriptions')
      .location('pathname')
      .should('eq', '/newsfeed/subscriptions');
  });

  const deleteActivityFromNewsfeed = () => {
    cy.get(
      '.minds-list > minds-activity:first m-post-menu .minds-more'
    ).click();
    cy.get(
      '.minds-list > minds-activity:first m-post-menu .minds-dropdown-menu .mdl-menu__item:nth-child(4)'
    ).click();
    cy.get(
      '.minds-list > minds-activity:first m-post-menu m-modal-confirm .mdl-button--colored'
    ).click();
  };

  const newActivityContent = content => {
    cy.get('minds-newsfeed-poster').should('be.visible');
    cy.get('minds-newsfeed-poster textarea').type(content);
  };

  const attachRichEmbed = (embedUrl) => {
    cy.get('minds-newsfeed-poster').should('be.visible');
    cy.get('minds-newsfeed-poster textarea')
      .type(embedUrl);
      
    cy.route('GET',  `**/api/v1/newsfeed/preview?url=${embedUrl}**`)
      .as('previewGET')
      .wait('@previewGET')
      .then(xhr => {
        expect(xhr.status).to.equal(200);
      });
  }

  const attachImageToActivity = () => {
    cy.uploadFile(
      '#attachment-input-poster',
      '../fixtures/international-space-station-1776401_1920.jpg',
      'image/jpg'
    );
    cy.wait('@mediaPOST').then(xhr => {
      expect(xhr.status).to.equal(200);
    });
  };

  const postActivityAndAwaitResponse = code => {
    cy.get('.m-posterActionBar__PostButton').click();
    cy.wait('@newsfeedPOST').then(xhr => {
      expect(xhr.status).to.equal(code);
    });
  };

  const navigateToNewsfeed = () => {
    cy.get('.m-v2-topbar__Nav >')
      .eq(1)
      .click();
    cy.location('pathname', { timeout: 20000 }).should(
      'contains',
      'newsfeed/subscriptions'
    );
    cy.wait(5000);
  };

  const editActivityContent = newContent => {
    cy.get(
      '.minds-list > minds-activity:first m-post-menu .minds-more'
    ).click();
    cy.get(
      '.minds-list > minds-activity:first m-post-menu .minds-dropdown-menu .mdl-menu__item:nth-child(1)'
    ).click();
    cy.get('.minds-list > minds-activity:first textarea').clear();
    cy.get('.minds-list > minds-activity:first textarea').type(newContent);
    cy.get('.minds-list > minds-activity:first .minds-editable-container .mdl-button--colored').click();
    cy.wait('@newsfeedEDIT').then(xhr => {
      expect(xhr.status).to.equal(200);
    });
  };

  const navigateToMediaPageFromNewsfeed = () => {
    cy.get('.minds-list > minds-activity:first  .item-image img').should(
      'be.visible'
    );
    cy.get('.minds-list > minds-activity:first  .item-image img').click();

    cy.get('m-overlay-modal').then(($modalOverlay) => {
      if ($modalOverlay.find('.m-mediaModal__stage').length) {
        cy.get('.m-mediaModal__stage').trigger('mouseenter');
        cy.get('.m-mediaModal__overlayContainer', {timeout: 10000}).click();
      }
    });

    cy.location('pathname', { timeout: 20000 }).should('contains', 'media');
  };

  it('should post an activity picking hashtags from the dropdown', () => {
    newActivityContent('This is a post');

    // click on hashtags dropdown
    cy.get(
      'minds-newsfeed-poster m-hashtags-selector .m-dropdown--label-container'
    ).click();

    // select #ART
    cy.get(
      'minds-newsfeed-poster m-hashtags-selector  m-dropdown m-form-tags-input > div > span'
    )
      .contains('#art')
      .click();

    // type in another hashtag manually
    cy.get('minds-newsfeed-poster m-hashtags-selector m-form-tags-input input')
      .type('hashtag{enter}')
      .click();

    // click away on arbitrary area.
    cy.get('minds-newsfeed-poster m-hashtags-selector .minds-bg-overlay').click(
      { force: true }
    );

    postActivityAndAwaitResponse(200);

    cy.get('.mdl-card__supporting-text.message.m-mature-message > span')
      .first()
      .contains('This is a post #art #hashtag');

    cy.get('.minds-list > minds-activity:first-child .message a:first-child')
      .contains('#art')
      .should(
        'have.attr',
        'href',
        '/newsfeed/global/top;hashtag=art;period=24h'
      );
    cy.get('.minds-list > minds-activity:first-child .message a:last-child')
      .contains('#hashtag')
      .should(
        'have.attr',
        'href',
        '/newsfeed/global/top;hashtag=hashtag;period=24h'
      );

    deleteActivityFromNewsfeed();
  });

  /**
   * Commenting out until scheduling is enabled properly on sandboxes
   */
  it('should be able to post an activity picking a scheduled date and the edit it', () => {
    cy.get('minds-newsfeed-poster').then((poster) => {
      if (poster.find('.m-poster-date-selector__input').length > 0) {
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
      }
    });    
  })

  it('should list scheduled activies', () => {
    cy.get('minds-newsfeed-poster').then((poster) => {
      if (poster.find('.m-poster-date-selector__input').length > 0) {
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
      }
    });
  })

  it('should post an activity with an image attachment', () => {
    navigateToNewsfeed();
    const identifier = Math.floor(Math.random() * 100);
    const content = 'This is a post with an image ' + identifier;
    newActivityContent(content);
    attachImageToActivity();
    postActivityAndAwaitResponse(200);

    cy.get('.minds-list > minds-activity:first .message', {timeout: 20000 }).contains(
      content
    );
    cy.get('.minds-list > minds-activity:first  .item-image img').should(
      'be.visible'
    );

    deleteActivityFromNewsfeed();
  });

  it('should post a nsfw activity', () => {
    newActivityContent('This is a nsfw post');

    // click on nsfw dropdown
    cy.get(
      'minds-newsfeed-poster m-nsfw-selector .m-dropdown--label-container'
    ).click();

    // select Nudity
    cy.get('minds-newsfeed-poster m-nsfw-selector .m-dropdownList__item')
      .contains('Nudity')
      .click();

    // click away
    cy.get('minds-newsfeed-poster m-nsfw-selector .minds-bg-overlay').click();

    postActivityAndAwaitResponse(200);

    // should have the mature text toggle
    cy.get(
      '.minds-list > minds-activity:first-child .message .m-mature-text-toggle'
    ).should('not.have.class', 'mdl-color-text--red-500');
    cy.get(
      '.minds-list > minds-activity:first-child .message .m-mature-message-content'
    ).should('have.class', 'm-mature-text');

    // click the toggle
    cy.get(
      '.minds-list > minds-activity:first-child .message .m-mature-text-toggle'
    ).click();

    // text should be visible now
    cy.get(
      '.minds-list > minds-activity:first-child .message .m-mature-text-toggle'
    ).should('have.class', 'mdl-color-text--red-500');
    cy.get(
      '.minds-list > minds-activity:first-child .message .m-mature-message-content'
    ).should('not.have.class', 'm-mature-text');

    cy.get(
      '.minds-list > minds-activity:first-child .message .m-mature-message-content'
    ).contains('This is a nsfw post');

    deleteActivityFromNewsfeed();
  });

  it('should vote an activity', () => {
    newActivityContent('This is an upvoted post');
    postActivityAndAwaitResponse(200);

    // upvote
    cy.get(
      '.minds-list > minds-activity:first-child minds-button-thumbs-up a'
    ).should('not.have.class', 'selected');
    cy.get(
      '.minds-list > minds-activity:first-child minds-button-thumbs-up a'
    ).click();
    cy.get(
      '.minds-list > minds-activity:first-child minds-button-thumbs-up a'
    ).should('have.class', 'selected');
    cy.get(
      '.minds-list > minds-activity:first-child minds-button-thumbs-up span'
    ).contains('1');

    cy.get(
      '.minds-list > minds-activity:first-child minds-button-thumbs-up a'
    ).click();
    cy.get(
      '.minds-list > minds-activity:first-child minds-button-thumbs-up a'
    ).should('not.have.class', 'selected');

    // downvote
    cy.get(
      '.minds-list > minds-activity:first-child minds-button-thumbs-down a'
    ).should('not.have.class', 'selected');
    cy.get(
      '.minds-list > minds-activity:first-child minds-button-thumbs-down a'
    ).click();
    cy.get(
      '.minds-list > minds-activity:first-child minds-button-thumbs-down a'
    ).should('have.class', 'selected');
    cy.get(
      '.minds-list > minds-activity:first-child minds-button-thumbs-down span'
    ).contains('1');

    cy.get(
      '.minds-list > minds-activity:first-child minds-button-thumbs-down a'
    ).click();
    cy.get(
      '.minds-list > minds-activity:first-child minds-button-thumbs-down a'
    ).should('not.have.class', 'selected');

    deleteActivityFromNewsfeed();
  });

  it('should have an "Upgrade to Plus" button and it should redirect to /plus', () => {
    cy.get(
      '.m-page--sidebar--navigation a.m-page--sidebar--navigation--item:nth-child(2) span'
    ).contains('Upgrade to Plus');

    cy.get(
      '.m-page--sidebar--navigation a.m-page--sidebar--navigation--item:nth-child(2)'
    )
      .should('have.attr', 'href', '/plus')
      .click();

    cy.location('pathname').should('eq', '/plus');
  });

  it('should have a "Buy Tokens" button and it should redirect to /token', () => {
    cy.visit('/');
    cy.get(
      '.m-page--sidebar--navigation a.m-page--sidebar--navigation--item:last-child span'
    ).contains('Buy Tokens');

    cy.get(
      '.m-page--sidebar--navigation a.m-page--sidebar--navigation--item:last-child'
    )
      .should('have.attr', 'href', '/tokens')
      .click();

    cy.location('pathname').should('eq', '/token');
  });

  it('"create blog" button in poster should redirect to /blog/edit/new', () => {
    cy.visit('/');

    cy.get('minds-newsfeed-poster .m-posterActionBar__CreateBlog')
      .contains('Create blog')
      .click();

    cy.location('pathname').should('eq', '/blog/edit/new');
  });

  it('clicking on "create blog" button in poster should prompt a confirm dialog and open a new blog with the currently inputted text', () => {
    cy.visit('/');

    newActivityContent('thegreatmigration'); // TODO: fix UX issue when hashtag element is overlapping input

    const stub = cy.stub();
    cy.on('window:confirm', stub);
    cy.get('minds-newsfeed-poster .m-posterActionBar__CreateBlog')
      .contains('Create blog')
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith(
          'Are you sure? The content will be moved to the blog editor.'
        );
      });

    cy.location('pathname').should('eq', '/blog/edit/new');

    cy.get(
      'm-inline-editor .medium-editor-element.medium-editor-insert-plugin p'
    ).contains('thegreatmigration');
  });

  it('should record a view when the user scrolls and an activity is visible', () => {
    cy.visit('/');

    cy.server();
    cy.route('POST', '**/api/v2/analytics/views/activity/*').as('view');

    newActivityContent('This is a post that will record a view');
    postActivityAndAwaitResponse(200);

    cy.scrollTo(0, '20px');

    cy.wait('@view').then(xhr => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body).to.deep.equal({ status: 'success' });
    });

    deleteActivityFromNewsfeed();
  });

  it('clicking on the plus button on the sidebar should redirect the user to  /groups/create', () => {
    cy.get(
      'm-group--sidebar-markers .m-groupSidebarMarkers__list li:first-child'
    )
      .contains('add')
      .click();

    cy.location('pathname').should('eq', '/groups/create');
  });


  /**
   * Skipping until sandbox behaves consistently as currently when posting,
   * on the sandbox it does not update the newsfeed and channel straight away as it does on prod.
   */ 
  it.skip('editing media post propagates to activity', () => {
    const identifier = Math.floor(Math.random() * 100);
    const content = 'This is a post with an image ' + identifier;

    newActivityContent(content);
    attachImageToActivity();
    postActivityAndAwaitResponse(200);

    cy.get('.minds-list > minds-activity:first .message').contains(content);

    navigateToMediaPageFromNewsfeed();

    cy.get('.m-media-content--heading', { timeout: 10000 }).contains(content);
    cy.get('.minds-button-edit').click();

    const newContent = content + ' changed';
    cy.get('minds-textarea .m-editor')
      .clear()
      .type(newContent);
    cy.get('.m-button--submit').click();
    cy.wait('@mediaEDIT').then(xhr => {
      expect(xhr.status).to.equal(200);
    });

    navigateToNewsfeed();

    cy.get('.minds-list > minds-activity:first .message').contains(newContent);

    deleteActivityFromNewsfeed();
  });

  /**
   * Skipping until sandbox behaves consistently as currently when posting,
   * on the sandbox it does not update the newsfeed and channel straight away as it does on prod.
   */ 
  it.skip('editing a media activity propagates to media post', () => {
    const identifier = Math.floor(Math.random() * 100);
    const content = 'This is a post with an image ' + identifier;

    newActivityContent(content);
    attachImageToActivity();
    postActivityAndAwaitResponse(200);

    cy.contains(content);
    cy.get('.minds-list > minds-activity:first  .item-image img').should(
      'be.visible'
    );

    const newContent = content + ' changed';
    editActivityContent(newContent);

    cy.contains(content);

    navigateToMediaPageFromNewsfeed();

    cy.get('.m-media-content--heading', { timeout: 10000 }).contains(newContent);

    navigateToNewsfeed();
    deleteActivityFromNewsfeed();
  });

  it('should show a rich embed post from youtube in a modal', () => {
    const content = generateRandomId() + " ",
      url = 'https://www.youtube.com/watch?v=jNQXAC9IVRw';

    // set up post.
    newActivityContent(content);
    attachRichEmbed(url);

    // post and await.
    cy.get('.m-posterActionBar__PostButton')
      .click()
      .wait('@newsfeedPOST').then(xhr => {
        expect(xhr.status).to.equal(200);

        //get activity, click it.
        cy.get(`[minds-data-activity-guid='${xhr.response.body.guid}']`)
          .click();

        //check modal is open.
        cy.get('[data-cy=data-minds-media-modal]')
          .contains(content);
        
        // close modal and tidy.
        cy.get('.m-overlay-modal--backdrop')
          .click({force: true});

        deleteActivityFromNewsfeed();
      });
  });

  it('should not open vimeo in a modal', () => {
    const content = generateRandomId() + " ",
      url = 'https://vimeo.com/8733915';

    // set up post.
    newActivityContent(content);
    attachRichEmbed(url);

    // post and await.
    cy.get('.m-posterActionBar__PostButton')
      .click()
      .wait('@newsfeedPOST').then(xhr => {
        expect(xhr.status).to.equal(200);

        //get activity, make assertions tht would not be true for modals.
        cy.get(`[minds-data-activity-guid='${xhr.response.body.guid}']`)
          .should('be.visible')
          .get('iframe')          
          .should('be.visible')
          .get('.minds-more')
          .should('be.visible');
        
          // tidy.
        deleteActivityFromNewsfeed();
      });
  });


  it('should not open soundcloud in a modal', () => {
    const content = generateRandomId() + " ",
      url = 'https://soundcloud.com/richarddjames/piano-un10-it-happened';

    // set up post.
    newActivityContent(content);
    attachRichEmbed(url);

    // post and await.
    cy.get('.m-posterActionBar__PostButton')
      .click()
      .wait('@newsfeedPOST').then(xhr => {
        expect(xhr.status).to.equal(200);

        //get activity, make assertions tht would not be true for modals.
        cy.get(`[minds-data-activity-guid='${xhr.response.body.guid}']`)
          .should('be.visible')
          .get('.m-rich-embed-action-overlay')          
          .should('be.visible')
          .get('.minds-more')
          .should('be.visible');

        deleteActivityFromNewsfeed();
      });
  });

  it('should not open spotify in a modal', () => {
    const content = generateRandomId() + " ",
      url = 'https://open.spotify.com/track/2MZSXhq4XDJWu6coGoXX1V?si=nvja0EfwR3q6GMQmYg6gPQ';

    // set up post.
    newActivityContent(content);
    attachRichEmbed(url);

    // post and await.
    cy.get('.m-posterActionBar__PostButton')
      .click()
      .wait('@newsfeedPOST').then(xhr => {
        expect(xhr.status).to.equal(200);

        //get activity, make assertions tht would not be true for modals.
        cy.get(`[minds-data-activity-guid='${xhr.response.body.guid}']`)
          .should('be.visible')
          .get('.m-rich-embed-action-overlay')          
          .should('be.visible')
          .get('.minds-more')
          .should('be.visible');

        deleteActivityFromNewsfeed();
      });
  });

  it('should not open spotify in a modal', () => {
    const content = generateRandomId() + " ",
      url = 'http://giphygifs.s3.amazonaws.com/media/IzVquL965ib4s/giphy.gif';

    // set up post.
    newActivityContent(content);
    attachRichEmbed(url);

    // post and await.
    cy.get('.m-posterActionBar__PostButton')
      .click()
      .wait('@newsfeedPOST').then(xhr => {
        expect(xhr.status).to.equal(200);

        //get activity, make assertions tht would not be true for modals.
        cy.get(`[minds-data-activity-guid='${xhr.response.body.guid}']`)
          .should('be.visible')
          .get('.m-rich-embed-action-overlay')          
          .should('be.visible')
          .get('.minds-more')
          .should('be.visible');

        deleteActivityFromNewsfeed();
      });
  });

  // enable once failing tests are fixed
  it.skip('should post an nsfw activity when value is held by the selector (is blue) but it has not been clicked yet', () => {

    // click on nsfw dropdown
    cy.get(
      'minds-newsfeed-poster m-nsfw-selector .m-dropdown--label-container'
    ).click();

    // select Nudity
    cy.get('minds-newsfeed-poster m-nsfw-selector .m-dropdownList__item')
      .contains('Nudity')
      .click();

    // click away
    cy.get('minds-newsfeed-poster m-nsfw-selector .minds-bg-overlay').click();

    // navigate away from newsfeed and back.
    cy.get('[data-cy=data-minds-nav-wallet-button]').first().click(); // bottom bar exists, so take first child 
    cy.get('[data-cy=data-minds-nav-newsfeed-button]').first().click(); 

    newActivityContent('This is a nsfw post');

    postActivityAndAwaitResponse(200);

    // should have the mature text toggle
    cy.get(
      '.minds-list > minds-activity:first-child .message .m-mature-text-toggle'
    ).should('not.have.class', 'mdl-color-text--red-500');
    cy.get(
      '.minds-list > minds-activity:first-child .message .m-mature-message-content'
    ).should('have.class', 'm-mature-text');

    // click the toggle
    cy.get(
      '.minds-list > minds-activity:first-child .message .m-mature-text-toggle'
    ).click();

    // text should be visible now
    cy.get(
      '.minds-list > minds-activity:first-child .message .m-mature-text-toggle'
    ).should('have.class', 'mdl-color-text--red-500');
    cy.get(
      '.minds-list > minds-activity:first-child .message .m-mature-message-content'
    ).should('not.have.class', 'm-mature-text');

    cy.get(
      '.minds-list > minds-activity:first-child .message .m-mature-message-content'
    ).contains('This is a nsfw post');

    deleteActivityFromNewsfeed();
  });

});
