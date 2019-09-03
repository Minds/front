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

  const hamburgerMenu = '.m-v2-topbar__UserMenu > m-user-menu > div.m-user-menu.m-dropdown > a';
  const logoutButton = '.m-user-menu.m-dropdown > ul > li:nth-child(11) > a';
  const postMenu = 'minds-activity:nth-child(2) > div > m-post-menu > button > i';
  const deletePostOption = 'minds-activity:nth-child(2) m-post-menu > ul > li:nth-child(4)';
  const deletePostButton = 'm-modal-confirm div:nth-child(1) > div > button.mdl-button--colored';
  
  const channelButton = '.m-v2-topbar__Top > div > a > minds-avatar > div'; 
  const postCommentButton = 'm-comment__poster > div > div.minds-body > div > div > a.m-post-button';

  const thumbsUpButtons = '.m-comment__toolbar minds-button-thumbs-up';
  const thumbsDownButtons = '.m-comment__toolbar minds-button-thumbs-down';
  const thumbsUpCounters = '.m-comment__toolbar > div > minds-button-thumbs-up > a > span';
  const thumbsDownCounters = '.m-comment__toolbar > div > minds-button-thumbs-down > a > span';

  // pass in tier / tree depth.
  const replyButton = (index) => `minds-activity:nth-child(${index}) .m-comment__toolbar > div > span`;
  const commentButton = (index) => `minds-activity:nth-child(${index}) minds-button-comment`; 
  const commentInput = (index) => `minds-activity:nth-child(${index}) m-text-input--autocomplete-container > minds-textarea > div`;
  const commentContent = (index) => `minds-activity:nth-child(${index}) m-comments__tree .m-comment__bubble > p`; 

  before(() => {
    //make a post new.
    login();
    cy.post('test post');
    
    //manually sign-out.
    cy.get(hamburgerMenu).click();
    cy.get(logoutButton).click();
  });

  after(() => {
    //delete the post
    cy.wait(1000);
    cy.get(postMenu).click();
    cy.get(deletePostOption).click();
    cy.get(deletePostButton).click();
  });

  beforeEach(() => {
    login();
    cy.wait(2000);
  });

  it('should allow a user to post a tier 1 comment', () => {
    cy.get(commentButton(2)).click();
    cy.get(commentInput(2)).type(testMessage[1]);
    cy.get(postCommentButton).click();
    cy.get(commentContent(2)).contains(testMessage[1]);
  });

  it('should allow a user to post a tier 2 comment', () => {
    //expand top comment, then top reply button.
    cy.get(commentButton(2)).click();
    cy.get(replyButton(2)).click();
    cy.get(commentInput(2)).first().type(testMessage[2]);
    cy.get(postCommentButton).first().click();
    cy.get(commentContent(2)).contains(testMessage[2]);
  });

  it('should allow a user to post a tier 3 comment', () => {
    //expand top comment, then top reply button.
    cy.get(commentButton(2)).click();
    cy.get(replyButton(2)).click();
    cy.wait(1000);

    //there are two reply buttons now, use the last one.
    cy.get(replyButton(2)).last().click();
    cy.wait(1000);
    
    //check the comments.
    cy.get(commentInput(2)).first().type(testMessage[3]);
    cy.get(postCommentButton).first().click();
    cy.get(commentContent(2)).contains(testMessage[3]);
  });

  it('should allow the user to vote up and down comments', () => {
    
    //expand top comment, then top reply button.
    cy.get(commentButton(2)).click();
    cy.get(replyButton(2)).click();
    cy.wait(1000);

    //there are two reply buttons now, use the last one.
    cy.get(replyButton(2)).last().click();
    cy.wait(1000);
  
    //click thumbs up and down
    cy.get(thumbsDownButtons).click({multiple: true});
    cy.get(thumbsUpButtons).click({multiple: true});
    
    // check the values
    cy.get(thumbsUpCounters)
      .each((counter) => expect(counter.context.innerHTML).to.eql('1'));
    cy.get(thumbsDownCounters)
      .each((counter) => expect(counter.context.innerHTML).to.eql('1'));
  });

  function login() {
    cy.login(true);

    cy.location('pathname', { timeout: 30000 })
      .should('eq', `/newsfeed/subscriptions`);

    cy.get(channelButton).click();  
  }
})
