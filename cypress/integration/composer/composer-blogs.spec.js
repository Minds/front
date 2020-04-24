context('Composer Blogs Editor', () => {

  const composer = 'm-composer__modal > m-composer__base';
  
  const composerTitleBar = '.m-composer__titleBar';
  
  const composerTrigger = 'm-composer .m-composer__trigger';

  const blogEditor = 'm-blog__editor';

  const titleInput = '[data-cy=composer-activity-title]';

  const uploadButton = 'input[type=file]';

  const meatballMenuTrigger = `[data-cy="meatball-menu-trigger"]`;

  const meatballMenuFullscreen = `[data-cy="meatball-menu-fullscreen"]`;

  before(() => {
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (!sessionCookie) {
        return cy.login(true);
      }
    });
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.server();
    cy.route('POST', '**api/v1/blog/**').as('postBlog');
  
    // nav to channel
    cy.get('.m-v2-topbar__Avatar')
      .dblclick({force: true});

    cy.get(composerTrigger)
      .should('be.visible')
      .click();

    cy.get(composerTitleBar)
      .should('be.visible');

    cy.contains('Create Blog')
      .click({force: true});
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

  it('should let the user post a draft then post', () => {
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

      // click post dropdown.
      cy.get('[data-cy=post-button] .m-dropdownMenu__trigger')
        .click();

      // Save draft.
      cy.contains('Save Draft')
        .click()
        .wait('@postBlog')
        .then((xhr) => {
          expect(xhr.status).to.equal(200);
          expect(xhr.response.body.status).to.deep.equal("success");
        });

      // Checking against a 5000ms timer with buffer of 500ms. 
      cy.contains('Draft Saved')
        .should('exist');
      
      cy.wait(5500);
      
      cy.contains('Draft Saved')
        .should('not.exist');

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

  it('should let the user move to fullscreen', () => {
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
      
      // click for fullscreen
      cy.get(meatballMenuTrigger).click();
      cy.get(meatballMenuFullscreen)
        .click()
        .wait('@postBlog')
        .then((xhr) => {
          expect(xhr.status).to.equal(200);
          expect(xhr.response.body.status).to.deep.equal("success");
        });

      // check location changed
      cy.location('pathname')
        .should('include', '/blog/edit/');
    });

    // check input content.
    cy.contains('this my my blog content');
  });

  /** 
   * TODO: Verify content is in modal. 
   * /pending UX-2020 feat flag as override is failing.
   */
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
  });

});
