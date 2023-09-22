/**
 * Views available from a group's page
 */
export type GroupView =
  | 'feed' // a.k.a. 'discussion'
  | 'members'
  | 'review';

/**
 * Filters available to apply to a group's feed
 */
export type GroupFeedFilter =
  | 'activities' // e.g. show everything
  | 'images'
  | 'videos';

export const DEFAULT_GROUP_VIEW: GroupView = 'feed';
export const DEFAULT_GROUP_FEED_FILTER: GroupFeedFilter = 'activities';

/**
 * Tabs in the group moderator console
 */
export type GroupReviewView = 'feed' | 'requests';

/**
 * Is the group public or private?
 */
export enum GroupAccessType {
  PRIVATE = 0,
  // UNKNOWN = 1,
  PUBLIC = 2,
}

export enum GroupMembershipLevel {
  // The user has been banned from the group
  BANNED = -1,

  // The user has requested to join the group, but is not currently a member
  REQUESTED = 0,

  // A regular member
  MEMBER = 1,

  // A moderator, can approve posts etc
  MODERATOR = 2,

  // The group owner (admin)
  OWNER = 3,
}

///////////////////////////////////////////////////////

export type GroupMembershipGetParams = {
  limit?: number;
  offset?: number;
  q?: string;
  membership_level?: GroupMembershipLevel;
  membership_level_gte?: boolean;
};

export type GroupMembershipGetResponse = {
  status: string;
  members?: any[];
  total?: number;
  'load-next'?: number;
};

export type GroupInvitePutParams = {
  guid: string;
};

export type GroupInvitePutResponse = {
  done: boolean;
  status: string;
  error?: string;
};
