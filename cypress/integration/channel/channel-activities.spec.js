/**
 * Skipping until sandbox behaves consistently as currently when posting,
 * on the sandboxes it does not show your latest image after you have posted it.
 * The below code should be functioning correctly once this is resolved.
 */ 
context.skip('Channel image upload', () => {
  before(() => {
    cy.getCookie('minds_sess')
    .then((sessionCookie) => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });

    cy.visit('/newsfeed/subscriptions')
      .location('pathname')
      .should('eq', '/newsfeed/subscriptions');
  });
  beforeEach(()=> {
    cy.preserveCookies();
    cy.server();
    cy.route("POST", "**/api/v1/newsfeed").as("newsfeedPOST");
    cy.route("POST", "**/api/v1/media").as("mediaPOST");  
  });

  it('should post an activity with an image attachment', () => {
    cy.get('minds-newsfeed-poster').should('be.visible');

    cy.get('minds-newsfeed-poster textarea').type('This is a post with an image');

    cy.uploadFile('#attachment-input-poster', '../fixtures/international-space-station-1776401_1920.jpg', 'image/jpg');

    //upload image
    cy.wait('@mediaPOST');

    cy.get('.m-posterActionBar__PostButton').click();  

    //await response for activity
    cy.wait('@newsfeedPOST').then((xhr) => {
      expect(xhr.status).to.equal(200);
      const uploadedImageGuid = xhr.response.body.activity.entity_guid
      const activityGuid = xhr.response.body.guid;
      
    
      cy.get('.minds-list > minds-activity:first-child .message').contains('This is a post with an image');

      // assert image
      cy.get('.minds-list > minds-activity:first-child  .item-image img').should('be.visible');
 
      cy.visit(`/${Cypress.env().username}`);

      let mediaHref = `/media/${uploadedImageGuid}`;
      cy.get("m-channels--sorted-module[title='Images']")
        .find(`a[href='${mediaHref}']`);

      cy.get(`[data-minds-activity-guid='${activityGuid}']`)
        .find('m-post-menu .minds-more')
        .click();

      cy.get(`[data-minds-activity-guid='${activityGuid}']`)
        .find("li:contains('Delete')")
        .click();
  
      cy.get(`[data-minds-activity-guid='${activityGuid}'] m-post-menu m-modal-confirm .mdl-button--colored`).click();   
    });
  
  });

});
