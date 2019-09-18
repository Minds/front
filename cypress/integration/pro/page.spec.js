/**
 * @author Ben Hayward
 * @desc E2E testing for Minds Pro's pages.
 */
context('Pro Page', () => {

  const topBar = '.m-proChannel__topbar';

  before(() => {
    cy.clearCookies();
    cy.getCookie('minds_sess')
      .then((sessionCookie) => {
        if (sessionCookie === null) {
          return cy.login(true);
        }
      });
    cy.visit(`/pro/${Cypress.env().username}`);
    cy.get(topBar); 
  });

  beforeEach(()=> {
    cy.server();
    cy.preserveCookies();
  });

  it('should load the feed tab', () => {
    cy.route("GET", "**/api/v2/pro/content/*/activities/top**").as("activities");
    cy.contains('Feed')
      .click()
      .wait('@activities').then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
  })

  it('should load the videos tab', () => {
    cy.route("GET", "**/api/v2/pro/content/*/videos/top**").as("videos");
    cy.contains('Videos')
      .click()
      .wait('@videos').then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
  })

  it('should load the images tab', () => {
    cy.route("GET", "**/api/v2/pro/content/*/images/top**").as("images");
    cy.contains('Images')
      .click()
      .wait('@images').then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
  })

  it('should load the articles tab', () => {
    cy.route("GET", "**/api/v2/pro/content/*/blogs/top**").as("blogs");
    cy.contains('Articles')
      .click()
      .wait('@blogs').then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
  })

  it('should load the groups tab', () => {
    cy.route("GET", "**/api/v2/pro/content/*/groups/top**").as("groups");
    cy.contains('Groups')
      .click()
      .wait('@groups').then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
  })
})
