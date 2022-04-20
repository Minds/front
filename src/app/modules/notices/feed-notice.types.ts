// Identifier of a notice.
export type NoticeIdentifier =
  | 'verify-email'
  | 'build-your-algorithm'
  | 'enable-push-notifications';

// Positioning of component - where should it show 'top' or feed, or 'inline' in the feed.
export type NoticePosition = 'top' | 'inline';

// Object to hold notices and their relevant shared state.
export type Notices = {
  [key in NoticeIdentifier]: {
    shown: boolean;
    completed: boolean;
    dismissed: boolean;
    position: NoticePosition;
  };
};

// Local storage structures.
export type FeedNoticeStorageItem = {
  [key in NoticeIdentifier]: {
    timestamp_ms: number;
  };
};

export type FeedNoticeStorageArray = FeedNoticeStorageItem[];
