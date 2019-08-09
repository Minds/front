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

  const commentMessages = {
    1: 'test 1',
    2: 'test 2',
    3: 'test 3',
  };

  before(() => {
    username = generateRandomId(); 
    password = generateRandomId()+'X#';

    // make a new post on 2nd user.
    cy.newUser(username, password);
    cy.post(commentMessages[1]);
    cy.logout(); 
  });

  after(() => {
    cy.login(true, username, password);
    cy.deleteUser(username, password);
  });

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

  });

})
