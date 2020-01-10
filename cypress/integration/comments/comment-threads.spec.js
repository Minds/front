import generateRandomId from '../../support/utilities';

/**
 * @author Ben Hayward  
 * @create date 2019-08-09 14:42:51
 * @modify date 2019-08-09 14:42:51
 * @desc Spec tests for comment threads.
 */
context('Comment Threads', () => {
  
  const testUsername = generateRandomId();
  const testPassword = generateRandomId() + 'rR.7';

  const testMessage = {
    1: 'test tier 1',
    2: 'test tier 2',
    3: 'test tier 3',
  };

  const postMenu = 'minds-activity:first > div > m-post-menu > button > i';
  const deletePostOption = "m-post-menu > ul > li:visible:contains('Delete')";
  const deletePostButton = ".m-modal-confirm-buttons > button:contains('Delete')";
  
  const postCommentButton = 'm-comment__poster > div > div.minds-body > div > div > a.m-post-button';

  // pass in tier / tree depth.
  const replyButton = `minds-activity:first .m-comment__toolbar > div > span`;
  const commentButton = `minds-activity:first minds-button-comment`; 
  const commentInput = `minds-activity:first m-text-input--autocomplete-container > minds-textarea > div`;
  const commentContent = `minds-activity:first m-comments__tree .m-comment__bubble > p`; 

  const thumbsUpCounters = '[data-cy=data-minds-thumbs-up-counter]' //'minds-button-thumbs-up > a > span';
  const thumbsDownCounters = '[data-cy=data-minds-thumbs-down-counter]';

  const thumbsUpButton = '[data-cy=data-minds-thumbs-up-button]'
  const thumbsDownButton = '[data-cy=data-minds-thumbs-down-button]'
  before(() => {
    //make a post new.
    cy.getCookie('minds_sess')
    .then((sessionCookie) => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });

    cy.visit('/newsfeed/subscriptions');  
    cy.location('pathname')
      .should('eq', `/newsfeed/subscriptions`);

    cy.post('test post');
  });

  beforeEach(()=> {
    cy.preserveCookies();
    cy.server();
    cy.route('GET', '**/api/v2/comments/**').as('commentsOpen');
    cy.route('POST', '**/api/v1/comments/**').as('postComment');
    cy.route('PUT', '**/api/v1/thumbs/**').as('thumbsPut');
  });

  after(() => {
    //delete the post
    cy.get(postMenu).click();
    cy.get(deletePostOption).click();
    cy.get(deletePostButton).click();
  });

  it('should post three tiers of comments', () => {
    //Reveal the conversation
    cy.get(commentButton).click();

    //Add the first level of comments
    cy.get(commentInput).type(testMessage[1]);
    cy.get(postCommentButton).click();
    cy.get(commentContent).contains(testMessage[1]);

    //Add the second level of comments
    cy.get(replyButton)
      .click()
      .wait('@commentsOpen')
      .then(xhr => {
        expect(xhr.status).to.equal(200);
      });

    cy.get(commentInput)
      .first()
      .type(testMessage[2]);

    cy.get(postCommentButton)
      .first()
      .click();

    cy.get(commentContent).contains(testMessage[2]);
    

    //Add the third level of comments
    cy.get('minds-activity:first')
      .find('m-comments__tree m-comments__thread m-comment')
      .find('m-comments__thread m-comment:nth-child(2) .m-comment__toolbar > div > span')
      .last()
      .click()
      .wait('@commentsOpen')
      .then(xhr => {
        expect(xhr.status).to.equal(200);
      });

    cy.get(commentInput)
      .first()
      .type(testMessage[3]);
  
    cy.get(postCommentButton)
      .first()
      .click();

    cy.get(commentContent).contains(testMessage[3]);
    
    // Waiting on component init here.
    // If still not fully loaded will not break,
    // but may mean some of the buttons aren't tested.
    cy.wait(1000);
    
    // scope further get requests down to within the comments toolbar
    // avoids clicking thumbs in activity feed.
    cy.get('.m-comment__toolbar').within(($list) => {

    // thumbs up and down
    cy.get(thumbsUpButton)
      .click({multiple: true});
    
    cy.get(thumbsDownButton)
      .click({multiple: true});

    // check counters  
    cy.get(thumbsUpCounters)
        .each((counter) => {
          expect(counter[0].innerHTML).to.eql('1');
        });
    });

    cy.get(thumbsDownCounters)
      .each((counter) => {
        expect(counter[0].innerHTML).to.eql('1');
      });
  });

  it('should allow the user to make a mature comment', () => {
    // type message
    cy.get('minds-textarea')
      .last()
      .type("naughty message");

    // click mature
    cy.get('.m-mature-button')
      .last()
      .click();

    // post and await response
    cy.get('.m-post-button')
      .last()
      .click()
      .wait('@postComment')
      .then(xhr => {
        expect(xhr.status).to.equal(200);
      });
    
    // Making sure we don't act upon other comments
    cy.get('.m-comment__bubble').parent().within($list => {

      cy.contains('naughty message')
        .should('not.have.class', 'm-mature-text');

      cy.get('.m-redButton')
        .click();
      
      cy.contains('naughty message')
        .should('have.class', 'm-mature-text');
    });
    
    // get share link
    cy.get(postMenu).click();
    cy.contains('Share').click();
    
    // store share link
     cy.get('.m-share__copyableLinkText')
      .invoke('val')
      .then(val => {
        // log out
        cy.logout();

        // visit link
        cy.visit(val);
        
        // assert toggle works.
        cy.contains('naughty message')
          .should('have.class', 'm-mature-text');

        cy.get('.m-mature-text-toggle')
          .click();
        
        cy.contains('naughty message')
          .should('not.have.class', 'm-mature-text');
      });
  });

})
