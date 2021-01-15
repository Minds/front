context('Composer Modal', () => {
  before(() => {
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (!sessionCookie) {
        return cy.login(true);
      }
    });
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  const composer = 'm-composer__modal > m-composer__base';
  const composerToolbar = `${composer} .m-composer__toolbar`;

  const composerTrigger = 'm-composer .m-composer__trigger';

  const modalBaseComposer = 'm-composer__modal > m-composer__base';

  const composerTextarea = `${composer} [data-cy="composer-textarea"]`;
  const tagsButton = `${composerToolbar} a[data-cy="tags-button"]`;
  const tagsInput = '.m-hashtagsTypeaheadInput__input';
  const tagsAddButton = '.m-composerTags__tagInput button';
  const saveTagsButton = 'm-button.m-composerPopup__save';


  const toast = 'm-formToast .m-formToast__wrapper p';

  it('should open a composer modal popup in newsfeed', () => {
    cy.visit('/newsfeed/subscriptions');

    cy.get(composerTrigger)
      .should('be.visible')
      .click();

    cy.get(modalBaseComposer).should('be.visible');
  });

  it('should show a \'too many tags\' error if you pick more than 5', () => {
    cy.visit('/newsfeed/subscriptions');

    cy.get(composerTrigger)
      .should('be.visible')
      .click();

    cy.get(tagsButton).click();

    cy.get(tagsInput).type('one');
    cy.get(tagsAddButton).contains('Add').click();

    cy.get(tagsInput).type('two');
    cy.get(tagsAddButton).contains('Add').click();

    cy.get(saveTagsButton).contains('Save Tags').click();

    cy.get(composerTextarea).type('#three #four #five #six');

    cy.get(toast).contains('You may include up to 5 hashtags').should('be.visible');
  });

  it('should open a composer modal popup in discovery', () => {
    cy.visit('/newsfeed/global/top');

    cy.get(composerTrigger)
      .should('be.visible')
      .click();

    cy.get(modalBaseComposer).should('be.visible');
  });

  it('should open a composer modal popup in own channel', () => {
    // cy.visit(`/${Cypress.env().username}`);
    cy.intercept('GET', '**/api/v1/channel/**').as('GETChannel');

    cy.get('.m-sidebarNavigation__list')
      .contains(`${Cypress.env().username}`)
      .click({force: true})
      .wait('@GETChannel')
      .its('response.statusCode')
      .should('eq', 200);

      
    cy.get(composerTrigger)
      .should('be.visible')
      .click();

    cy.get(modalBaseComposer).should('be.visible');
  });

  it('should open a composer modal popup from topbar', () => {
    cy.visit(`/`);

    cy.get('.m-composer__topbarButton')
      .should('be.visible')
      .click();

    cy.get(modalBaseComposer).should('be.visible');
  });
});
