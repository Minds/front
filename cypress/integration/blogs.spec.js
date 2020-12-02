import generateRandomId from '../support/utilities';

context('Blogs', () => {
  const ckeditor = '[data-cy=data-minds-ckeditor-input] div';
  const closeButton = '[data-cy=data-minds-conversation-close]';
  const postText = generateRandomId();
  const titleText = generateRandomId();
  const saveDraftButton = '[data-cy=data-minds-blog-editor-save-draft]';
  const publishButton = '[data-cy=data-minds-blog-editor-publish]';
  const toastWrapper = '[data-cy=data-minds-form-toast-wrapper]';
  const titleInput = '[data-cy=data-minds-blog-title-input]';
  const bannerInput = '[data-cy=data-minds-blog-banner-upload]';
  const captchaSubmitButton = '[data-cy=data-minds-captcha-modal-submit]';
  const tagsToggle = '[data-cy=data-minds-blog-editor-tags-toggle]';
  const metaToggle = '[data-cy=data-minds-blog-editor-meta-toggle]';

  const tagsInput = '.m-hashtagsTypeaheadInput__input';
  const tagsContainer = '.m-composerTags__list';

  const metaSlugInput = '[data-cy=data-minds-meta-slug-input]';
  const metaTitleInput = '[data-cy=data-minds-meta-title-input]';
  const metaAuthorInput = '[data-cy=data-minds-meta-author-input]';
  const metaDescriptionTextarea = '[data-cy=data-minds-meta-description-textarea]';

  const dropdownMenu = '[data-cy=meatball-menu-trigger]';
  const viewPostMenu = '[data-cy=data-minds-post-menu-button]';

  before(() => {
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });

    // ensure no messenger windows are open.
    cy.get('body').then($body => {
      if ($body.find(closeButton).length) {
        cy.get(closeButton).click({ multiple: true });
      }
    });
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.server();
    cy.route('POST', '**/api/v1/blog/**').as('postBlog');
    cy.route('GET', '**/api/v2/captcha**').as('getCaptcha')
  });

  it('should show editor toolbar on text highlight', () => {
    navigateToNewBlog();
    cy.get(ckeditor).type(postText);
    cy.highlightText(postText);
    cy.get('.ck-toolbar__items');
  });

  it('should show block toolbar button with options (+)', () => {
    cy.get('.ck-block-toolbar-button')
      .should('be.visible')
      .click();

    cy.get('.ck-file-dialog-button').should('be.visible');
    cy.get('.ck-dropdown').should('be.visible');
  });

  it('should not be able to create a new blog if no title or banner are specified', () => {
    // no title
    cy.get(publishButton).click();
    cy.get(toastWrapper)
      .contains("You must provide a title");

    // no banner
    cy.get(titleInput).type(titleText);
    cy.get(publishButton).click();
    cy.get(toastWrapper)
      .contains("You must provide a title");

  });

  it('should be able to add banner, tags and metadata', () => {
    cy.uploadFile(
      bannerInput,
      '../fixtures/international-space-station-1776401_1920.jpg',
      'image/jpg'
    );
  });

  it('should let the user add only 5 tags', () => {
    cy.get(tagsToggle).click();

    cy.get(tagsInput).type('tag1\r');
    cy.get(tagsInput).type('tag2\r');
    cy.get(tagsInput).type('tag3\r');
    cy.get(tagsInput).type('tag4\r');
    cy.get(tagsInput).type('tag5\r');

    cy.get(tagsContainer).within($list => {
      cy.contains('#tag1')
      cy.contains('#tag2');
      cy.contains('#tag3');
      cy.contains('#tag4');
      cy.contains('#tag5');

      // remove tag
      cy.get('.m-composerTags__item .m-composerTagsItem__remove')
        .first()
        .click();

      cy.contains('#tag1')
        .should('not.exist');
    });
  });

  it('should allow the user to set metadata', () => {
    cy.contains('Meta').click();
    cy.get(metaSlugInput).type('my-slug');
    cy.get(metaTitleInput).type('meta-title');
    cy.get(metaAuthorInput).type('meta-author');
    cy.get(metaDescriptionTextarea).type('meta-description');
  });

  it('should allow the user to set license', () => {
    cy.get(dropdownMenu).click();
    cy.contains('License').click();
    cy.contains('Creative Commons Attribution').click();

    cy.get(dropdownMenu).click();
    cy.contains('License').click();
    
    cy.contains('Creative Commons Attribution')
      .parent()
      .contains("check");
  });

  it('should allow the user to set nsfw', () => {
    cy.get(dropdownMenu).click();
    cy.contains('NSFW').click();
    cy.contains('Other').click();

    cy.get(dropdownMenu).click();
    cy.contains('NSFW').click();
    
    cy.contains('Other')
      .parent()
      .contains("check");
  });

  it('should allow the user to set visibility', () => {
    cy.get(dropdownMenu).click();
    cy.contains('Visibility').click();
    cy.contains('Loggedin').click();

    cy.get(dropdownMenu).click();
    cy.contains('Visibility').click();
    
    cy.contains('Loggedin')
      .parent()
      .contains("check");
  });

  it('should let the user save a draft', () => {
    saveBlog(true);
    cy.get(toastWrapper).contains("Your draft has been successfully saved")
  });

  it('should be able to publish a new blog', () => {
    saveBlog();
  });


  it('should contain the blogs data after posting', () => {
    cy.contains(titleText);
    cy.contains(postText);
    cy.contains('attribution-cc');

    cy.get('head meta[name="og:title"]')
      .should("have.attr", "content", 'meta-title');
    
    cy.get('head title')
      .contains("meta-title");
    
    cy.get('head meta[name="description"]')
      .should("have.attr", "content", postText);
    
    cy.get('head meta[property="og:image"]')
      .should("have.attr", "content");

    cy.location('href').should('contain', 'my-slug');
  });

  it('should allow the user to edit their blog', () => {
    const editText = '@'+postText+'@';

    cy.get(viewPostMenu).click();
    cy.contains('Edit').click();
    
    cy.get(ckeditor)
      .clear()
      .type(editText);
    
    saveBlog();

    cy.contains(editText);
  });

  const navigateToNewBlog = () => {
    cy.visit('/blog/v2/edit/new')
        .location('pathname')
        .should('eq', '/blog/v2/edit/new');
  }

  const saveBlog = (draft = false) => { 
    const saveButton = draft ? saveDraftButton : publishButton;

    cy.get(saveButton)
      .click({force: true})
      .wait('@getCaptcha');

    cy.completeCaptcha()
      .get(captchaSubmitButton)
      .click()
      .wait('@postBlog').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal("success");
      });
  }
});
