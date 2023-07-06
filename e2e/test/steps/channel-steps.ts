namespace ChannelSteps {
  const { channelPage } = inject();

  Given('I click the Create your first post button', () => {
    channelPage.clickCreateYourFirstPostButton();
  });

  When('I am on my channel page', () => {
    channelPage.navigateTo();
  });
}
