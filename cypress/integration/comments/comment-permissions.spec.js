// skipped until feat release
context.skip('Comment Permissions', () => {

  const postMenu = 'minds-activity:first > div > m-post-menu';
  const deletePostOption = "m-post-menu > ul > li:visible:contains('Delete')";
  const deletePostButton = ".m-modal-confirm-buttons > button:contains('Delete')";
 

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
  }); 

  afterEach(() => {
    //delete the post
    cy.get(postMenu).click();
    cy.get(deletePostOption).click();
    cy.get(deletePostButton).click();
  });

  beforeEach(()=> {
    cy.preserveCookies();
    cy.post('test post');
  });


  it('should disable comments', () => {
    cy.server();
    cy.route("POST", "**/api/v2/permissions/comments/**").as("commentToggle");
    cy.get(postMenu)
      .click()
      .find("li:visible:contains('Disable Comments')")
      .click();

     cy.wait('@commentToggle').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal("success");
        expect(xhr.response.body.allowed).to.equal(false);
      });

    //close menu
    cy.get(postMenu)
      .click();

    cy.get('minds-activity:first')
      .find("i:contains('speaker_notes_off')")
      .click();
  });

  it('should allow comments', () => {
    cy.server();
    cy.route("POST", "**/api/v2/permissions/comments/**").as("commentToggle");
    cy.get(postMenu)
      .click()
      .find("li:visible:contains('Disable Comments')")
      .click();

     cy.wait('@commentToggle').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal("success");
        expect(xhr.response.body.allowed).to.equal(false);
      });

    //Menu stays open 
    cy.get("li:visible:contains('Allow Comments')")
      .click();

    cy.wait('@commentToggle').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal("success");
        expect(xhr.response.body.allowed).to.equal(true);
      });

    //close menu
    cy.get(postMenu)
      .click();

    cy.get('minds-activity:first')
      .find("i:contains('chat_bubble')");
  });
});
