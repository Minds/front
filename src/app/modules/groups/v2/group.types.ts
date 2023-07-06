/**
 * Views available from a group's page
 */
export type GroupView =
  | 'feed' // a.k.a. 'discussion'
  | 'members'
  | 'requests'
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
 * Is the group public or private?
 */
export enum GroupAccessType {
  PRIVATE = 0,
  // UNKNOWN = 1,
  PUBLIC = 2,
}
