/**
 * @author Ben Hayward  
 * @create date 2019-08-09 14:42:51
 * @modify date 2019-08-09 14:42:51
 * @desc Spec tests for comment threads.
 */
context('Comment Threads', () => {
  
  const testMessage = {
    1: 'test tier 1',
    2: 'test tier 2',
    3: 'test tier 3',
  };

  const postMenu = 'minds-activity:first > div > m-post-menu > button > i';
  const deletePostOption = "m-post-menu > ul > li:visible:contains('Delete')";
  const deletePostButton = ".m-modal-confirm-buttons > button:contains('Delete')";
  
  const postCommentButton = 'm-comment__poster > div > div.minds-body > div > div > a.m-post-button';
  const thumbsUpCounters = '.m-comment__toolbar > div > minds-button-thumbs-up > a > span';
  const thumbsDownCounters = '.m-comment__toolbar > div > minds-button-thumbs-down > a > span';

  // pass in tier / tree depth.
  const replyButton = `minds-activity:first .m-comment__toolbar > div > span`;
  const commentButton = `minds-activity:first minds-button-comment`; 
  const commentInput = `minds-activity:first m-text-input--autocomplete-container > minds-textarea > div`;
  const commentContent = `minds-activity:first m-comments__tree .m-comment__bubble > p`; 

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
    cy.get(replyButton).click();
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
      .click();

    cy.get(commentInput)
      .first()
      .type(testMessage[3]);
    cy.get(postCommentButton)
      .first()
      .click();
    cy.get(commentContent).contains(testMessage[3]);

    //click thumbs up and down
    cy.get('.m-comment__toolbar')
      .find('minds-button-thumbs-up')
      .click({multiple: true});

    cy.get('.m-comment__toolbar')
      .find('minds-button-thumbs-down')
      .click({multiple: true});
    
    // check the values
    cy.get(thumbsUpCounters)
      .each((counter) => expect(counter.context.innerHTML).to.eql('1'));
    cy.get(thumbsDownCounters)
      .each((counter) => expect(counter.context.innerHTML).to.eql('1'));
  });

})
