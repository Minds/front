/**
 * @author Ben Hayward
 * @desc Spec tests for comment threads.
 */
import generateRandomId from '../support/utilities';

context('Messenger', () => {
  const targetUser = 'minds';
  const messagePassword = 'Passw0rd!';
  const messageContent = 'this is a test message!';
  const undecryptedMessage = ''
  const testUsername = generateRandomId(); 
  const testPassword = generateRandomId()+'X#';
  
  const openMessenger = '.m-messenger--dockpane-tab';
  const userSearch = '.m-messenger--userlist-search > input[type=text]';
  const userList = (i) => `.m-messenger--userlist-conversations > div:nth-child(${i}) > span.m-conversation-label`;
  const passwordInput = (i) => `input[type=password]:nth-child(${i})`;
  const submitPassword = 'm-messenger--encryption > div > button';
  const messageInput = '.m-messenger--conversation-composer > textarea';
  const sendButton = '[data-cy=data-minds-conversation-send]';
  const messageBubble = '.m-messenger--conversation-message-bubble';

  const settingsButton = '[data-cy=data-minds-conversation-options]';
  const closeButton = '[data-cy=data-minds-conversation-close]';

  const destroyButton = '[data-cy=data-minds-conversation-destroy]';

  before(() => {
    cy.newUser(testUsername, testPassword);
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.server();
    cy.route('GET', '**/api/v2/messenger/search?*').as('search');
    cy.route('GET', '**/api/v2/messenger/conversations/**').as('conversations');
    cy.route('POST', '**/api/v2/messenger/conversations/**').as('send');
    cy.route('POST', '**/api/v2/messenger/keys/setup**').as('keys')
  
    cy.get(openMessenger)
      .click();
  });

  afterEach(() => {
    cy.get(closeButton)
      .click({multiple: true});
    
    cy.get(openMessenger)
      .click({multiple: true});
  });

  after(() => {
    cy.deleteUser(testUsername, testPassword);
    cy.clearCookies({log: true})
  });

  it('should allow a new user to set a password and send a message', () => {
    cy.get(userSearch)
      .type(Cypress.env().username)
      .wait('@search').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal("success");
      });

    cy.get(userList(1))
      .click();
    
    cy.get(passwordInput(3))
      .type(messagePassword)

    cy.get(passwordInput(4))
      .type(messagePassword)

    cy.get(submitPassword)
      .click();

    cy.get(messageInput)
      .type(messageContent);

    cy.get(sendButton)
      .click()
      .wait('@send').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal("success");
      });
  });

  it('should allow a user to destroy their chat content', () => {
    cy.get(userSearch)
      .clear()
      .type(Cypress.env().username)
      .wait('@search').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal("success");
      });

    cy.get(userList(1))
      .click();

    cy.get(passwordInput(3))
      .type(messagePassword)

    cy.get(passwordInput(4))
      .type(messagePassword)

    cy.get(submitPassword)
      .click()
      .wait('@keys').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal("success");
      })
      .wait('@conversations').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal("success");
      });

    cy.get(settingsButton)
      .click();
    
    cy.get(destroyButton)
      .first()
      .click();

    cy.get(messageBubble)
      .should('not.exist');
  });
});
