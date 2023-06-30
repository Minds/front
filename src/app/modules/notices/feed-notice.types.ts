// Identifier of a notice.
export type NoticeKey =
  | 'verify-email'
  | 'supermind-pending'
  | 'setup-channel'
  | 'verify-uniqueness'
  | 'connect-wallet'
  | 'build-your-algorithm'
  | 'enable-push-notifications'
  | 'update-tags'
  | 'plus-upgrade'
  | 'boost-channel'
  | 'invite-friends'
  | 'boost-latest-post'
  | 'no-groups';

// Location of component - where should it show 'top' or feed, or 'inline' in the feed.
export type NoticeLocation = 'top' | 'inline';

// Object to hold notices and their relevant shared state.
export type FeedNotice = {
  key: NoticeKey;
  location: NoticeLocation;
  should_show: boolean;
  dismissed: boolean;
  position?: number;
} | null;

// Local storage structures.
export type FeedNoticeStorageItem = {
  [key in NoticeKey]: {
    timestamp_ms: number;
  };
};

export type FeedNoticeStorageArray = FeedNoticeStorageItem[];
