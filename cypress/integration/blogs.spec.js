// import 'cypress-file-upload';

context('Blogs', () => {
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
    cy.preserveCookies();
  });

  it('should not be able to create a new blog if no title or banner are specified', () => {
    cy.visit('/blog/edit/new');

    cy.get('.m-button--submit').click();

    cy.get('.m-blog--edit--error').contains('Error: You must provide a title');


    cy.get('minds-textarea .m-editor').type('Title');


    cy.get('.m-button--submit').click();

    cy.get('.m-blog--edit--error').contains('Error: You must upload a banner');
  })

  it('should be able to create a new blog', () => {

    // upload avatar first
    cy.visit(`/${Cypress.env().username}`);

    cy.get('.m-channel--name .minds-button-edit button:first-child').click();

    cy.uploadFile('.minds-avatar input[type=file]', '../fixtures/avatar.jpeg', 'image/jpg');

    cy.get('.m-channel--name .minds-button-edit button:last-child').click();

    // create blog
    cy.visit('/blog/edit/new');

    cy.uploadFile('.minds-banner input[type=file]', '../fixtures/international-space-station-1776401_1920.jpg', 'image/jpg');

    cy.get('minds-textarea .m-editor').type('Title');

    cy.get('m-inline-editor .medium-editor-element').type('Content\n');

    // click on plus button
    // cy.get('.medium-editor-element > .medium-insert-buttons > button.medium-insert-buttons-show').click();
    // click on camera
    // cy.get('ul.medium-insert-buttons-addons > li > button.medium-insert-action:first-child').contains('photo_camera').click();
    // upload the image
    // cy.uploadFile('.medium-media-file-input', '../fixtures/international-space-station-1776401_1920.jpg', 'image/jpg');

    // open license dropdown & select first license
    cy.get('.m-license-info select').select('All rights reserved');

    // click on hashtags dropdown
    cy.get('.m-category-info m-hashtags-selector .m-dropdown--label-container').click();
    // select #ART
    cy.get('.m-category-info m-dropdown m-form-tags-input > div > span').contains('#art').click();
    // type in another hashtag manually
    cy.get('.m-category-info m-hashtags-selector m-form-tags-input input').type('hashtag{enter}').click();

    // click away
    cy.get('.m-category-info m-hashtags-selector .minds-bg-overlay').click();

    // select visibility
    cy.get('.m-visibility-info select').select('Loggedin');

    // open metadata form
    cy.get('.m-blog-edit--toggle-wrapper .m-blog-edit--toggle').contains('Metadata').click();
    // set url slug
    cy.get('.m-blog-edit--field input[name=slug]').type('123');
    // set meta title
    cy.get('.m-blog-edit--field input[name=custom_meta_title]').type('Test');
    // set meta description
    cy.get('.m-blog-edit--field textarea[name=custom_meta_description]').type('This is a test blog');
    // set meta author
    cy.get('.m-blog-edit--field input[name=custom_meta_author]').type('Minds Test');

    // set as nsfw
    cy.get('.m-mature-info a').click();
    cy.get('.m-mature-info a span').contains('Mature content');

    cy.server();
    cy.route("POST", "**/api/v1/blog/new").as("postBlog");
    cy.route("GET", "**/api/v1/blog/**").as("getBlog");

    cy.get('.m-button--submit').click({ force: true }); // TODO: Investigate why disabled flag is being detected

    cy.wait('@postBlog').then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.equal("success");
    });

    cy.wait('@getBlog').then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.equal("success");
      expect(xhr.response.body).to.have.property("blog");
    });

    cy.location('pathname')
      .should('contains', `/${Cypress.env().username}/blog`);

    cy.get('.m-blog--title').contains('Title');
    cy.get('.minds-blog-body p').contains('Content');

    cy.get('.m-license-info span').contains('all-rights-reserved');

    // cleanup

    //open dropdown
    cy.get('m-post-menu button.minds-more').click();
    cy.get('m-post-menu ul.minds-dropdown-menu li').contains('Delete').click();
    cy.get('m-post-menu m-modal-confirm .mdl-button--colored').click();

  })
})
