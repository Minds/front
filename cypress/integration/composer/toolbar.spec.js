context('Composer Bottom Bar', () => {
  before(() => {
    // This test makes use of cy.post()
    cy.overrideFeatureFlags({ 'activity-composer': true });
    // cy.getCookie('minds_sess').then(sessionCookie => {
    //   if (!sessionCookie) {
    //     return
    cy.login(true);
    //   }
    // });
  });

  beforeEach(() => {
    cy.overrideFeatureFlags({ 'activity-composer': true });
    cy.preserveCookies();
  });

  // Components

  const composer = 'm-composer__modal > m-composer__base';

  const composerToolbar = `${composer} .m-composer__toolbar`;

  const composerTextarea = `${composer} [data-cy="composer-textarea"]`;

  // Buttons

  const uploadButton = `${composerToolbar} m-file-upload[data-cy="upload-button"]`;

  const nsfwButton = `${composerToolbar} a[data-cy="nsfw-button"]`;

  const monetizeButton = `${composerToolbar} a[data-cy="monetize-button"]`;

  const tagsButton = `${composerToolbar} a[data-cy="tags-button"]`;

  const postButton = `${composerToolbar} m-button[data-cy="post-button"]`;

  const postButtonDropdownAction = `${postButton} [data-cy="button-dropdown-action"]`;

  const postButtonDropdownMenu = `${postButton} .m-dropdownMenu__menu`;

  //

  const showComposer = () => {
    const composerTrigger = 'm-composer .m-composer__trigger';

    cy.overrideFeatureFlags({ 'activity-composer': true });
    cy.visit('/newsfeed/subscriptions');

    cy.get(composerTrigger)
      .should('be.visible')
      .click();

    cy.get(composerToolbar).should('be.visible');
  };

  context('General', () => {
    before(() => {
      showComposer();
    });

    it('should show a disabled post button', () => {
      cy.get(composerTextarea).clear();

      cy.get(postButton)
        .should('be.visible')
        .should('have.class', 'm-button--disabled');
    });

    it('should show an enabled post button', () => {
      cy.get(composerTextarea)
        .clear()
        .type('Hello Minds!');

      cy.get(postButton)
        .should('be.visible')
        .should('not.have.class', 'm-button--disabled');

      cy.get(composerTextarea).clear();
    });
  });

  context('Desktop', () => {
    before(() => {
      showComposer();
    });

    beforeEach(() => {
      // Wide enough to ensure toolbar labels
      cy.viewport(1920, 1080);
    });

    it('should show upload button', () => {
      cy.get(uploadButton).should('be.visible');

      // TODO: Check we're showing the label, input[type=file] overlay causes a false negative
    });

    it('should show NSFW button and its label', () => {
      cy.get(nsfwButton).should('be.visible');

      cy.get(`${nsfwButton} .m-composerToolbarItem__label`).should(
        'be.visible'
      );
    });

    it('should show monetize button and its label', () => {
      cy.get(monetizeButton).should('be.visible');

      cy.get(`${monetizeButton} .m-composerToolbarItem__label`).should(
        'be.visible'
      );
    });

    it('should show tags button and its label', () => {
      cy.get(tagsButton).should('be.visible');

      cy.get(`${tagsButton} .m-composerToolbarItem__label`).should(
        'be.visible'
      );
    });

    it('should show a post button', () => {
      cy.get(postButton).should('be.visible');
    });

    it('should show a dropdown in the post button', () => {
      cy.get(composerTextarea)
        .clear()
        .type('Hello Minds!');

      cy.get(postButtonDropdownMenu).should('not.be.visible');

      cy.get(postButtonDropdownAction)
        .should('be.visible')
        .click();

      cy.get(postButtonDropdownMenu).should('be.visible');

      cy.get(`${postButton} m-overlay`).click();

      cy.get(postButtonDropdownMenu).should('not.be.visible');
    });
  });

  context('Mobile', () => {
    before(() => {
      showComposer();
    });

    beforeEach(() => {
      cy.viewport(360, 760);
    });

    it('should show upload button', () => {
      cy.get(uploadButton).should('be.visible');

      // TODO: Check we're not showing the label, input[type=file] overlay causes a false positive
    });

    it('should show NSFW button without its label', () => {
      cy.get(nsfwButton).should('be.visible');

      cy.get(`${nsfwButton} .m-composerToolbarItem__label`).should(
        'not.be.visible'
      );
    });

    it('should show monetize button without its label', () => {
      cy.get(monetizeButton).should('be.visible');

      cy.get(`${monetizeButton} .m-composerToolbarItem__label`).should(
        'not.be.visible'
      );
    });

    it('should show tags button without its label', () => {
      cy.get(tagsButton).should('be.visible');

      cy.get(`${tagsButton} .m-composerToolbarItem__label`).should(
        'not.be.visible'
      );
    });

    it('should show a post button', () => {
      cy.get(postButton).should('be.visible');
    });

    it('should open a menu in the post button dropdown', () => {
      cy.get(composerTextarea)
        .clear()
        .type('Hello Minds!');

      cy.get(postButtonDropdownMenu).should('not.be.visible');

      cy.get(postButtonDropdownAction)
        .should('be.visible')
        .click();

      cy.get(postButtonDropdownMenu).should('be.visible');

      cy.get(`${postButton} m-overlay`).click({ force: true });

      cy.get(postButtonDropdownMenu).should('not.be.visible');
    });
  });
});
