/**
 * Push notifications
 */

// push notification group.
export type PushNotificationGroup =
  | 'votes'
  | 'tags'
  | 'subscriptions'
  | 'comments'
  | 'reminds'
  | 'boosts'
  | 'tokens'
  | 'all';

// response type.
export type PushNotificationGetResponse = {
  status: string;
  settings?: PushNotificationSetting[];
};

// individual setting.
export type PushNotificationSetting = {
  notification_group: string;
  enabled: boolean;
};

/**
 * Email notifications
 */

// email notification campaign.
export type EmailNotificationCampaign = 'global' | 'when' | 'with';

// email notification topic.
export type EmailNotificationTopic =
  | 'exclusive_promotions'
  | 'minds_news'
  | 'minds_tips'
  | 'boost_completed'
  | 'unread_notifications'
  | 'wire_received'
  | 'channel_improvement_tips'
  | 'new_channels'
  | 'posts_missed_since_login'
  | 'top_posts';

// individual setting.
export type EmailNotificationSetting = {
  campaign: EmailNotificationCampaign;
  topic: EmailNotificationTopic;
  user_guid: string;
  value: string;
  guid: string;
};

// response type.
export type EmailNotificationGetResponse = {
  status: string;
  email?: string;
  notifications?: EmailNotificationSetting[];
};
