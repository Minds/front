namespace ChannelSteps {
  const { channelPage } = inject();

  When('I am on my channel page', () => {
    channelPage.navigateTo();
  });
}
