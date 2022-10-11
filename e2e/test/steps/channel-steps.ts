import { ChannelPage } from '../pages/channelPage';

namespace ChannelSteps {
  const channelPage = new ChannelPage();

  When('I am on my channel page', () => {
    channelPage.navigateTo();
  });
}
