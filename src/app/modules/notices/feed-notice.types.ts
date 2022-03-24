// Identifier of a notice.
export type NoticeIdentifier =
  | 'verify-email'
  | 'build-your-algorithm'
  | 'enable-push-notifications';

// positioning of component - where should it show 'top' or feed, or 'inline' in the feed.
export type NoticePosition = 'top' | 'inline';

// object to hold notices and their relevant shared state.
export type Notices = {
  [key in NoticeIdentifier]: {
    shown: boolean;
    completed: boolean;
    dismissed: boolean;
    position: NoticePosition;
  };
};
