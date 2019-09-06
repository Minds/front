context('Remind', () => {

  const remindText = 'remind test text';

  before(() => {
    cy.getCookie('minds_sess')
    .then((sessionCookie) => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });
    cy.visit(`/${Cypress.env().username}`);
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it('should allow a user to remind their post', () => {
    cy.server();
    cy.route("POST", "**/api/v2/newsfeed/remind/*").as("postRemind");
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
    
    cy.wait('@postRemind').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal("success");
      });
  });
});
