/**
 * @author Ben Hayward
 * @desc Spec tests for comment threads.
 */
import generateRandomId from '../support/utilities';

context('Notification', () => {
  //secondary user for testing.
  const username = generateRandomId();
  const password = generateRandomId() + 'X#';

  const commentText = generateRandomId();
  const postText = generateRandomId();
  const postCommentButton =
    'm-comment__poster > div > div.minds-body > div > div > a.m-post-button';
  const commentButton = 'minds-activity > div.tabs > minds-button-comment > a';
  const commentInput = 'm-comment__poster minds-textarea > div';
  const commentContent = '.m-comment__bubble > p';
  const notificationBell = 'm-notifications--topbar-toggle > a > i';
  const notification = 'minds-notification';
  /**
   * Before all, generate username and password, login as the new user and log out.
   * Next login to env user, make a post, and log out.
   */
  before(() => {
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (!sessionCookie) {
        return cy.login(true);
      }
    });
  });

  after(() => {
    cy.clearCookies();
  });

  beforeEach(() => {
    cy.server();
    cy.route('GET', '**/api/v1/notifications/all**').as('notifications');
    cy.location('pathname').should('eq', '/newsfeed/subscriptions');
  });

  it('should close notifications flyout when clicking a notification', () => {
    cy.get(notificationBell)
      .click()
      .wait('@notifications');

    cy.get(notification).within($list => {
      cy.get('a')
        .first()
        .click();   
    });

    cy.get(notification).should('not.be.visible');

  });

  it.skip('should alert the user that a post has been commented on', () => {
    // Comment on generated 2nd users post.
    cy.get(commentButton)
      .first()
      .click();
    cy.get(commentInput)
      .first()
      .type(commentText);
    cy.get(postCommentButton)
      .first()
      .click();
    cy.get(commentContent)
      .first()
      .contains(commentText);

    // Logout, log into generated user.
    cy.logout();
    cy.login();

    // Open their notifications
    cy.get(notificationBell)
      .click()
      .wait('@notifications')
      .then(xhr => {
        expect(xhr.status).to.equal(200);
      });

    cy.get(notification)
      .first()
      .click();

    cy.contains(commentText);
  });
});
