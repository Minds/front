/**
 * @author Ben Hayward
 * @desc Spec tests for comment threads.
 */
import generateRandomId from '../support/utilities';

// Skipped until notifications are fixed on sandboxes
// See https://gitlab.com/minds/engine/issues/732

context.skip('Notification', () => {

  //secondary user for testing.
  let username = '';
  let password = '';

  const commentText = 'test comment';
  const postText = 'test comment'
  const postCommentButton = 'm-comment__poster > div > div.minds-body > div > div > a.m-post-button';
  const commentButton = 'minds-activity > div.tabs > minds-button-comment > a'; 
  const commentInput = 'm-comment__poster minds-textarea > div';
  const commentContent ='.m-comment__bubble > p';
  const notificationBell = 'm-notifications--topbar-toggle > a > i';

  /**
   * Before all, generate username and password, login as the new user and log out.
   * Next login to env user, make a post, and log out.
   */
  before(() => {
    username = generateRandomId(); 
    password = generateRandomId()+'X#';

    cy.newUser(username, password);
    cy.logout();
  
    cy.login();
    cy.post(postText);
    cy.clearCookies();
  });

  /**
   * After all log into new user and delete user.
   */
  after(() => {
    cy.clearCookies();
    cy.login(true, username, password);
    cy.deleteUser(username, password);
  });

  /**
   * Before each test login, and visit env users channel.
   * When testing, this means you will be ready to make a comment, remind etc,
   * then switch users and check for the notification.
   */
  beforeEach(() => {
    cy.clearCookies();
    cy.login(false, username, password);
    
    cy.location('pathname')
      .should('eq', '/newsfeed/subscriptions');
    
    cy.visit(`/${Cypress.env().username}`);
  });

  it('should alert the user that a post has been commented on', () => {
    // Comment on generated 2nd users post.
    cy.get(commentButton).first().click();
    cy.get(commentInput).first().type(commentText);
    cy.get(postCommentButton).first().click();
    cy.get(commentContent).first().contains(commentText);
    
    // Logout, log into generated user.
    cy.logout();
    cy.login();
  
    // Open their notifications
    cy.get(notificationBell).click();    

    /**
     * Notifications not working on test env. 
     * TODO: Check for notification - follow it 
     * through and check it leads to the post with postText.
     */
  });

})
