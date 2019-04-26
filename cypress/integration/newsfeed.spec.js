context('Login', () => {
  beforeEach(() => {
    cy.login(true);
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
})
