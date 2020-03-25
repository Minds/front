context('Upgrades page', () => {
  before(() => {
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (!sessionCookie) {
        return cy.login(true);
      }
    });
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.visit('/upgrades');
  });

  it('should scroll to upgrades table', () => {
    cy.viewport(1200, 600); // Only on desktop

    const scrollButton = '[data-cy="m-upgrades__upgrade-now-button"]';
    const heading = '.m-upgradesUpgradeOptions__header h2';

    cy.get(scrollButton)
      .should('contain', 'Upgrade now')
      .click();

    cy.wait(1500);
    cy.isInViewport(heading);
  });

  // TODO: Toggles tests (make them testable)

  it('should have the ability to trigger Buy Tokens modal', () => {
    cy.server();
    cy.route("GET", '**api/v2/blockchain/purchase**').as("purchaseGET");

    const tokensInput = 'm-blockchain--purchase input[name=amount]';
    const buyTokensButton =
      'm-blockchain--purchase .m-blockchainTokenPurchase__action .mf-button';
    const anyBuyTokensModal =
      'm-blockchain--purchase m-modal .m-modal-container';

    cy.get(tokensInput)
      .focus()
      .clear()
      .type('0');
    cy.get(buyTokensButton).should('be.visible');

    cy.get(tokensInput)
      .focus()
      .clear()
      .type('1');

    cy.get(buyTokensButton)
      .should('not.be.disabled')
      .click({force: true})
      .wait('@purchaseGET').then((xhr) => {
        expect(xhr.status).to.equal(200);
      });

    // alternative to waiting
    cy.contains("Setup Your OnChain Address to buy, send and receive crypto")

    cy.get('.m-get-metamask--cancel-btn').should('not.be.disabled').click();
    
    cy.get(anyBuyTokensModal).should('be.visible');
  });

  it('should have the ability to trigger Buy Eth modal', () => {
    const buyEthLink =
      'm-blockchain--purchase .m-blockchainTokenPurchase__ethRate a';
    const buyEthModal = 'm-blockchain__eth-modal .m-modal-container';

    cy.get(buyEthLink).click();

    cy.get(buyEthModal).should('be.visible');
  });

  it('should navigate to Plus and trigger a Wire', () => {
    const upgradeButton = cy.get(
      '[data-cy="m-upgradeOptions__upgrade-to-plus-button"]'
    );

    upgradeButton.click();

    cy.location('pathname').should('contain', '/plus');
  });

  it('should navigate to Pro and trigger a Wire', () => {
    const upgradeButton = cy.get(
      '[data-cy="m-upgradeOptions__upgrade-to-pro-button"]'
    );

    upgradeButton.click();

    cy.location('pathname').should('contain', '/pro');
  });

  it('should navigate to Nodes', () => {
    const upgradeButton = cy.get(
      '[data-cy="m-upgradeOptions__contact-us-nodes-button"]'
    );

    upgradeButton.click();

    cy.location('pathname').should('contain', '/nodes');
  });
});
