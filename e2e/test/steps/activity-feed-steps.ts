import { Storage } from '../helpers/storage';
import { ChannelPage } from '../pages/channelPage';
import { NewsfeedPage } from '../pages/newsfeedPage';

namespace ActivityFeedSteps {
  const newsfeedPage = new NewsfeedPage();
  const channelPage = new ChannelPage();
  const storage: Storage = Storage.getInstance();

  When(
    'I navigate to the single page of the post in position {number} of the {string} feed',
    async (feedPosition: number, feedType: string) => {
      switch (feedType) {
        case 'newsfeed':
          newsfeedPage.navigateToSinglePageOfActivityInPosition(feedPosition);
          break;
        case 'channel':
          channelPage.navigateToSinglePageOfActivityInPosition(feedPosition);
          break;
      }
    }
  );

  When(
    'I delete post on my {string} stored with storage key {string}',
    async (feedType: string, textStorageKey: string) => {
      const text: string = storage.get(textStorageKey);
      switch (feedType) {
        case 'newsfeed':
          newsfeedPage.hasActivityWithText(text);
          await newsfeedPage.deleteActivityByText(text);
          break;
        case 'channel':
          channelPage.hasActivityWithText(text);
          await channelPage.deleteActivityByText(text);
          break;
      }
    }
  );

  Then(
    'I should not see a post on my {string} with text for storage key {string}',
    (feedType: string, textStorageKey: string) => {
      const text: string = storage.get(textStorageKey);
      switch (feedType) {
        case 'newsfeed':
          newsfeedPage.hasNoActivityWithText(text);
          break;
        case 'channel':
          channelPage.hasNoActivityWithText(text);
          break;
      }
    }
  );
}
