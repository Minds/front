context('Composer Cover Photo Selector', () => {
  before(() => {
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (!sessionCookie) {
        return cy.login(true);
      }
    });
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.overrideFeatureFlags({
      'activity-composer': true,
      navigation: true,
    });
  });

  after(() => {
    cy.overrideFeatureFlags({
      'activity-composer': false,
      navigation: false,
    });
  });

  const composerTrigger = 'm-composer .m-composer__trigger';

  const modalBaseComposer = 'm-composer__modal > m-composer__base';

  it('should upload a video', () => {
    cy.visit('/newsfeed/subscriptions');

    cy.get(composerTrigger)
      .should('be.visible')
      .click();

    cy.get(modalBaseComposer).should('be.visible');

    // SEE https://github.com/cypress-io/cypress/issues/170
    // Currently no support for uploading video files

    // cy.uploadFile(
    //   '[data-cy="upload-button"] input',
    //   '../fixtures/test-video.mp4',
    //   'video/mp4'
    // );
  });

  it('should allow to upload a cover photo for uploading video', () => {
    cy.visit('/newsfeed/subscriptions');

    cy.get(composerTrigger)
      .should('be.visible')
      .click();

    cy.get(modalBaseComposer).should('be.visible');
  });
});
