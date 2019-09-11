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
  });

  beforeEach(()=> {
    cy.server();
    cy.route("GET", "**/api/v2/pro/channel/*/content**").as("content");

    cy.preserveCookies();
    cy.visit(`/pro/${Cypress.env().username}`);
    cy.get(topBar); 
  });

  it('should load the feed tab', () => {
    cy.route("GET", "**/api/v2/feeds/channel/*/activities/top**").as("activities");
    cy.contains('Feed')
      .click()
      .wait('@content').then((xhr) => {
        expect(xhr.status).to.equal(200);
      })
      .wait('@activities').then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
  })

  it('should load the videos tab', () => {
    cy.route("GET", "**/api/v2/feeds/channel/*/videos/top**").as("videos");
    cy.contains('Videos')
      .click()
      .wait('@content').then((xhr) => {
        expect(xhr.status).to.equal(200);
      })
      .wait('@videos').then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
  })

  it('should load the images tab', () => {
    cy.route("GET", "**/api/v2/feeds/channel/*/images/top**").as("images");
    cy.contains('Images')
      .click()
      .wait('@content').then((xhr) => {
        expect(xhr.status).to.equal(200);
      })
      .wait('@images').then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
  })

  it('should load the articles tab', () => {
    cy.route("GET", "**/api/v2/feeds/channel/*/blogs/top**").as("blogs");
    cy.contains('Articles')
      .click()
      .wait('@content').then((xhr) => {
        expect(xhr.status).to.equal(200);
      })
      .wait('@blogs').then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
  })

  it('should load the groups tab', () => {
    cy.route("GET", "**/api/v2/feeds/channel/*/groups/top**").as("groups");
    cy.contains('Groups')
      .click()
      .wait('@content').then((xhr) => {
        expect(xhr.status).to.equal(200);
      })
      .wait('@groups').then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
  })
})
