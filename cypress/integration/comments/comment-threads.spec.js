import generateRandomId from '../../support/utilities';

/**
 * @author Ben Hayward
 * @create date 2019-08-09 14:42:51
 * @modify date 2019-08-09 14:42:51
 * @desc Spec tests for comment threads.
 */
context.only('Comment Threads', () => {
  const testUsername = generateRandomId();
  const testPassword = generateRandomId() + 'rR.7';
  const postText = generateRandomId();

  const testMessage = {
    1: 'test tier 1',
    2: 'test tier 2',
    3: 'test tier 3',
  };

  const postMenu = 'm-post-menu > button > i';
  const deletePostOption = "m-post-menu > ul > li:visible:contains('Delete')";
  const deletePostButton =
    ".m-modal-confirm-buttons > button:contains('Delete')";

  const postCommentButton =
    'm-comment__poster > div > div.minds-body > div > div > a.m-post-button';

  // pass in tier / tree depth.
  const replyButton = `.m-comment__toolbar > div > span`;
  const commentButton = `minds-button-comment`;
  const commentInput = `m-text-input--autocomplete-container > minds-textarea > div`;
  const commentContent = `m-comments__tree .m-comment__bubble > p`;

  const thumbsUpCounters = '[data-cy=data-minds-thumbs-up-counter]'; //'minds-button-thumbs-up > a > span';
  const thumbsDownCounters = '[data-cy=data-minds-thumbs-down-counter]';

  const thumbsUpButton = '[data-cy=data-minds-thumbs-up-button]';
  const thumbsDownButton = '[data-cy=data-minds-thumbs-down-button]';

  before(() => {
    //make a post new.
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });

    // This test makes use of cy.post()
    cy.overrideFeatureFlags({ 'activity-composer': true });

    cy.visit('/newsfeed/subscriptions');
    cy.location('pathname').should('eq', `/newsfeed/subscriptions`);

    cy.post(postText);
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.server();
    cy.route('GET', '**/api/v2/comments/**').as('commentsOpen');
    cy.route('POST', '**/api/v1/comments/**').as('postComment');
    cy.route('PUT', '**/api/v1/thumbs/**').as('thumbsPut');
  });

  it('should post three tiers of comments', () => {
    //Reveal the conversation
    cy.contains(postText)
      .parentsUntil('m-activity')
      .parent()
      .within($list => {

        cy.get(commentButton).click();

        //Add the first level of comments
        cy.get(commentInput).type(testMessage[1]);

        cy.get(postCommentButton)
          .click()
          .wait('@postComment')
          .then(xhr => {
            expect(xhr.status).to.equal(200);
          });

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
          .click()
          .wait('@postComment')
          .then(xhr => {
            expect(xhr.status).to.equal(200);
          });

        cy.get(commentContent).contains(testMessage[2]);

        //Add the third level of comments
        cy.get('m-comments__tree m-comments__thread m-comment')
          .find(
            'm-comments__thread m-comment:nth-child(2) .m-comment__toolbar > div > span'
          )
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
          .click()
          .wait('@postComment')
          .then(xhr => {
            expect(xhr.status).to.equal(200);
          });

        cy.get(commentContent).contains(testMessage[3]);

        // Waiting on component init here.
        // If still not fully loaded will not break,
        // but may mean some of the buttons aren't tested.
        cy.wait(1000);

        // scope further get requests down to within the comments toolbar
        // avoids clicking thumbs in activity feed.
        cy.get('.m-comment__toolbar').within($list => {
          // thumbs up and down
          cy.get(thumbsUpButton).each(button => {
            cy.wrap(button)
              .click()
              .wait('@thumbsPut')
              .then(xhr => {
                expect(xhr.status).to.equal(200);
              });
          });

          // thumbs up and down
          cy.get(thumbsDownButton).each(button => {
            cy.wrap(button)
              .click()
              .wait('@thumbsPut')
              .then(xhr => {
                expect(xhr.status).to.equal(200);
              });
          });

          // check counters
          cy.get(thumbsUpCounters).each(counter => {
            expect(counter[0].innerHTML).to.eql('1');
          });

          cy.get(thumbsDownCounters).each(counter => {
            expect(counter[0].innerHTML).to.eql('1');
          });
        });
      });
  });

  it('should allow the user to make a mature comment', () => {
    cy.contains(postText)
      .parentsUntil('m-activity')
      .parent()
      .within($list => {

        // type message
        cy.get('minds-textarea div')
          .last()
          .type('naughty message');

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
        cy.get('.m-comment__bubble')
          .parent()
          .within($list => {
            cy.contains('naughty message').should(
              'not.have.class',
              'm-mature-text'
            );

            cy.get('.m-redButton').click();

            cy.contains('naughty message')//.should('have.class', 'm-mature-text');
          });

        // get share link
        cy.get('.m-postMenu__button')
          .click();

        cy.contains('Share')
          .click();

      });

      cy.get('.m-share__copyableLinkText')
        .invoke('val')
        .then(val => {
          // log out
          cy.logout();

          // visit link
          cy.visit(val);

          // assert toggle works.
          cy.contains('naughty message').should('have.class', 'm-mature-text');

          cy.get('.m-mature-text-toggle').click();

          cy.contains('naughty message').should(
            'not.have.class',
            'm-mature-text'
          );
        });
    });

  it('should paginate correctly', () => {
    cy.login();
    cy.visit('/newsfeed/subscriptions');
    cy.location('pathname')
      .should('eq', `/newsfeed/subscriptions`);

    cy.post('test pagination');
    cy.contains('test pagination')
      .parentsUntil('m-activity')
      .parent()
      .within($list => {

        // //Reveal the conversation
        // cy.get(commentButton).click();

        // make 41 comments
        for (let i = 0; i < 41; i++) {
          cy.get(commentInput).type(`comment n°${i}`);

          cy.get(postCommentButton)
            .click()
            .wait('@postComment')
            .then(xhr => {
              expect(xhr.status).to.equal(200);
            });
        }

        // go to single entity view
        cy.get('.m-activityOwnerBlock__permalink').click();
      });

      cy.get('.m-comments-load-more').click();
      cy.wait(500);
      cy.get('.m-comments-load-more').click();
      cy.wait(500);
      cy.get('.m-comments-load-more').click();
      cy.wait(500);

      // let num = 0;
      // cy.get('.m-commentBubble__message').each(($el) => {
      //   expect($el.text()).to.contain(num);
      //   num++;
      // });

    // expect(num).to.equal(41);
  });


});
