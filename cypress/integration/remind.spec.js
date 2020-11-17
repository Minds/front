import { composer } from '../support/commands';
import generateRandomId from '../support/utilities';

context('Remind', () => {
  const remindText = 'remind test text';
  const textArea = '.m-modal__remindComposer m-text-input--autocomplete-container textarea';
  const sendButton = '.m-modalRemindComposer__send';
  const userMenu = 'm-usermenu__v3';

  before(() => {
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });
    cy.visit(`/${Cypress.env().username}`);
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.server();
    cy.route('POST', '**/api/v2/newsfeed').as('newsfeedPOST');
    cy.route('GET', '**/api/v1/channel/**').as('getChannel');
    cy.route('DELETE', '**/api/v3/newsfeed/**').as('newsfeedDELETE');
  });

  const newActivityContent = content => {
    // open composer
    cy.openComposer();

    // type in text area
    cy.get(composer.messageTextArea)
      .clear()
      .type(content);

    cy.get(composer.postButton)
      .click()
      .wait('@newsfeedPOST');
  };

  it('should allow a user to remind their post', () => {
    // Make a new post
    newActivityContent('Post we will remind');

    //open remind button options
    cy.get('m-activity__remindButton')
      .first()
      .click();

    // post the remind
    cy.get('m-activity__remindButton ul > li:first')
      .click()
      .wait('@newsfeedPOST')
      .then(xhr => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal('success');
      });
  });

  /**
   * NOTE: the below test is not ideal as it relies on a successful test above
   */
  it('should remove a remind we make', () => {
    cy.get('m-activity__remindButton')
    .first()
    .click();

    // delete the remind
    cy.get('m-activity__remindButton ul > li:first')
      .click()
      .wait('@newsfeedDELETE')
      .then(xhr => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal('success');
      });
  });

  it('should allow a user to quote post their post', () => {
    // Make a new post
    newActivityContent('Post we will quote post');

    //open remind button options
    cy.get('m-activity__remindButton')
      .first()
      .click();

    // post the remind
    cy.get('m-activity__remindButton ul > li')
      .eq(1) //2nd in the list is quote post
      .click();

    const myQuoteIs = 'This is my my quote that I will use ' + generateRandomId();

    cy.get(composer.messageTextArea)
      .clear()
      .type(myQuoteIs);

    cy.get(composer.postButton)
      .click()
      .wait('@newsfeedPOST')
      .then(xhr => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal('success');
      });

      cy.get('m-activity')
        .first()
        .contains(myQuoteIs);
  });
});
