/**
 * @author Ben Hayward
 * @create date 2019-08-09 14:42:51
 * @modify date 2019-08-09 14:42:51
 * @desc Spec tests for comment threads.
 */

import generateRandomId from '../support/utilities';

context('Notification', () => {
  
  //secondary user for testing.
  let username = '';
  let password = '';

  const commentText = 'test comment';
  const postText = 'test comment'
  const hamburgerMenu = '.m-v2-topbar__UserMenu > m-user-menu > div.m-user-menu.m-dropdown > a';
  const logoutButton = '.m-user-menu.m-dropdown > ul > li:nth-child(11) > a';
  const postMenu = 'minds-activity:nth-child(2) > div > m-post-menu > button > i';
  const deletePostOption = 'minds-activity:nth-child(2) m-post-menu > ul > li:nth-child(4)';
  const deletePostButton = 'm-modal-confirm div:nth-child(1) > div > button.mdl-button--colored';
  
  const channelButton = '.m-v2-topbar__Top > div > a > minds-avatar > div'; 
  const postCommentButton = 'm-comment__poster > div > div.minds-body > div > div > a.m-post-button';
  const commentButton = 'minds-activity > div.tabs > minds-button-comment > a'; 
  const commentInput = 'm-comment__poster minds-textarea > div';
  const commentContent ='.m-comment__bubble > p';
  const notificationBell = 'm-notifications--topbar-toggle > a > i';

  before(() => {
    username = generateRandomId(); 
    password = generateRandomId()+'X#';

    // make a new post on 2nd user.
    cy.newUser(username, password);
    cy.post(postText);
    cy.logout(); 
  });

  // after(() => {
  //   cy.login(true, username, password);
  //   cy.deleteUser(username, password);
  // });

  beforeEach(() => {
    cy.login();
    cy.wait(2000);
    cy.visit(`/${username}`);
    cy.wait(2000);
  });

  afterEach(() => {
    cy.logout();
  })

  it('should alert the user that a post has been commented on', () => {
    // Comment on generated 2nd users post.
    cy.get(commentButton).first().click();
    cy.get(commentInput).first().type(commentText);
    cy.get(postCommentButton).first().click();
    cy.get(commentContent).first().contains(commentText);
    
    // Logout, log into generated user.
    cy.logout();
    cy.login(true, username, password);
  
    // Open their notifications
    cy.get(notificationBell).click();

    // notifications not working on test env. 
  });

})
