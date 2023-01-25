namespace WalletSteps {
  const { walletPage } = inject();

  When('I navigate via sidebar to the wallet page', async () => {
    await walletPage.navigateToFromSidebar();
    // supermindConsolePage.hasTabSelected('Inbound');
  });

  When('I click the Join Rewards button', async () => {
    await walletPage.clickJoinRewards();
  });
}
