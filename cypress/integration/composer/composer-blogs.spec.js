context('Composer Blogs Editor', () => {

  const composer = 'm-composer__modal > m-composer__base';
  
  const composerTitleBar = '.m-composer__titleBar';
  
  const blogEditor = 'm-blog__editor';

  const titleInput = '[data-cy=composer-activity-title]';
  
  const uploadButton = 'input[type=file]';

  before(() => {
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (!sessionCookie) {
        return cy.login(true);
      }
    });

    const composerTrigger = 'm-composer .m-composer__trigger';

    cy.get(composerTrigger)
      .should('be.visible')
      .click();

    cy.get(composerTitleBar)
      .should('be.visible');

    cy.contains('Create Blog')
      .click({force: true});
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.server();
    cy.route('POST', '**api/v1/blog/new**').as('postBlog');
  });

  it('should let the user post a basic blog with title, content and banner', () => {
    cy.get(composer).within(($list) => {
      // input title.
      cy.get(titleInput)
        .type("hello");

      // input content.
      cy.get(blogEditor)
        .find('[contenteditable=true]')
        .type('this my my blog content');

      // upload banner.
      cy.uploadFile(
        uploadButton,
        '../fixtures/avatar.jpeg',
        'image/jpg'
      );

      // click post, await success.
      cy.get('[data-cy=post-button]')
        .click()
        .wait('@postBlog')
        .then((xhr) => {
          expect(xhr.status).to.equal(200);
          expect(xhr.response.body.status).to.deep.equal("success");
        });
    });
  });

  it('should allow the blog to be edited again in modal', () => {
    // visit users blogs.
    cy.visit(`/${Cypress.env().username}/blogs`);

    // click first post menu.
    cy.get('[data-cy=data-minds-post-menu-button]')
      .first()
      .click();

    // click the edit option
    cy.get('.minds-dropdown-menu')
      .contains('Edit')
      .click();
    
    // TODO: Verify content is in modal.
  });

  // TODO: Test fullscreen
  // TODO: Test save draft
  // TODO: Delete blog

});
