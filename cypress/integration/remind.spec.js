context('Remind', () => {

  const remindText = 'remind test text';

  beforeEach(() => {
    cy.login(true);

    cy.location('pathname', { timeout: 30000 })
      .should('eq', `/newsfeed/subscriptions`);

    //nav to channel
    cy.get('.m-v2-topbar__Top minds-avatar div')
      .click();
  });

  it('should allow a user to remind their post', () => {
    
    //post
    cy.post("test!!");

    //open remind composer
    cy.get('minds-button-remind > a')
      .first()
      .click();
    
    //fill out text box in modal
    cy.get('.m-modal-remind-composer  textarea')
      .type(remindText);
    
    //post remind.
    cy.get('.m-modal-remind-composer-send i')
      .click();

    softReload();

    cy.wait(1000);

    //expect to contain text
    cy.get('m-newsfeed__entity:nth-child(3) span')
      .contains(remindText);
  })

  it('should allow a user to delete their remind', () => {

    // make sure top post has the reminded text.
    cy.get('m-newsfeed__entity:nth-child(3) .m-activity--message-remind span')
      .contains(remindText);

    //open menu.
    cy.get('m-newsfeed__entity:nth-child(3)  m-post-menu > button > i')
      .click();
    
    //select delete.
    cy.get('m-newsfeed__entity:nth-child(3) m-post-menu ul li:nth-child(4)')
      .click();
    
    //delete confirm.
    cy.get('m-newsfeed__entity:nth-child(3) m-modal-confirm div:nth-child(1) button.mdl-button.mdl-color-text--white.mdl-button--colored.mdl-button--raised')
      .click();
  
    cy.wait(2000);
    //check the post is gone.
    cy.get('m-newsfeed__entity:nth-child(3) .m-activity--message-remind span')
      .should('not.have.value', remindText)
  });

  /**
   * Cycles by pressing home screen then back to channel
   */
  function softReload() {
    cy.wait(6000); //wait to let requests finish.

    cy.get('.m-v2-topbarNavItem__Logo > img')
      .click();

    cy.get('.m-v2-topbar__Top minds-avatar div')
      .click();
    
    cy.wait(1000); //wait to let requests finish.

  }

})
