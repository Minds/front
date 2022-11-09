import { Storage } from '../helpers/storage';
import { ChannelPage } from '../pages/channelPage';
import { NewsfeedPage } from '../pages/newsfeedPage';
import { FeedNoticeKey } from '../types/feednotice.types';

namespace ActivityFeedSteps {
  const newsfeedPage = new NewsfeedPage();
  const channelPage = new ChannelPage();
  const storage: Storage = Storage.getInstance();

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

  Given(
    'I see the feed notice for {string}',
    (feedNoticeKey: FeedNoticeKey) => {
      newsfeedPage.hasFeedNotice(feedNoticeKey);
    }
  );

  Given('I click the feed notice primary action', () => {
    newsfeedPage.clickFeedNoticePrimaryAction();
  });
}
