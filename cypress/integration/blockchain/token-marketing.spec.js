context('Token Page', () => {
  before(() => {
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (!sessionCookie) {
        return cy.login(true);
      }
    });
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.visit('/token');
  });

  it('should have the ability to trigger Buy Tokens modal', () => {
    const tokensInput = 'm-blockchain--purchase input[name=amount]';
    const buyTokensButton =
      'm-blockchain--purchase .m-blockchainTokenPurchase__action .mf-button';
    const anyBuyTokensModal =
      'm-blockchain--purchase m-modal .m-modal-container';

    cy.get(tokensInput)
      .focus()
      .clear()
      .type('0');
    cy.get(buyTokensButton).should('be.disabled');

    cy.get(tokensInput)
      .focus()
      .clear()
      .type('1');
    cy.get(buyTokensButton)
      .should('not.be.disabled')
      .click();

    cy.contains('Please verify your phone number');
  });

  it('should have the ability to trigger Buy Eth modal', () => {
    const buyEthLink =
      'm-blockchain--purchase .m-blockchainTokenPurchase__ethRate a';
    const buyEthModal = 'm-blockchain__eth-modal .m-modal-container';

    cy.get(buyEthLink).click();

    cy.get(buyEthModal).should('be.visible');
  });
});
