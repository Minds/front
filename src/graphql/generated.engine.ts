import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** The `DateTime` scalar type represents time data, represented as an ISO-8601 encoded UTC date string. */
  DateTime: { input: any; output: any };
  /** The `Void` scalar type represents no value being returned. */
  Void: { input: any; output: any };
};

export type ActivityEdge = EdgeInterface & {
  __typename?: 'ActivityEdge';
  cursor: Scalars['String']['output'];
  explicitVotes: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  node: ActivityNode;
  type: Scalars['String']['output'];
};

export type ActivityNode = NodeInterface & {
  __typename?: 'ActivityNode';
  /** Relevant for images/video posts. A blurhash to be used for preloading the image. */
  blurhash?: Maybe<Scalars['String']['output']>;
  commentsCount: Scalars['Int']['output'];
  guid: Scalars['String']['output'];
  hasVotedDown: Scalars['Boolean']['output'];
  hasVotedUp: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  impressionsCount: Scalars['Int']['output'];
  /** The activity has comments enabled */
  isCommentingEnabled: Scalars['Boolean']['output'];
  legacy: Scalars['String']['output'];
  message: Scalars['String']['output'];
  nsfw: Array<Scalars['Int']['output']>;
  nsfwLock: Array<Scalars['Int']['output']>;
  owner: UserNode;
  ownerGuid: Scalars['String']['output'];
  /** Unix timestamp representation of time created */
  timeCreated: Scalars['Int']['output'];
  /** ISO 8601 timestamp representation of time created */
  timeCreatedISO8601: Scalars['String']['output'];
  /** Relevant for images/video posts */
  title?: Maybe<Scalars['String']['output']>;
  urn: Scalars['String']['output'];
  votesDownCount: Scalars['Int']['output'];
  votesUpCount: Scalars['Int']['output'];
};

export type AddOn = {
  __typename?: 'AddOn';
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  inBasket: Scalars['Boolean']['output'];
  monthlyFeeCents?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  oneTimeFeeCents?: Maybe<Scalars['Int']['output']>;
  perks?: Maybe<Array<Scalars['String']['output']>>;
  perksTitle: Scalars['String']['output'];
};

export type AddOnSummary = {
  __typename?: 'AddOnSummary';
  id: Scalars['String']['output'];
  monthlyFeeCents?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  oneTimeFeeCents?: Maybe<Scalars['Int']['output']>;
};

export type AnalyticsChartBucketType = {
  __typename?: 'AnalyticsChartBucketType';
  date: Scalars['String']['output'];
  key: Scalars['String']['output'];
  value: Scalars['Int']['output'];
};

export type AnalyticsChartSegmentType = {
  __typename?: 'AnalyticsChartSegmentType';
  buckets: Array<AnalyticsChartBucketType>;
  label: Scalars['String']['output'];
};

export type AnalyticsChartType = {
  __typename?: 'AnalyticsChartType';
  metric: AnalyticsMetricEnum;
  segments: Array<AnalyticsChartSegmentType>;
};

export type AnalyticsKpiType = {
  __typename?: 'AnalyticsKpiType';
  metric: AnalyticsMetricEnum;
  previousPeriodValue: Scalars['Int']['output'];
  value: Scalars['Int']['output'];
};

export enum AnalyticsMetricEnum {
  DailyActiveUsers = 'DAILY_ACTIVE_USERS',
  MeanSessionSecs = 'MEAN_SESSION_SECS',
  NewUsers = 'NEW_USERS',
  TotalSiteMembershipSubscriptions = 'TOTAL_SITE_MEMBERSHIP_SUBSCRIPTIONS',
  TotalUsers = 'TOTAL_USERS',
  Visitors = 'VISITORS',
}

export type AnalyticsTableConnection = ConnectionInterface & {
  __typename?: 'AnalyticsTableConnection';
  edges: Array<AnalyticsTableRowEdge>;
  pageInfo: PageInfo;
  table: AnalyticsTableEnum;
};

export enum AnalyticsTableEnum {
  PopularActivities = 'POPULAR_ACTIVITIES',
  PopularGroups = 'POPULAR_GROUPS',
  PopularUsers = 'POPULAR_USERS',
}

export type AnalyticsTableRowActivityNode = AnalyticsTableRowNodeInterface &
  NodeInterface & {
    __typename?: 'AnalyticsTableRowActivityNode';
    activity: ActivityNode;
    engagements: Scalars['Int']['output'];
    id: Scalars['ID']['output'];
    views: Scalars['Int']['output'];
  };

export type AnalyticsTableRowEdge = EdgeInterface & {
  __typename?: 'AnalyticsTableRowEdge';
  cursor: Scalars['String']['output'];
  node: NodeInterface;
};

export type AnalyticsTableRowGroupNode = AnalyticsTableRowNodeInterface &
  NodeInterface & {
    __typename?: 'AnalyticsTableRowGroupNode';
    group: GroupNode;
    id: Scalars['ID']['output'];
    newMembers: Scalars['Int']['output'];
  };

export type AnalyticsTableRowNodeImpl = AnalyticsTableRowNodeInterface & {
  __typename?: 'AnalyticsTableRowNodeImpl';
  id: Scalars['ID']['output'];
};

export type AnalyticsTableRowNodeInterface = {
  id: Scalars['ID']['output'];
};

export type AnalyticsTableRowUserNode = AnalyticsTableRowNodeInterface &
  NodeInterface & {
    __typename?: 'AnalyticsTableRowUserNode';
    id: Scalars['ID']['output'];
    newSubscribers: Scalars['Int']['output'];
    totalSubscribers: Scalars['Int']['output'];
    user: UserNode;
  };

export enum ApiScopeEnum {
  All = 'ALL',
  SiteMembershipWrite = 'SITE_MEMBERSHIP_WRITE',
  TenantCreateTrial = 'TENANT_CREATE_TRIAL',
}

export type AppReadyMobileConfig = {
  __typename?: 'AppReadyMobileConfig';
  ACCENT_COLOR_DARK: Scalars['String']['output'];
  ACCENT_COLOR_LIGHT: Scalars['String']['output'];
  API_URL: Scalars['String']['output'];
  APP_ANDROID_PACKAGE?: Maybe<Scalars['String']['output']>;
  APP_HOST: Scalars['String']['output'];
  APP_IOS_BUNDLE?: Maybe<Scalars['String']['output']>;
  APP_NAME: Scalars['String']['output'];
  APP_SCHEME?: Maybe<Scalars['String']['output']>;
  APP_SLUG?: Maybe<Scalars['String']['output']>;
  APP_SPLASH_RESIZE: Scalars['String']['output'];
  APP_TRACKING_MESSAGE?: Maybe<Scalars['String']['output']>;
  APP_TRACKING_MESSAGE_ENABLED?: Maybe<Scalars['Boolean']['output']>;
  EAS_PROJECT_ID?: Maybe<Scalars['String']['output']>;
  IS_NON_PROFIT?: Maybe<Scalars['Boolean']['output']>;
  TENANT_ID: Scalars['Int']['output'];
  THEME: Scalars['String']['output'];
  WELCOME_LOGO: Scalars['String']['output'];
  assets: Array<KeyValueType>;
};

export type AssetConnection = ConnectionInterface & {
  __typename?: 'AssetConnection';
  edges: Array<EdgeInterface>;
  pageInfo: PageInfo;
};

export type AttachmentNode = {
  __typename?: 'AttachmentNode';
  containerGuid: Scalars['String']['output'];
  guid: Scalars['String']['output'];
  height?: Maybe<Scalars['Int']['output']>;
  href?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  mature?: Maybe<Scalars['Boolean']['output']>;
  src?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  width?: Maybe<Scalars['Int']['output']>;
};

export type BoostEdge = EdgeInterface & {
  __typename?: 'BoostEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: BoostNode;
  type: Scalars['String']['output'];
};

export type BoostNode = NodeInterface & {
  __typename?: 'BoostNode';
  activity: ActivityNode;
  goalButtonText?: Maybe<Scalars['Int']['output']>;
  goalButtonUrl?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  legacy: Scalars['String']['output'];
};

export type BoostsConnection = ConnectionInterface & {
  __typename?: 'BoostsConnection';
  /** Gets Boost edges in connection. */
  edges: Array<BoostEdge>;
  pageInfo: PageInfo;
};

export type ChatMessageEdge = EdgeInterface & {
  __typename?: 'ChatMessageEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: ChatMessageNode;
};

export type ChatMessageNode = NodeInterface & {
  __typename?: 'ChatMessageNode';
  /** The unique guid of the message */
  guid: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The type of message. */
  messageType: ChatMessageTypeEnum;
  /** The plaintext (non-encrypted) message */
  plainText: Scalars['String']['output'];
  /** Rich embed node belonging to the message. */
  richEmbed?: Maybe<ChatRichEmbedNode>;
  /** The guid of the room the message belongs to */
  roomGuid: Scalars['String']['output'];
  sender: UserEdge;
  /** The timestamp the message was sent at */
  timeCreatedISO8601: Scalars['String']['output'];
  /** The timestamp the message was sent at */
  timeCreatedUnix: Scalars['String']['output'];
};

export enum ChatMessageTypeEnum {
  Audio = 'AUDIO',
  Image = 'IMAGE',
  RichEmbed = 'RICH_EMBED',
  Text = 'TEXT',
  Video = 'VIDEO',
}

export type ChatMessagesConnection = ConnectionInterface & {
  __typename?: 'ChatMessagesConnection';
  edges: Array<ChatMessageEdge>;
  pageInfo: PageInfo;
};

export type ChatRichEmbedNode = NodeInterface & {
  __typename?: 'ChatRichEmbedNode';
  /** The author of the rich embed. */
  author?: Maybe<Scalars['String']['output']>;
  /** The canonical URL of the rich embed. */
  canonicalUrl: Scalars['String']['output'];
  /** The created timestamp of the rich embed in ISO 8601 format. */
  createdTimestampISO8601?: Maybe<Scalars['String']['output']>;
  /** The created timestamp of the rich embed in Unix format. */
  createdTimestampUnix?: Maybe<Scalars['String']['output']>;
  /** The description of the rich embed. */
  description?: Maybe<Scalars['String']['output']>;
  /** The unique ID of the rich embed for GraphQL. */
  id: Scalars['ID']['output'];
  /** The thumbnail src of the rich embed. */
  thumbnailSrc?: Maybe<Scalars['String']['output']>;
  /** The title of the rich embed. */
  title?: Maybe<Scalars['String']['output']>;
  /** The updated timestamp of the rich embed in ISO 8601 format. */
  updatedTimestampISO8601?: Maybe<Scalars['String']['output']>;
  /** The updated timestamp of the rich embed in Unix format. */
  updatedTimestampUnix?: Maybe<Scalars['String']['output']>;
  /** The URL of the rich embed. */
  url: Scalars['String']['output'];
};

export type ChatRoomEdge = EdgeInterface & {
  __typename?: 'ChatRoomEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastMessageCreatedTimestamp?: Maybe<Scalars['Int']['output']>;
  lastMessagePlainText?: Maybe<Scalars['String']['output']>;
  members: ChatRoomMembersConnection;
  messages: ChatMessagesConnection;
  node: ChatRoomNode;
  totalMembers: Scalars['Int']['output'];
  unreadMessagesCount: Scalars['Int']['output'];
};

export type ChatRoomEdgeMembersArgs = {
  after?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type ChatRoomEdgeMessagesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export enum ChatRoomInviteRequestActionEnum {
  Accept = 'ACCEPT',
  Reject = 'REJECT',
  RejectAndBlock = 'REJECT_AND_BLOCK',
}

export type ChatRoomMemberEdge = EdgeInterface & {
  __typename?: 'ChatRoomMemberEdge';
  cursor: Scalars['String']['output'];
  node: UserNode;
  role: ChatRoomRoleEnum;
  /** The timestamp the message was sent at */
  timeJoinedISO8601: Scalars['String']['output'];
  /** The timestamp the message was sent at */
  timeJoinedUnix: Scalars['String']['output'];
};

export type ChatRoomMembersConnection = ConnectionInterface & {
  __typename?: 'ChatRoomMembersConnection';
  edges: Array<ChatRoomMemberEdge>;
  pageInfo: PageInfo;
};

export type ChatRoomNode = NodeInterface & {
  __typename?: 'ChatRoomNode';
  chatRoomNotificationStatus?: Maybe<ChatRoomNotificationStatusEnum>;
  /** Gets group GUID for a chat room node. */
  groupGuid?: Maybe<Scalars['String']['output']>;
  /** The unique guid of the room */
  guid: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isChatRequest: Scalars['Boolean']['output'];
  isUserRoomOwner?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  /** The type of room. i.e. one-to-one, multi-user, or group-owned */
  roomType: ChatRoomTypeEnum;
  /** The timestamp the room was created at */
  timeCreatedISO8601: Scalars['String']['output'];
  /** The timestamp the roomt was created at */
  timeCreatedUnix: Scalars['String']['output'];
};

export enum ChatRoomNotificationStatusEnum {
  All = 'ALL',
  Mentions = 'MENTIONS',
  Muted = 'MUTED',
}

export enum ChatRoomRoleEnum {
  Member = 'MEMBER',
  Owner = 'OWNER',
}

export enum ChatRoomTypeEnum {
  GroupOwned = 'GROUP_OWNED',
  MultiUser = 'MULTI_USER',
  OneToOne = 'ONE_TO_ONE',
}

export type ChatRoomsConnection = ConnectionInterface & {
  __typename?: 'ChatRoomsConnection';
  edges: Array<ChatRoomEdge>;
  pageInfo: PageInfo;
};

export type CheckoutPage = {
  __typename?: 'CheckoutPage';
  addOns: Array<AddOn>;
  description?: Maybe<Scalars['String']['output']>;
  id: CheckoutPageKeyEnum;
  plan: Plan;
  summary: Summary;
  termsMarkdown?: Maybe<Scalars['String']['output']>;
  timePeriod: CheckoutTimePeriodEnum;
  title: Scalars['String']['output'];
  totalAnnualSavingsCents: Scalars['Int']['output'];
};

export enum CheckoutPageKeyEnum {
  Addons = 'ADDONS',
  Confirmation = 'CONFIRMATION',
}

export enum CheckoutTimePeriodEnum {
  Monthly = 'MONTHLY',
  Yearly = 'YEARLY',
}

export type CommentEdge = EdgeInterface & {
  __typename?: 'CommentEdge';
  cursor: Scalars['String']['output'];
  hasVotedDown: Scalars['Boolean']['output'];
  hasVotedUp: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  node: CommentNode;
  repliesCount: Scalars['Int']['output'];
  type: Scalars['String']['output'];
  votesUpCount: Scalars['Int']['output'];
};

export type CommentNode = NodeInterface & {
  __typename?: 'CommentNode';
  /** Gets a comments linked AttachmentNode. */
  attachment?: Maybe<AttachmentNode>;
  body: Scalars['String']['output'];
  childPath: Scalars['String']['output'];
  guid: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  legacy: Scalars['String']['output'];
  /** Still used for votes, to be removed soon */
  luid: Scalars['String']['output'];
  nsfw: Array<Scalars['Int']['output']>;
  nsfwLock: Array<Scalars['Int']['output']>;
  owner: UserNode;
  parentPath: Scalars['String']['output'];
  /** Unix timestamp representation of time created */
  timeCreated: Scalars['Int']['output'];
  /** ISO 8601 timestamp representation of time created */
  timeCreatedISO8601: Scalars['String']['output'];
  url: Scalars['String']['output'];
  urn: Scalars['String']['output'];
};

export type Connection = ConnectionInterface & {
  __typename?: 'Connection';
  edges: Array<EdgeInterface>;
  pageInfo: PageInfo;
};

export type ConnectionInterface = {
  edges: Array<EdgeInterface>;
  pageInfo: PageInfo;
};

export enum CustomHostnameStatusEnum {
  Active = 'ACTIVE',
  ActiveRedeploying = 'ACTIVE_REDEPLOYING',
  Blocked = 'BLOCKED',
  Deleted = 'DELETED',
  Moved = 'MOVED',
  Pending = 'PENDING',
  PendingBlocked = 'PENDING_BLOCKED',
  PendingDeletion = 'PENDING_DELETION',
  PendingMigration = 'PENDING_MIGRATION',
  PendingProvisioned = 'PENDING_PROVISIONED',
  Provisioned = 'PROVISIONED',
  TestActive = 'TEST_ACTIVE',
  TestActiveApex = 'TEST_ACTIVE_APEX',
  TestBlocked = 'TEST_BLOCKED',
  TestFailed = 'TEST_FAILED',
  TestPending = 'TEST_PENDING',
}

export type CustomPage = NodeInterface & {
  __typename?: 'CustomPage';
  content?: Maybe<Scalars['String']['output']>;
  defaultContent?: Maybe<Scalars['String']['output']>;
  externalLink?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  pageType: CustomPageTypesEnum;
};

export enum CustomPageTypesEnum {
  CommunityGuidelines = 'COMMUNITY_GUIDELINES',
  PrivacyPolicy = 'PRIVACY_POLICY',
  TermsOfService = 'TERMS_OF_SERVICE',
}

export type Dismissal = {
  __typename?: 'Dismissal';
  dismissalTimestamp: Scalars['Int']['output'];
  key: Scalars['String']['output'];
  userGuid: Scalars['String']['output'];
};

export enum DnsRecordEnum {
  A = 'A',
  Cname = 'CNAME',
  Txt = 'TXT',
}

export type EdgeImpl = EdgeInterface & {
  __typename?: 'EdgeImpl';
  cursor: Scalars['String']['output'];
  node?: Maybe<NodeInterface>;
};

export type EdgeInterface = {
  cursor: Scalars['String']['output'];
  node?: Maybe<NodeInterface>;
};

export type EmbeddedCommentsConnection = ConnectionInterface & {
  __typename?: 'EmbeddedCommentsConnection';
  /** The url of the activity post */
  activityUrl: Scalars['String']['output'];
  edges: Array<CommentEdge>;
  pageInfo: PageInfo;
  /** The number of comments found */
  totalCount: Scalars['Int']['output'];
};

export type EmbeddedCommentsSettings = {
  __typename?: 'EmbeddedCommentsSettings';
  autoImportsEnabled: Scalars['Boolean']['output'];
  domain: Scalars['String']['output'];
  pathRegex: Scalars['String']['output'];
  userGuid: Scalars['Int']['output'];
};

export type FeaturedEntity = FeaturedEntityInterface &
  NodeInterface & {
    __typename?: 'FeaturedEntity';
    autoPostSubscription: Scalars['Boolean']['output'];
    autoSubscribe: Scalars['Boolean']['output'];
    entityGuid: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    /** Gets entity name. */
    name: Scalars['String']['output'];
    recommended: Scalars['Boolean']['output'];
    tenantId: Scalars['String']['output'];
  };

export type FeaturedEntityConnection = ConnectionInterface &
  NodeInterface & {
    __typename?: 'FeaturedEntityConnection';
    /** Gets connections edges. */
    edges: Array<FeaturedEntityEdge>;
    /** ID for GraphQL. */
    id: Scalars['ID']['output'];
    pageInfo: PageInfo;
  };

export type FeaturedEntityEdge = EdgeInterface & {
  __typename?: 'FeaturedEntityEdge';
  /** Gets cursor for GraphQL. */
  cursor: Scalars['String']['output'];
  /** Gets ID for GraphQL. */
  id: Scalars['ID']['output'];
  /** Gets node - can be either a FeaturedUser or FeaturedGroup. */
  node: NodeInterface;
  /** Gets type for GraphQL. */
  type: Scalars['String']['output'];
};

export type FeaturedEntityInput = {
  autoPostSubscription?: InputMaybe<Scalars['Boolean']['input']>;
  autoSubscribe?: InputMaybe<Scalars['Boolean']['input']>;
  entityGuid: Scalars['String']['input'];
  recommended?: InputMaybe<Scalars['Boolean']['input']>;
};

export type FeaturedEntityInterface = {
  autoPostSubscription: Scalars['Boolean']['output'];
  autoSubscribe: Scalars['Boolean']['output'];
  entityGuid: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Gets entity name. */
  name: Scalars['String']['output'];
  recommended: Scalars['Boolean']['output'];
  tenantId: Scalars['String']['output'];
};

export enum FeaturedEntityTypeEnum {
  Group = 'GROUP',
  User = 'USER',
}

export type FeaturedGroup = FeaturedEntityInterface &
  NodeInterface & {
    __typename?: 'FeaturedGroup';
    autoPostSubscription: Scalars['Boolean']['output'];
    autoSubscribe: Scalars['Boolean']['output'];
    briefDescription?: Maybe<Scalars['String']['output']>;
    entityGuid: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    /** Gets count of members. */
    membersCount: Scalars['Int']['output'];
    /** Gets group name. */
    name: Scalars['String']['output'];
    recommended: Scalars['Boolean']['output'];
    tenantId: Scalars['String']['output'];
  };

export type FeaturedUser = FeaturedEntityInterface &
  NodeInterface & {
    __typename?: 'FeaturedUser';
    autoPostSubscription: Scalars['Boolean']['output'];
    autoSubscribe: Scalars['Boolean']['output'];
    entityGuid: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    /** Gets user's display name, or username. */
    name: Scalars['String']['output'];
    recommended: Scalars['Boolean']['output'];
    tenantId: Scalars['String']['output'];
    username?: Maybe<Scalars['String']['output']>;
  };

export type FeedExploreTagEdge = EdgeInterface & {
  __typename?: 'FeedExploreTagEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: FeedExploreTagNode;
  type: Scalars['String']['output'];
};

export type FeedExploreTagNode = NodeInterface & {
  __typename?: 'FeedExploreTagNode';
  id: Scalars['ID']['output'];
  tag: Scalars['String']['output'];
};

export type FeedHeaderEdge = EdgeInterface & {
  __typename?: 'FeedHeaderEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: FeedHeaderNode;
  type: Scalars['String']['output'];
};

export type FeedHeaderNode = NodeInterface & {
  __typename?: 'FeedHeaderNode';
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
};

export type FeedHighlightsConnection = ConnectionInterface &
  NodeInterface & {
    __typename?: 'FeedHighlightsConnection';
    /** Explicitly will only return activity edges */
    edges: Array<ActivityEdge>;
    id: Scalars['ID']['output'];
    pageInfo: PageInfo;
  };

export type FeedHighlightsEdge = EdgeInterface & {
  __typename?: 'FeedHighlightsEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: FeedHighlightsConnection;
  type: Scalars['String']['output'];
};

export type FeedNoticeEdge = EdgeInterface & {
  __typename?: 'FeedNoticeEdge';
  cursor: Scalars['String']['output'];
  node: FeedNoticeNode;
  type: Scalars['String']['output'];
};

export type FeedNoticeNode = NodeInterface & {
  __typename?: 'FeedNoticeNode';
  /** Whether the notice is dismissible */
  dismissible: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  /** The key of the notice that the client should render */
  key: Scalars['String']['output'];
  /** The location in the feed this notice should be displayed. top or inline. */
  location: Scalars['String']['output'];
};

export type GiftCardBalanceByProductId = {
  __typename?: 'GiftCardBalanceByProductId';
  balance: Scalars['Float']['output'];
  /** Returns the earliest expiring gift that contributes to this balance. */
  earliestExpiringGiftCard?: Maybe<GiftCardNode>;
  productId: GiftCardProductIdEnum;
};

export type GiftCardEdge = EdgeInterface & {
  __typename?: 'GiftCardEdge';
  cursor: Scalars['String']['output'];
  node: GiftCardNode;
};

export type GiftCardNode = NodeInterface & {
  __typename?: 'GiftCardNode';
  amount: Scalars['Float']['output'];
  balance: Scalars['Float']['output'];
  claimedAt?: Maybe<Scalars['Int']['output']>;
  claimedByGuid?: Maybe<Scalars['String']['output']>;
  expiresAt: Scalars['Int']['output'];
  guid?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  issuedAt: Scalars['Int']['output'];
  issuedByGuid?: Maybe<Scalars['String']['output']>;
  /** Username of the gift card issuer */
  issuedByUsername?: Maybe<Scalars['String']['output']>;
  productId: GiftCardProductIdEnum;
  /**
   * Returns transactions relating to the gift card
   * TODO: Find a way to make this not part of the data model
   */
  transactions: GiftCardTransactionsConnection;
};

export type GiftCardNodeTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export enum GiftCardOrderingEnum {
  CreatedAsc = 'CREATED_ASC',
  CreatedDesc = 'CREATED_DESC',
  ExpiringAsc = 'EXPIRING_ASC',
  ExpiringDesc = 'EXPIRING_DESC',
}

export enum GiftCardProductIdEnum {
  Boost = 'BOOST',
  Plus = 'PLUS',
  Pro = 'PRO',
  Supermind = 'SUPERMIND',
}

export enum GiftCardStatusFilterEnum {
  Active = 'ACTIVE',
  Expired = 'EXPIRED',
}

export type GiftCardTargetInput = {
  targetEmail?: InputMaybe<Scalars['String']['input']>;
  targetUserGuid?: InputMaybe<Scalars['String']['input']>;
  targetUsername?: InputMaybe<Scalars['String']['input']>;
};

export type GiftCardTransaction = NodeInterface & {
  __typename?: 'GiftCardTransaction';
  amount: Scalars['Float']['output'];
  boostGuid?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Int']['output'];
  giftCardGuid?: Maybe<Scalars['String']['output']>;
  giftCardIssuerGuid?: Maybe<Scalars['String']['output']>;
  giftCardIssuerName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  paymentGuid?: Maybe<Scalars['String']['output']>;
  refundedAt?: Maybe<Scalars['Int']['output']>;
};

export type GiftCardTransactionEdge = EdgeInterface & {
  __typename?: 'GiftCardTransactionEdge';
  cursor: Scalars['String']['output'];
  node: GiftCardTransaction;
};

export type GiftCardTransactionsConnection = ConnectionInterface & {
  __typename?: 'GiftCardTransactionsConnection';
  edges: Array<GiftCardTransactionEdge>;
  pageInfo: PageInfo;
};

export type GiftCardsConnection = ConnectionInterface & {
  __typename?: 'GiftCardsConnection';
  edges: Array<GiftCardEdge>;
  pageInfo: PageInfo;
};

export type GroupEdge = EdgeInterface & {
  __typename?: 'GroupEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: GroupNode;
  type: Scalars['String']['output'];
};

export type GroupNode = NodeInterface & {
  __typename?: 'GroupNode';
  guid: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  legacy: Scalars['String']['output'];
  membersCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  nsfw: Array<Scalars['Int']['output']>;
  nsfwLock: Array<Scalars['Int']['output']>;
  /** Unix timestamp representation of time created */
  timeCreated: Scalars['Int']['output'];
  /** ISO 8601 timestamp representation of time created */
  timeCreatedISO8601: Scalars['String']['output'];
  urn: Scalars['String']['output'];
};

export enum IllegalSubReasonEnum {
  AnimalAbuse = 'ANIMAL_ABUSE',
  Extortion = 'EXTORTION',
  Fraud = 'FRAUD',
  MinorsSexualization = 'MINORS_SEXUALIZATION',
  RevengePorn = 'REVENGE_PORN',
  Terrorism = 'TERRORISM',
  Trafficking = 'TRAFFICKING',
}

export type Invite = NodeInterface & {
  __typename?: 'Invite';
  bespokeMessage: Scalars['String']['output'];
  createdTimestamp: Scalars['Int']['output'];
  email: Scalars['String']['output'];
  groups?: Maybe<Array<GroupNode>>;
  id: Scalars['ID']['output'];
  inviteId: Scalars['Int']['output'];
  roles?: Maybe<Array<Role>>;
  sendTimestamp?: Maybe<Scalars['Int']['output']>;
  status: InviteEmailStatusEnum;
};

export type InviteConnection = ConnectionInterface &
  NodeInterface & {
    __typename?: 'InviteConnection';
    edges: Array<InviteEdge>;
    id: Scalars['ID']['output'];
    pageInfo: PageInfo;
  };

export type InviteEdge = EdgeInterface & {
  __typename?: 'InviteEdge';
  cursor: Scalars['String']['output'];
  node?: Maybe<Invite>;
};

export enum InviteEmailStatusEnum {
  Accepted = 'ACCEPTED',
  Cancelled = 'CANCELLED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Sending = 'SENDING',
  Sent = 'SENT',
}

export type KeyValuePairInput = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type KeyValueType = {
  __typename?: 'KeyValueType';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type MobileConfig = {
  __typename?: 'MobileConfig';
  appTrackingMessage?: Maybe<Scalars['String']['output']>;
  appTrackingMessageEnabled?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  previewQRCode: Scalars['String']['output'];
  previewStatus: MobilePreviewStatusEnum;
  splashScreenType: MobileSplashScreenTypeEnum;
  updateTimestamp: Scalars['Int']['output'];
  welcomeScreenLogoType: MobileWelcomeScreenLogoTypeEnum;
};

export enum MobilePreviewStatusEnum {
  Error = 'ERROR',
  NoPreview = 'NO_PREVIEW',
  Pending = 'PENDING',
  Ready = 'READY',
}

export enum MobileSplashScreenTypeEnum {
  Contain = 'CONTAIN',
  Cover = 'COVER',
}

export enum MobileWelcomeScreenLogoTypeEnum {
  Horizontal = 'HORIZONTAL',
  Square = 'SQUARE',
}

export enum MultiTenantColorScheme {
  Dark = 'DARK',
  Light = 'LIGHT',
}

export type MultiTenantConfig = {
  __typename?: 'MultiTenantConfig';
  boostEnabled?: Maybe<Scalars['Boolean']['output']>;
  /** Whether federation can be enabled. */
  canEnableFederation?: Maybe<Scalars['Boolean']['output']>;
  colorScheme?: Maybe<MultiTenantColorScheme>;
  customHomePageDescription?: Maybe<Scalars['String']['output']>;
  customHomePageEnabled?: Maybe<Scalars['Boolean']['output']>;
  digestEmailEnabled?: Maybe<Scalars['Boolean']['output']>;
  federationDisabled?: Maybe<Scalars['Boolean']['output']>;
  isNonProfit?: Maybe<Scalars['Boolean']['output']>;
  lastCacheTimestamp?: Maybe<Scalars['Int']['output']>;
  loggedInLandingPageIdMobile?: Maybe<Scalars['String']['output']>;
  loggedInLandingPageIdWeb?: Maybe<Scalars['String']['output']>;
  nsfwEnabled?: Maybe<Scalars['Boolean']['output']>;
  primaryColor?: Maybe<Scalars['String']['output']>;
  replyEmail?: Maybe<Scalars['String']['output']>;
  siteEmail?: Maybe<Scalars['String']['output']>;
  siteName?: Maybe<Scalars['String']['output']>;
  updatedTimestamp?: Maybe<Scalars['Int']['output']>;
  walledGardenEnabled?: Maybe<Scalars['Boolean']['output']>;
  welcomeEmailEnabled?: Maybe<Scalars['Boolean']['output']>;
};

export type MultiTenantConfigInput = {
  boostEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  colorScheme?: InputMaybe<MultiTenantColorScheme>;
  customHomePageDescription?: InputMaybe<Scalars['String']['input']>;
  customHomePageEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  digestEmailEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  federationDisabled?: InputMaybe<Scalars['Boolean']['input']>;
  isNonProfit?: InputMaybe<Scalars['Boolean']['input']>;
  loggedInLandingPageIdMobile?: InputMaybe<Scalars['String']['input']>;
  loggedInLandingPageIdWeb?: InputMaybe<Scalars['String']['input']>;
  nsfwEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  primaryColor?: InputMaybe<Scalars['String']['input']>;
  replyEmail?: InputMaybe<Scalars['String']['input']>;
  siteEmail?: InputMaybe<Scalars['String']['input']>;
  siteName?: InputMaybe<Scalars['String']['input']>;
  walledGardenEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  welcomeEmailEnabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MultiTenantDomain = {
  __typename?: 'MultiTenantDomain';
  dnsRecord?: Maybe<MultiTenantDomainDnsRecord>;
  domain: Scalars['String']['output'];
  ownershipVerificationDnsRecord?: Maybe<MultiTenantDomainDnsRecord>;
  status: CustomHostnameStatusEnum;
  tenantId: Scalars['Int']['output'];
};

export type MultiTenantDomainDnsRecord = {
  __typename?: 'MultiTenantDomainDnsRecord';
  name: Scalars['String']['output'];
  type: DnsRecordEnum;
  value: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Add members to a chat room. */
  addMembersToChatRoom: Scalars['Boolean']['output'];
  /** Cancel all Boosts on a given entity. */
  adminCancelBoosts: Scalars['Boolean']['output'];
  archiveSiteMembership: Scalars['Boolean']['output'];
  /** Assigns a user to a role */
  assignUserToRole: Role;
  cancelInvite?: Maybe<Scalars['Void']['output']>;
  claimGiftCard: GiftCardNode;
  /** Mark an onboarding step for a user as completed. */
  completeOnboardingStep: OnboardingStepProgressState;
  /** Creates a new message in a chat room */
  createChatMessage: ChatMessageEdge;
  /** Creates a new chat room */
  createChatRoom: ChatRoomEdge;
  /** Creates a comment on a remote url */
  createEmbeddedComment: CommentEdge;
  createGiftCard: GiftCardNode;
  /** Creates a new group chat room. */
  createGroupChatRoom: ChatRoomEdge;
  createMultiTenantDomain: MultiTenantDomain;
  createNetworkRootUser: TenantUser;
  /** Create a new report. */
  createNewReport: Scalars['Boolean']['output'];
  createPersonalApiKey: PersonalApiKey;
  createRssFeed: RssFeed;
  createTenant: Tenant;
  deleteChatMessage: Scalars['Boolean']['output'];
  deleteChatRoom: Scalars['Boolean']['output'];
  deleteChatRoomAndBlockUser: Scalars['Boolean']['output'];
  /** Deletes a navigation item */
  deleteCustomNavigationItem: Scalars['Boolean']['output'];
  /** Delete an entity. */
  deleteEntity: Scalars['Boolean']['output'];
  /** Deletes featured entity. */
  deleteFeaturedEntity: Scalars['Boolean']['output'];
  /** Deletes group chat rooms. */
  deleteGroupChatRooms: Scalars['Boolean']['output'];
  deletePersonalApiKey: Scalars['Boolean']['output'];
  deletePostHogPerson: Scalars['Boolean']['output'];
  /** Dismiss a notice by its key. */
  dismiss: Dismissal;
  invite?: Maybe<Scalars['Void']['output']>;
  leaveChatRoom: Scalars['Boolean']['output'];
  mobileConfig: MobileConfig;
  /** Sets multi-tenant config for the calling tenant. */
  multiTenantConfig: Scalars['Boolean']['output'];
  /** Provide a verdict for a report. */
  provideVerdict: Scalars['Boolean']['output'];
  /** Updates the read receipt of a room */
  readReceipt: ChatRoomEdge;
  refreshRssFeed: RssFeed;
  removeMemberFromChatRoom: Scalars['Boolean']['output'];
  removeRssFeed?: Maybe<Scalars['Void']['output']>;
  replyToRoomInviteRequest: Scalars['Boolean']['output'];
  resendInvite?: Maybe<Scalars['Void']['output']>;
  setCustomPage: Scalars['Boolean']['output'];
  /** Creates a comment on a remote url */
  setEmbeddedCommentsSettings: EmbeddedCommentsSettings;
  /** Sets onboarding state for the currently logged in user. */
  setOnboardingState: OnboardingState;
  /** Set a permission intent. */
  setPermissionIntent?: Maybe<PermissionIntent>;
  /** Sets a permission for that a role has */
  setRolePermission: Role;
  /** Set the stripe keys for the network */
  setStripeKeys: Scalars['Boolean']['output'];
  /** Ban or unban a given user. */
  setUserBanState: Scalars['Boolean']['output'];
  siteMembership: SiteMembership;
  /** Stores featured entity. */
  storeFeaturedEntity: FeaturedEntityInterface;
  /** Create a trial tenant network. */
  tenantTrial: TenantLoginRedirectDetails;
  /** Un-ssigns a user to a role */
  unassignUserFromRole: Scalars['Boolean']['output'];
  updateAccount: Array<Scalars['String']['output']>;
  /** Update chat room name. */
  updateChatRoomName: Scalars['Boolean']['output'];
  /** Updates the order of the navigation items */
  updateCustomNavigationItemsOrder: Array<NavigationItem>;
  updateNotificationSettings: Scalars['Boolean']['output'];
  updatePostSubscription: PostSubscription;
  updateSiteMembership: SiteMembership;
  /** Add or update a navigation item */
  upsertCustomNavigationItem: NavigationItem;
};

export type MutationAddMembersToChatRoomArgs = {
  memberGuids: Array<Scalars['String']['input']>;
  roomGuid: Scalars['String']['input'];
};

export type MutationAdminCancelBoostsArgs = {
  entityGuid: Scalars['String']['input'];
};

export type MutationArchiveSiteMembershipArgs = {
  siteMembershipGuid: Scalars['String']['input'];
};

export type MutationAssignUserToRoleArgs = {
  roleId: Scalars['Int']['input'];
  userGuid: Scalars['String']['input'];
};

export type MutationCancelInviteArgs = {
  inviteId: Scalars['Int']['input'];
};

export type MutationClaimGiftCardArgs = {
  claimCode: Scalars['String']['input'];
};

export type MutationCompleteOnboardingStepArgs = {
  additionalData?: InputMaybe<Array<KeyValuePairInput>>;
  stepKey: Scalars['String']['input'];
  stepType: Scalars['String']['input'];
};

export type MutationCreateChatMessageArgs = {
  plainText: Scalars['String']['input'];
  roomGuid: Scalars['String']['input'];
};

export type MutationCreateChatRoomArgs = {
  groupGuid?: InputMaybe<Scalars['String']['input']>;
  otherMemberGuids?: Array<Scalars['String']['input']>;
  roomType?: InputMaybe<ChatRoomTypeEnum>;
};

export type MutationCreateEmbeddedCommentArgs = {
  body: Scalars['String']['input'];
  ownerGuid: Scalars['String']['input'];
  parentPath: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type MutationCreateGiftCardArgs = {
  amount: Scalars['Float']['input'];
  expiresAt?: InputMaybe<Scalars['Int']['input']>;
  productIdEnum: Scalars['Int']['input'];
  stripePaymentMethodId: Scalars['String']['input'];
  targetInput: GiftCardTargetInput;
};

export type MutationCreateGroupChatRoomArgs = {
  groupGuid: Scalars['String']['input'];
};

export type MutationCreateMultiTenantDomainArgs = {
  hostname: Scalars['String']['input'];
};

export type MutationCreateNetworkRootUserArgs = {
  networkUser?: InputMaybe<TenantUserInput>;
};

export type MutationCreateNewReportArgs = {
  reportInput: ReportInput;
};

export type MutationCreatePersonalApiKeyArgs = {
  expireInDays?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  scopes: Array<ApiScopeEnum>;
};

export type MutationCreateRssFeedArgs = {
  rssFeed: RssFeedInput;
};

export type MutationCreateTenantArgs = {
  tenant?: InputMaybe<TenantInput>;
};

export type MutationDeleteChatMessageArgs = {
  messageGuid: Scalars['String']['input'];
  roomGuid: Scalars['String']['input'];
};

export type MutationDeleteChatRoomArgs = {
  roomGuid: Scalars['String']['input'];
};

export type MutationDeleteChatRoomAndBlockUserArgs = {
  roomGuid: Scalars['String']['input'];
};

export type MutationDeleteCustomNavigationItemArgs = {
  id: Scalars['String']['input'];
};

export type MutationDeleteEntityArgs = {
  subjectUrn: Scalars['String']['input'];
};

export type MutationDeleteFeaturedEntityArgs = {
  entityGuid: Scalars['String']['input'];
};

export type MutationDeleteGroupChatRoomsArgs = {
  groupGuid: Scalars['String']['input'];
};

export type MutationDeletePersonalApiKeyArgs = {
  id: Scalars['String']['input'];
};

export type MutationDismissArgs = {
  key: Scalars['String']['input'];
};

export type MutationInviteArgs = {
  bespokeMessage: Scalars['String']['input'];
  emails: Scalars['String']['input'];
  groups?: InputMaybe<Array<Scalars['String']['input']>>;
  roles?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type MutationLeaveChatRoomArgs = {
  roomGuid: Scalars['String']['input'];
};

export type MutationMobileConfigArgs = {
  appTrackingMessage?: InputMaybe<Scalars['String']['input']>;
  appTrackingMessageEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  mobilePreviewStatus?: InputMaybe<MobilePreviewStatusEnum>;
  mobileSplashScreenType?: InputMaybe<MobileSplashScreenTypeEnum>;
  mobileWelcomeScreenLogoType?: InputMaybe<MobileWelcomeScreenLogoTypeEnum>;
};

export type MutationMultiTenantConfigArgs = {
  multiTenantConfigInput: MultiTenantConfigInput;
};

export type MutationProvideVerdictArgs = {
  verdictInput: VerdictInput;
};

export type MutationReadReceiptArgs = {
  messageGuid: Scalars['String']['input'];
  roomGuid: Scalars['String']['input'];
};

export type MutationRefreshRssFeedArgs = {
  feedId: Scalars['String']['input'];
};

export type MutationRemoveMemberFromChatRoomArgs = {
  memberGuid: Scalars['String']['input'];
  roomGuid: Scalars['String']['input'];
};

export type MutationRemoveRssFeedArgs = {
  feedId: Scalars['String']['input'];
};

export type MutationReplyToRoomInviteRequestArgs = {
  chatRoomInviteRequestActionEnum: ChatRoomInviteRequestActionEnum;
  roomGuid: Scalars['String']['input'];
};

export type MutationResendInviteArgs = {
  inviteId: Scalars['Int']['input'];
};

export type MutationSetCustomPageArgs = {
  content?: InputMaybe<Scalars['String']['input']>;
  externalLink?: InputMaybe<Scalars['String']['input']>;
  pageType: Scalars['String']['input'];
};

export type MutationSetEmbeddedCommentsSettingsArgs = {
  autoImportsEnabled: Scalars['Boolean']['input'];
  domain: Scalars['String']['input'];
  pathRegex: Scalars['String']['input'];
};

export type MutationSetOnboardingStateArgs = {
  completed: Scalars['Boolean']['input'];
};

export type MutationSetPermissionIntentArgs = {
  intentType: PermissionIntentTypeEnum;
  membershipGuid?: InputMaybe<Scalars['String']['input']>;
  permissionId: PermissionsEnum;
};

export type MutationSetRolePermissionArgs = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  permission: PermissionsEnum;
  roleId: Scalars['Int']['input'];
};

export type MutationSetStripeKeysArgs = {
  pubKey: Scalars['String']['input'];
  secKey: Scalars['String']['input'];
};

export type MutationSetUserBanStateArgs = {
  banState: Scalars['Boolean']['input'];
  subjectGuid: Scalars['String']['input'];
};

export type MutationSiteMembershipArgs = {
  siteMembershipInput: SiteMembershipInput;
};

export type MutationStoreFeaturedEntityArgs = {
  featuredEntity: FeaturedEntityInput;
};

export type MutationTenantTrialArgs = {
  tenant?: InputMaybe<TenantInput>;
};

export type MutationUnassignUserFromRoleArgs = {
  roleId: Scalars['Int']['input'];
  userGuid: Scalars['String']['input'];
};

export type MutationUpdateAccountArgs = {
  currentUsername: Scalars['String']['input'];
  newEmail?: InputMaybe<Scalars['String']['input']>;
  newUsername?: InputMaybe<Scalars['String']['input']>;
  resetMFA?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MutationUpdateChatRoomNameArgs = {
  roomGuid: Scalars['String']['input'];
  roomName: Scalars['String']['input'];
};

export type MutationUpdateCustomNavigationItemsOrderArgs = {
  orderedIds: Array<Scalars['String']['input']>;
};

export type MutationUpdateNotificationSettingsArgs = {
  notificationStatus: ChatRoomNotificationStatusEnum;
  roomGuid: Scalars['String']['input'];
};

export type MutationUpdatePostSubscriptionArgs = {
  entityGuid: Scalars['String']['input'];
  frequency: PostSubscriptionFrequencyEnum;
};

export type MutationUpdateSiteMembershipArgs = {
  siteMembershipInput: SiteMembershipUpdateInput;
};

export type MutationUpsertCustomNavigationItemArgs = {
  action?: InputMaybe<NavigationItemActionEnum>;
  iconId: Scalars['String']['input'];
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  type: NavigationItemTypeEnum;
  url?: InputMaybe<Scalars['String']['input']>;
  visible: Scalars['Boolean']['input'];
  visibleMobile: Scalars['Boolean']['input'];
};

export type NavigationItem = {
  __typename?: 'NavigationItem';
  action?: Maybe<NavigationItemActionEnum>;
  iconId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  path?: Maybe<Scalars['String']['output']>;
  type: NavigationItemTypeEnum;
  url?: Maybe<Scalars['String']['output']>;
  visible: Scalars['Boolean']['output'];
  visibleMobile: Scalars['Boolean']['output'];
};

export enum NavigationItemActionEnum {
  ShowSidebarMore = 'SHOW_SIDEBAR_MORE',
}

export enum NavigationItemTypeEnum {
  Core = 'CORE',
  CustomLink = 'CUSTOM_LINK',
}

export type NewsfeedConnection = ConnectionInterface & {
  __typename?: 'NewsfeedConnection';
  edges: Array<EdgeInterface>;
  pageInfo: PageInfo;
};

export type NodeImpl = NodeInterface & {
  __typename?: 'NodeImpl';
  id: Scalars['ID']['output'];
};

export type NodeInterface = {
  id: Scalars['ID']['output'];
};

export enum NsfwSubReasonEnum {
  Nudity = 'NUDITY',
  Pornography = 'PORNOGRAPHY',
  Profanity = 'PROFANITY',
  RaceReligionGender = 'RACE_RELIGION_GENDER',
  ViolenceGore = 'VIOLENCE_GORE',
}

export type OidcProviderPublic = {
  __typename?: 'OidcProviderPublic';
  clientId: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  issuer: Scalars['String']['output'];
  loginUrl: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type OnboardingState = {
  __typename?: 'OnboardingState';
  completedAt?: Maybe<Scalars['Int']['output']>;
  startedAt: Scalars['Int']['output'];
  userGuid?: Maybe<Scalars['String']['output']>;
};

export type OnboardingStepProgressState = {
  __typename?: 'OnboardingStepProgressState';
  completedAt?: Maybe<Scalars['Int']['output']>;
  stepKey: Scalars['String']['output'];
  stepType: Scalars['String']['output'];
  userGuid?: Maybe<Scalars['String']['output']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaymentMethod = {
  __typename?: 'PaymentMethod';
  balance?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type PermissionIntent = {
  __typename?: 'PermissionIntent';
  intentType: PermissionIntentTypeEnum;
  membershipGuid?: Maybe<Scalars['String']['output']>;
  permissionId: PermissionsEnum;
};

export enum PermissionIntentTypeEnum {
  Hide = 'HIDE',
  Upgrade = 'UPGRADE',
  WarningMessage = 'WARNING_MESSAGE',
}

export enum PermissionsEnum {
  CanAssignPermissions = 'CAN_ASSIGN_PERMISSIONS',
  CanBoost = 'CAN_BOOST',
  CanComment = 'CAN_COMMENT',
  CanCreateChatRoom = 'CAN_CREATE_CHAT_ROOM',
  CanCreateGroup = 'CAN_CREATE_GROUP',
  CanCreatePaywall = 'CAN_CREATE_PAYWALL',
  CanCreatePost = 'CAN_CREATE_POST',
  CanInteract = 'CAN_INTERACT',
  CanModerateContent = 'CAN_MODERATE_CONTENT',
  CanUploadChatMedia = 'CAN_UPLOAD_CHAT_MEDIA',
  CanUploadVideo = 'CAN_UPLOAD_VIDEO',
  CanUseRssSync = 'CAN_USE_RSS_SYNC',
}

export type PersonalApiKey = {
  __typename?: 'PersonalApiKey';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  scopes: Array<ApiScopeEnum>;
  /** The 'secret' key that a user will use to authenticate with. Only returned once. */
  secret: Scalars['String']['output'];
  timeCreated: Scalars['DateTime']['output'];
  timeExpires?: Maybe<Scalars['DateTime']['output']>;
};

export type Plan = {
  __typename?: 'Plan';
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  monthlyFeeCents: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  oneTimeFeeCents?: Maybe<Scalars['Int']['output']>;
  perks: Array<Scalars['String']['output']>;
  perksTitle: Scalars['String']['output'];
};

export type PlanSummary = {
  __typename?: 'PlanSummary';
  id: Scalars['String']['output'];
  monthlyFeeCents: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  oneTimeFeeCents?: Maybe<Scalars['Int']['output']>;
};

export type PostHogPerson = {
  __typename?: 'PostHogPerson';
  id: Scalars['String']['output'];
};

export type PostSubscription = {
  __typename?: 'PostSubscription';
  entityGuid: Scalars['String']['output'];
  frequency: PostSubscriptionFrequencyEnum;
  userGuid: Scalars['String']['output'];
};

export enum PostSubscriptionFrequencyEnum {
  Always = 'ALWAYS',
  Highlights = 'HIGHLIGHTS',
  Never = 'NEVER',
}

export type PublisherRecsConnection = ConnectionInterface &
  NodeInterface & {
    __typename?: 'PublisherRecsConnection';
    dismissible: Scalars['Boolean']['output'];
    /**
     * TODO: clean this up to help with typing. Union types wont work due to the following error being outputted
     * `Error: ConnectionInterface.edges expects type "[EdgeInterface!]!" but PublisherRecsConnection.edges provides type "[UnionUserEdgeBoostEdge!]!".`
     */
    edges: Array<EdgeInterface>;
    id: Scalars['ID']['output'];
    pageInfo: PageInfo;
  };

export type PublisherRecsEdge = EdgeInterface & {
  __typename?: 'PublisherRecsEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: PublisherRecsConnection;
  type: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  activity: ActivityNode;
  /** Returns all permissions that exist on the site */
  allPermissions: Array<PermissionsEnum>;
  /** Returns all roles that exist on the site and their permission assignments */
  allRoles: Array<Role>;
  appReadyMobileConfig: AppReadyMobileConfig;
  /** Returns the permissions that the current session holds */
  assignedPermissions: Array<PermissionsEnum>;
  /** Returns the roles the session holds */
  assignedRoles: Array<Role>;
  /** Gets Boosts. */
  boosts: BoostsConnection;
  /** Returns a list of messages for a given chat room */
  chatMessages: ChatMessagesConnection;
  /** Returns a chat room */
  chatRoom: ChatRoomEdge;
  chatRoomGuids: Array<Scalars['String']['output']>;
  chatRoomInviteRequests: ChatRoomsConnection;
  /** Returns a list of chat rooms available to a user */
  chatRoomList: ChatRoomsConnection;
  /** Returns the members of a chat room */
  chatRoomMembers: ChatRoomMembersConnection;
  /** Returns the total count of unread messages a user has */
  chatUnreadMessagesCount: Scalars['Int']['output'];
  checkoutLink: Scalars['String']['output'];
  checkoutPage: CheckoutPage;
  /** Returns key value configs */
  config?: Maybe<Scalars['String']['output']>;
  /** Returns the navigation items that are configured for a site */
  customNavigationItems: Array<NavigationItem>;
  customPage: CustomPage;
  /** Get dismissal by key. */
  dismissalByKey?: Maybe<Dismissal>;
  /** Get all of a users dismissals. */
  dismissals: Array<Dismissal>;
  /**
   * Returns comments to be shown in the embedded comments app.
   * The comments will be associated with an activity post. If the activity post
   * does not exist, we will attempt to create it
   */
  embeddedComments: EmbeddedCommentsConnection;
  /** Returns the configured embedded-comments plugin settings for a user */
  embeddedCommentsSettings?: Maybe<EmbeddedCommentsSettings>;
  /** Gets featured entities. */
  featuredEntities: FeaturedEntityConnection;
  /** Returns an individual gift card */
  giftCard: GiftCardNode;
  /** Returns an individual gift card by its claim code. */
  giftCardByClaimCode: GiftCardNode;
  /**
   * Returns a list of gift card transactions for a ledger,
   * containing more information than just getting transactions,
   * including linked boost_guid's for Boost payments and injects
   * a transaction for the initial deposit.
   */
  giftCardTransactionLedger: GiftCardTransactionsConnection;
  /** Returns a list of gift card transactions */
  giftCardTransactions: GiftCardTransactionsConnection;
  /** Returns a list of gift cards belonging to a user */
  giftCards: GiftCardsConnection;
  /** The available balance a user has */
  giftCardsBalance: Scalars['Float']['output'];
  /** The available balances of each gift card types */
  giftCardsBalances: Array<GiftCardBalanceByProductId>;
  invite: Invite;
  invites: InviteConnection;
  listPersonalApiKeys: Array<PersonalApiKey>;
  mobileConfig: MobileConfig;
  /** Gets multi-tenant config for the calling tenant. */
  multiTenantConfig?: Maybe<MultiTenantConfig>;
  multiTenantDomain: MultiTenantDomain;
  newsfeed: NewsfeedConnection;
  oidcProviders: Array<OidcProviderPublic>;
  /** Gets onboarding state for the currently logged in user. */
  onboardingState?: Maybe<OnboardingState>;
  /** Get the currently logged in users onboarding step progress. */
  onboardingStepProgress: Array<OnboardingStepProgressState>;
  /** Get a list of payment methods for the logged in user */
  paymentMethods: Array<PaymentMethod>;
  /** Get permission intents. */
  permissionIntents: Array<PermissionIntent>;
  personalApiKey?: Maybe<PersonalApiKey>;
  postHogPerson: PostHogPerson;
  postSubscription: PostSubscription;
  /** Gets reports. */
  reports: ReportsConnection;
  rssFeed: RssFeed;
  rssFeeds: Array<RssFeed>;
  search: SearchResultsConnection;
  siteMembership: SiteMembership;
  siteMembershipSubscriptions: Array<SiteMembershipSubscription>;
  siteMemberships: Array<SiteMembership>;
  /** Returns the stripe keys */
  stripeKeys: StripeKeysType;
  /** Returns data to be displayed in a chart. All metrics are supported. */
  tenantAdminAnalyticsChart: AnalyticsChartType;
  /** Returns multiple 'kpis' from a list of provided metrics. */
  tenantAdminAnalyticsKpis: Array<AnalyticsKpiType>;
  /** Returns a paginated list of popular content */
  tenantAdminAnalyticsTable: AnalyticsTableConnection;
  tenantAssets: AssetConnection;
  tenantBilling: TenantBillingType;
  tenantQuotaUsage: QuotaDetails;
  tenants: Array<Tenant>;
  totalRoomInviteRequests: Scalars['Int']['output'];
  userAssets: AssetConnection;
  userQuotaUsage: QuotaDetails;
  /** Returns users and their roles */
  usersByRole: UserRoleConnection;
};

export type QueryActivityArgs = {
  guid: Scalars['String']['input'];
};

export type QueryAppReadyMobileConfigArgs = {
  tenantId: Scalars['Int']['input'];
};

export type QueryAssignedRolesArgs = {
  userGuid?: InputMaybe<Scalars['String']['input']>;
};

export type QueryBoostsArgs = {
  after?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  servedByGuid?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  targetAudience?: InputMaybe<Scalars['Int']['input']>;
  targetLocation?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryChatMessagesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  roomGuid: Scalars['String']['input'];
};

export type QueryChatRoomArgs = {
  roomGuid: Scalars['String']['input'];
};

export type QueryChatRoomInviteRequestsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryChatRoomListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryChatRoomMembersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['Int']['input']>;
  excludeSelf?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  roomGuid?: InputMaybe<Scalars['String']['input']>;
};

export type QueryCheckoutLinkArgs = {
  addOnIds?: InputMaybe<Array<Scalars['String']['input']>>;
  isTrialUpgrade?: InputMaybe<Scalars['Boolean']['input']>;
  planId: Scalars['String']['input'];
  timePeriod: CheckoutTimePeriodEnum;
};

export type QueryCheckoutPageArgs = {
  addOnIds?: InputMaybe<Array<Scalars['String']['input']>>;
  page: CheckoutPageKeyEnum;
  planId: Scalars['String']['input'];
  timePeriod: CheckoutTimePeriodEnum;
};

export type QueryConfigArgs = {
  key: Scalars['String']['input'];
};

export type QueryCustomPageArgs = {
  pageType: Scalars['String']['input'];
};

export type QueryDismissalByKeyArgs = {
  key: Scalars['String']['input'];
};

export type QueryEmbeddedCommentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  ownerGuid: Scalars['String']['input'];
  parentPath?: InputMaybe<Scalars['String']['input']>;
  url: Scalars['String']['input'];
};

export type QueryFeaturedEntitiesArgs = {
  after?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  type: FeaturedEntityTypeEnum;
};

export type QueryGiftCardArgs = {
  guid: Scalars['String']['input'];
};

export type QueryGiftCardByClaimCodeArgs = {
  claimCode: Scalars['String']['input'];
};

export type QueryGiftCardTransactionLedgerArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  giftCardGuid: Scalars['String']['input'];
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryGiftCardTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryGiftCardsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  includeIssued?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<GiftCardOrderingEnum>;
  productId?: InputMaybe<GiftCardProductIdEnum>;
  statusFilter?: InputMaybe<GiftCardStatusFilterEnum>;
};

export type QueryInviteArgs = {
  inviteId: Scalars['Int']['input'];
};

export type QueryInvitesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};

export type QueryNewsfeedArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  algorithm: Scalars['String']['input'];
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  inFeedNoticesDelivered?: InputMaybe<Array<Scalars['String']['input']>>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryPaymentMethodsArgs = {
  productId?: InputMaybe<GiftCardProductIdEnum>;
};

export type QueryPersonalApiKeyArgs = {
  id: Scalars['String']['input'];
};

export type QueryPostSubscriptionArgs = {
  entityGuid: Scalars['String']['input'];
};

export type QueryReportsArgs = {
  after?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<ReportStatusEnum>;
};

export type QueryRssFeedArgs = {
  feedId: Scalars['String']['input'];
};

export type QuerySearchArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter: SearchFilterEnum;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  mediaType: SearchMediaTypeEnum;
  nsfw?: InputMaybe<Array<SearchNsfwEnum>>;
  query: Scalars['String']['input'];
};

export type QuerySiteMembershipArgs = {
  membershipGuid: Scalars['String']['input'];
};

export type QueryTenantAdminAnalyticsChartArgs = {
  fromUnixTs?: InputMaybe<Scalars['Int']['input']>;
  metric: AnalyticsMetricEnum;
  toUnixTs?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryTenantAdminAnalyticsKpisArgs = {
  fromUnixTs?: InputMaybe<Scalars['Int']['input']>;
  metrics: Array<AnalyticsMetricEnum>;
  toUnixTs?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryTenantAdminAnalyticsTableArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  fromUnixTs?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  table: AnalyticsTableEnum;
  toUnixTs?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryTenantAssetsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryTenantsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryUserAssetsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryUsersByRoleArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  roleId?: InputMaybe<Scalars['Int']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type QuotaDetails = {
  __typename?: 'QuotaDetails';
  sizeInBytes: Scalars['Int']['output'];
};

export type Report = NodeInterface & {
  __typename?: 'Report';
  action?: Maybe<ReportActionEnum>;
  createdTimestamp: Scalars['Int']['output'];
  cursor?: Maybe<Scalars['String']['output']>;
  /** Gets entity edge from entityUrn. */
  entityEdge?: Maybe<UnionActivityEdgeUserEdgeGroupEdgeCommentEdgeChatMessageEdge>;
  entityGuid?: Maybe<Scalars['String']['output']>;
  entityUrn: Scalars['String']['output'];
  /** Gets ID for GraphQL. */
  id: Scalars['ID']['output'];
  illegalSubReason?: Maybe<IllegalSubReasonEnum>;
  moderatedByGuid?: Maybe<Scalars['String']['output']>;
  nsfwSubReason?: Maybe<NsfwSubReasonEnum>;
  reason: ReportReasonEnum;
  reportGuid?: Maybe<Scalars['String']['output']>;
  reportedByGuid?: Maybe<Scalars['String']['output']>;
  /** Gets reported user edge from reportedByGuid. */
  reportedByUserEdge?: Maybe<UserEdge>;
  securitySubReason?: Maybe<SecuritySubReasonEnum>;
  status: ReportStatusEnum;
  tenantId?: Maybe<Scalars['String']['output']>;
  updatedTimestamp?: Maybe<Scalars['Int']['output']>;
};

export enum ReportActionEnum {
  Ban = 'BAN',
  Delete = 'DELETE',
  Ignore = 'IGNORE',
}

export type ReportEdge = EdgeInterface & {
  __typename?: 'ReportEdge';
  /** Gets cursor for GraphQL. */
  cursor: Scalars['String']['output'];
  /** Gets ID for GraphQL. */
  id: Scalars['ID']['output'];
  /** Gets node. */
  node?: Maybe<Report>;
  /** Gets type for GraphQL. */
  type: Scalars['String']['output'];
};

export type ReportInput = {
  entityUrn: Scalars['String']['input'];
  illegalSubReason?: InputMaybe<IllegalSubReasonEnum>;
  nsfwSubReason?: InputMaybe<NsfwSubReasonEnum>;
  reason: ReportReasonEnum;
  securitySubReason?: InputMaybe<SecuritySubReasonEnum>;
};

export enum ReportReasonEnum {
  ActivityPubReport = 'ACTIVITY_PUB_REPORT',
  AnotherReason = 'ANOTHER_REASON',
  Harassment = 'HARASSMENT',
  Illegal = 'ILLEGAL',
  Impersonation = 'IMPERSONATION',
  InauthenticEngagement = 'INAUTHENTIC_ENGAGEMENT',
  IncitementToViolence = 'INCITEMENT_TO_VIOLENCE',
  IntellectualPropertyViolation = 'INTELLECTUAL_PROPERTY_VIOLATION',
  Malware = 'MALWARE',
  Nsfw = 'NSFW',
  PersonalConfidentialInformation = 'PERSONAL_CONFIDENTIAL_INFORMATION',
  Security = 'SECURITY',
  Spam = 'SPAM',
  ViolatesPremiumContentPolicy = 'VIOLATES_PREMIUM_CONTENT_POLICY',
}

export enum ReportStatusEnum {
  Actioned = 'ACTIONED',
  Pending = 'PENDING',
}

export type ReportsConnection = ConnectionInterface & {
  __typename?: 'ReportsConnection';
  /** Gets connections edges. */
  edges: Array<EdgeInterface>;
  /** ID for GraphQL. */
  id: Scalars['ID']['output'];
  pageInfo: PageInfo;
};

export type Role = {
  __typename?: 'Role';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  permissions: Array<PermissionsEnum>;
};

export type RssFeed = {
  __typename?: 'RssFeed';
  createdAtTimestamp?: Maybe<Scalars['Int']['output']>;
  feedId: Scalars['String']['output'];
  lastFetchAtTimestamp?: Maybe<Scalars['Int']['output']>;
  lastFetchStatus?: Maybe<RssFeedLastFetchStatusEnum>;
  tenantId?: Maybe<Scalars['Int']['output']>;
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
  userGuid: Scalars['String']['output'];
};

export type RssFeedInput = {
  url: Scalars['String']['input'];
};

export enum RssFeedLastFetchStatusEnum {
  FailedToConnect = 'FAILED_TO_CONNECT',
  FailedToParse = 'FAILED_TO_PARSE',
  FetchInProgress = 'FETCH_IN_PROGRESS',
  Success = 'SUCCESS',
}

export enum SearchFilterEnum {
  Group = 'GROUP',
  Latest = 'LATEST',
  Top = 'TOP',
  User = 'USER',
}

export enum SearchMediaTypeEnum {
  All = 'ALL',
  Blog = 'BLOG',
  Image = 'IMAGE',
  Video = 'VIDEO',
}

export enum SearchNsfwEnum {
  Nudity = 'NUDITY',
  Other = 'OTHER',
  Pornography = 'PORNOGRAPHY',
  Profanity = 'PROFANITY',
  RaceReligion = 'RACE_RELIGION',
  Violence = 'VIOLENCE',
}

export type SearchResultsConnection = ConnectionInterface & {
  __typename?: 'SearchResultsConnection';
  /** The number of search records matching the query */
  count: Scalars['Int']['output'];
  edges: Array<EdgeInterface>;
  pageInfo: PageInfo;
};

export type SearchResultsCount = {
  __typename?: 'SearchResultsCount';
  count: Scalars['Int']['output'];
};

export enum SecuritySubReasonEnum {
  HackedAccount = 'HACKED_ACCOUNT',
}

export type SiteMembership = {
  __typename?: 'SiteMembership';
  archived: Scalars['Boolean']['output'];
  groups?: Maybe<Array<GroupNode>>;
  id: Scalars['ID']['output'];
  isExternal: Scalars['Boolean']['output'];
  manageUrl?: Maybe<Scalars['String']['output']>;
  membershipBillingPeriod: SiteMembershipBillingPeriodEnum;
  membershipDescription?: Maybe<Scalars['String']['output']>;
  membershipGuid: Scalars['String']['output'];
  membershipName: Scalars['String']['output'];
  membershipPriceInCents: Scalars['Int']['output'];
  membershipPricingModel: SiteMembershipPricingModelEnum;
  priceCurrency: Scalars['String']['output'];
  purchaseUrl?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Array<Role>>;
};

export enum SiteMembershipBillingPeriodEnum {
  Monthly = 'MONTHLY',
  Yearly = 'YEARLY',
}

export type SiteMembershipInput = {
  groups?: InputMaybe<Array<Scalars['String']['input']>>;
  isExternal?: InputMaybe<Scalars['Boolean']['input']>;
  manageUrl?: InputMaybe<Scalars['String']['input']>;
  membershipBillingPeriod: SiteMembershipBillingPeriodEnum;
  membershipDescription?: InputMaybe<Scalars['String']['input']>;
  membershipName: Scalars['String']['input'];
  membershipPriceInCents: Scalars['Int']['input'];
  membershipPricingModel: SiteMembershipPricingModelEnum;
  purchaseUrl?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum SiteMembershipPricingModelEnum {
  OneTime = 'ONE_TIME',
  Recurring = 'RECURRING',
}

export type SiteMembershipSubscription = {
  __typename?: 'SiteMembershipSubscription';
  autoRenew: Scalars['Boolean']['output'];
  isManual: Scalars['Boolean']['output'];
  membershipGuid: Scalars['String']['output'];
  membershipSubscriptionId: Scalars['Int']['output'];
  validFromTimestamp?: Maybe<Scalars['Int']['output']>;
  validToTimestamp?: Maybe<Scalars['Int']['output']>;
};

export type SiteMembershipUpdateInput = {
  groups?: InputMaybe<Array<Scalars['String']['input']>>;
  manageUrl?: InputMaybe<Scalars['String']['input']>;
  membershipDescription?: InputMaybe<Scalars['String']['input']>;
  membershipGuid: Scalars['String']['input'];
  membershipName: Scalars['String']['input'];
  purchaseUrl?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type StripeKeysType = {
  __typename?: 'StripeKeysType';
  pubKey: Scalars['String']['output'];
  secKey: Scalars['String']['output'];
};

export type Summary = {
  __typename?: 'Summary';
  addonsSummary: Array<AddOn>;
  planSummary: PlanSummary;
  totalInitialFeeCents: Scalars['Int']['output'];
  totalMonthlyFeeCents: Scalars['Int']['output'];
};

export type Tenant = {
  __typename?: 'Tenant';
  config?: Maybe<MultiTenantConfig>;
  domain?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  ownerGuid?: Maybe<Scalars['String']['output']>;
  plan: TenantPlanEnum;
  rootUserGuid?: Maybe<Scalars['String']['output']>;
  suspendedTimestamp?: Maybe<Scalars['Int']['output']>;
  trialStartTimestamp?: Maybe<Scalars['Int']['output']>;
};

export type TenantBillingType = {
  __typename?: 'TenantBillingType';
  isActive: Scalars['Boolean']['output'];
  manageBillingUrl?: Maybe<Scalars['String']['output']>;
  nextBillingAmountCents: Scalars['Int']['output'];
  nextBillingDate?: Maybe<Scalars['DateTime']['output']>;
  period: CheckoutTimePeriodEnum;
  plan: TenantPlanEnum;
  previousBillingAmountCents: Scalars['Int']['output'];
  previousBillingDate?: Maybe<Scalars['DateTime']['output']>;
};

export type TenantInput = {
  config?: InputMaybe<MultiTenantConfigInput>;
  domain?: InputMaybe<Scalars['String']['input']>;
  ownerGuid?: InputMaybe<Scalars['Int']['input']>;
};

export type TenantLoginRedirectDetails = {
  __typename?: 'TenantLoginRedirectDetails';
  jwtToken?: Maybe<Scalars['String']['output']>;
  loginUrl?: Maybe<Scalars['String']['output']>;
  tenant: Tenant;
};

export enum TenantPlanEnum {
  Community = 'COMMUNITY',
  Enterprise = 'ENTERPRISE',
  Team = 'TEAM',
}

export type TenantUser = {
  __typename?: 'TenantUser';
  guid: Scalars['String']['output'];
  role: TenantUserRoleEnum;
  tenantId: Scalars['Int']['output'];
  username: Scalars['String']['output'];
};

export type TenantUserInput = {
  tenantId?: InputMaybe<Scalars['Int']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export enum TenantUserRoleEnum {
  Admin = 'ADMIN',
  Owner = 'OWNER',
  User = 'USER',
}

export type UnionActivityEdgeUserEdgeGroupEdgeCommentEdgeChatMessageEdge =
  | ActivityEdge
  | ChatMessageEdge
  | CommentEdge
  | GroupEdge
  | UserEdge;

export type UserEdge = EdgeInterface & {
  __typename?: 'UserEdge';
  cursor: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  node: UserNode;
  type: Scalars['String']['output'];
};

export type UserNode = NodeInterface & {
  __typename?: 'UserNode';
  briefDescription: Scalars['String']['output'];
  /** The users public ETH address */
  ethAddress?: Maybe<Scalars['String']['output']>;
  guid: Scalars['String']['output'];
  iconUrl: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The number of views the users has received. Includes views from their posts */
  impressionsCount: Scalars['Int']['output'];
  /** The user is a founder (contributed to crowdfunding) */
  isFounder: Scalars['Boolean']['output'];
  /** The user is a member of Minds+ */
  isPlus: Scalars['Boolean']['output'];
  /** The user is a member of Minds Pro */
  isPro: Scalars['Boolean']['output'];
  /** You are subscribed to this user */
  isSubscribed: Scalars['Boolean']['output'];
  /** The user is subscribed to you */
  isSubscriber: Scalars['Boolean']['output'];
  /** The user is a verified */
  isVerified: Scalars['Boolean']['output'];
  legacy: Scalars['String']['output'];
  name: Scalars['String']['output'];
  nsfw: Array<Scalars['Int']['output']>;
  nsfwLock: Array<Scalars['Int']['output']>;
  /** The number of subscribers the user has */
  subscribersCount: Scalars['Int']['output'];
  /** The number of channels the user is subscribed to */
  subscriptionsCount: Scalars['Int']['output'];
  /** Unix timestamp representation of time created */
  timeCreated: Scalars['Int']['output'];
  /** ISO 8601 timestamp representation of time created */
  timeCreatedISO8601: Scalars['String']['output'];
  urn: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type UserRoleConnection = ConnectionInterface & {
  __typename?: 'UserRoleConnection';
  edges: Array<UserRoleEdge>;
  pageInfo: PageInfo;
};

export type UserRoleEdge = EdgeInterface & {
  __typename?: 'UserRoleEdge';
  cursor: Scalars['String']['output'];
  node: UserNode;
  roles: Array<Role>;
};

export type VerdictInput = {
  action: ReportActionEnum;
  reportGuid?: InputMaybe<Scalars['String']['input']>;
};

export type DismissMutationVariables = Exact<{
  key: Scalars['String']['input'];
}>;

export type DismissMutation = {
  __typename?: 'Mutation';
  dismiss: {
    __typename?: 'Dismissal';
    userGuid: string;
    key: string;
    dismissalTimestamp: number;
  };
};

export type GetDismissalByKeyQueryVariables = Exact<{
  key: Scalars['String']['input'];
}>;

export type GetDismissalByKeyQuery = {
  __typename?: 'Query';
  dismissalByKey?: {
    __typename?: 'Dismissal';
    userGuid: string;
    key: string;
    dismissalTimestamp: number;
  } | null;
};

export type GetDismissalsQueryVariables = Exact<{ [key: string]: never }>;

export type GetDismissalsQuery = {
  __typename?: 'Query';
  dismissals: Array<{
    __typename?: 'Dismissal';
    userGuid: string;
    key: string;
    dismissalTimestamp: number;
  }>;
};

export type FetchOidcProvidersQueryVariables = Exact<{ [key: string]: never }>;

export type FetchOidcProvidersQuery = {
  __typename?: 'Query';
  oidcProviders: Array<{
    __typename?: 'OidcProviderPublic';
    id: number;
    name: string;
    loginUrl: string;
  }>;
};

export type AdminUpdateAccountMutationVariables = Exact<{
  currentUsername: Scalars['String']['input'];
  newUsername?: InputMaybe<Scalars['String']['input']>;
  newEmail?: InputMaybe<Scalars['String']['input']>;
  resetMFA?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type AdminUpdateAccountMutation = {
  __typename?: 'Mutation';
  updateAccount: Array<string>;
};

export type ModerationSetUserBanStateMutationVariables = Exact<{
  subjectGuid: Scalars['String']['input'];
  banState: Scalars['Boolean']['input'];
}>;

export type ModerationSetUserBanStateMutation = {
  __typename?: 'Mutation';
  setUserBanState: boolean;
};

export type ModerationDeleteEntityMutationVariables = Exact<{
  subjectUrn: Scalars['String']['input'];
}>;

export type ModerationDeleteEntityMutation = {
  __typename?: 'Mutation';
  deleteEntity: boolean;
};

export type GetBoostFeedQueryVariables = Exact<{
  targetLocation?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after: Scalars['Int']['input'];
  source: Scalars['String']['input'];
}>;

export type GetBoostFeedQuery = {
  __typename?: 'Query';
  boosts: {
    __typename?: 'BoostsConnection';
    edges: Array<{
      __typename?: 'BoostEdge';
      node: {
        __typename?: 'BoostNode';
        guid: string;
        activity: { __typename?: 'ActivityNode'; legacy: string };
      };
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      endCursor?: string | null;
      startCursor?: string | null;
    };
  };
};

export type AdminCancelBoostsMutationVariables = Exact<{
  entityGuid: Scalars['String']['input'];
}>;

export type AdminCancelBoostsMutation = {
  __typename?: 'Mutation';
  adminCancelBoosts: boolean;
};

export type AddMembersToChatRoomMutationVariables = Exact<{
  roomGuid: Scalars['String']['input'];
  memberGuids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;

export type AddMembersToChatRoomMutation = {
  __typename?: 'Mutation';
  addMembersToChatRoom: boolean;
};

export type CreateChatMessageMutationVariables = Exact<{
  plainText: Scalars['String']['input'];
  roomGuid: Scalars['String']['input'];
}>;

export type CreateChatMessageMutation = {
  __typename?: 'Mutation';
  createChatMessage: {
    __typename?: 'ChatMessageEdge';
    id: string;
    cursor: string;
    node: {
      __typename?: 'ChatMessageNode';
      id: string;
      guid: string;
      roomGuid: string;
      plainText: string;
      timeCreatedISO8601: string;
      timeCreatedUnix: string;
      sender: {
        __typename?: 'UserEdge';
        id: string;
        type: string;
        cursor: string;
        node: {
          __typename?: 'UserNode';
          name: string;
          username: string;
          guid: string;
          id: string;
        };
      };
      richEmbed?: {
        __typename?: 'ChatRichEmbedNode';
        id: string;
        url: string;
        canonicalUrl: string;
        title?: string | null;
        thumbnailSrc?: string | null;
      } | null;
    };
  };
};

export type CreateChatRoomMutationVariables = Exact<{
  otherMemberGuids:
    | Array<Scalars['String']['input']>
    | Scalars['String']['input'];
  roomType?: InputMaybe<ChatRoomTypeEnum>;
  groupGuid?: InputMaybe<Scalars['String']['input']>;
}>;

export type CreateChatRoomMutation = {
  __typename?: 'Mutation';
  createChatRoom: {
    __typename?: 'ChatRoomEdge';
    cursor: string;
    node: {
      __typename?: 'ChatRoomNode';
      id: string;
      guid: string;
      roomType: ChatRoomTypeEnum;
      groupGuid?: string | null;
      timeCreatedISO8601: string;
      timeCreatedUnix: string;
    };
  };
};

export type CreateGroupChatRoomMutationVariables = Exact<{
  groupGuid: Scalars['String']['input'];
}>;

export type CreateGroupChatRoomMutation = {
  __typename?: 'Mutation';
  createGroupChatRoom: {
    __typename?: 'ChatRoomEdge';
    cursor: string;
    node: {
      __typename?: 'ChatRoomNode';
      id: string;
      guid: string;
      roomType: ChatRoomTypeEnum;
      groupGuid?: string | null;
      timeCreatedISO8601: string;
      timeCreatedUnix: string;
    };
  };
};

export type DeleteChatMessageMutationVariables = Exact<{
  roomGuid: Scalars['String']['input'];
  messageGuid: Scalars['String']['input'];
}>;

export type DeleteChatMessageMutation = {
  __typename?: 'Mutation';
  deleteChatMessage: boolean;
};

export type DeleteChatRoomAndBlockUserMutationVariables = Exact<{
  roomGuid: Scalars['String']['input'];
}>;

export type DeleteChatRoomAndBlockUserMutation = {
  __typename?: 'Mutation';
  deleteChatRoomAndBlockUser: boolean;
};

export type DeleteChatRoomMutationVariables = Exact<{
  roomGuid: Scalars['String']['input'];
}>;

export type DeleteChatRoomMutation = {
  __typename?: 'Mutation';
  deleteChatRoom: boolean;
};

export type DeleteGroupChatRoomsMutationVariables = Exact<{
  groupGuid: Scalars['String']['input'];
}>;

export type DeleteGroupChatRoomsMutation = {
  __typename?: 'Mutation';
  deleteGroupChatRooms: boolean;
};

export type GetChatMessagesQueryVariables = Exact<{
  roomGuid: Scalars['String']['input'];
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetChatMessagesQuery = {
  __typename?: 'Query';
  chatMessages: {
    __typename?: 'ChatMessagesConnection';
    edges: Array<{
      __typename?: 'ChatMessageEdge';
      cursor: string;
      id: string;
      node: {
        __typename?: 'ChatMessageNode';
        id: string;
        guid: string;
        roomGuid: string;
        plainText: string;
        timeCreatedISO8601: string;
        timeCreatedUnix: string;
        sender: {
          __typename?: 'UserEdge';
          id: string;
          type: string;
          cursor: string;
          node: {
            __typename?: 'UserNode';
            name: string;
            username: string;
            id: string;
            guid: string;
          };
        };
        richEmbed?: {
          __typename?: 'ChatRichEmbedNode';
          id: string;
          url: string;
          canonicalUrl: string;
          title?: string | null;
          thumbnailSrc?: string | null;
        } | null;
      };
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
};

export type GetChatRoomGuidsQueryVariables = Exact<{ [key: string]: never }>;

export type GetChatRoomGuidsQuery = {
  __typename?: 'Query';
  chatRoomGuids: Array<string>;
};

export type GetChatRoomInviteRequestsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetChatRoomInviteRequestsQuery = {
  __typename?: 'Query';
  chatRoomInviteRequests: {
    __typename?: 'ChatRoomsConnection';
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
    edges: Array<{
      __typename?: 'ChatRoomEdge';
      cursor: string;
      lastMessagePlainText?: string | null;
      lastMessageCreatedTimestamp?: number | null;
      node: {
        __typename?: 'ChatRoomNode';
        id: string;
        guid: string;
        roomType: ChatRoomTypeEnum;
        timeCreatedISO8601: string;
        timeCreatedUnix: string;
      };
      members: {
        __typename?: 'ChatRoomMembersConnection';
        edges: Array<{
          __typename?: 'ChatRoomMemberEdge';
          cursor: string;
          node: {
            __typename?: 'UserNode';
            id: string;
            guid: string;
            username: string;
            name: string;
          };
        }>;
      };
    }>;
  };
};

export type GetChatRoomMembersQueryVariables = Exact<{
  roomGuid: Scalars['String']['input'];
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  excludeSelf?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type GetChatRoomMembersQuery = {
  __typename?: 'Query';
  chatRoomMembers: {
    __typename?: 'ChatRoomMembersConnection';
    edges: Array<{
      __typename?: 'ChatRoomMemberEdge';
      cursor: string;
      role: ChatRoomRoleEnum;
      node: {
        __typename?: 'UserNode';
        id: string;
        guid: string;
        name: string;
        username: string;
        urn: string;
      };
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
};

export type GetChatRoomNotificationStatusQueryVariables = Exact<{
  roomGuid: Scalars['String']['input'];
}>;

export type GetChatRoomNotificationStatusQuery = {
  __typename?: 'Query';
  chatRoom: {
    __typename?: 'ChatRoomEdge';
    id: string;
    node: {
      __typename?: 'ChatRoomNode';
      chatRoomNotificationStatus?: ChatRoomNotificationStatusEnum | null;
    };
  };
};

export type GetChatRoomQueryVariables = Exact<{
  roomGuid: Scalars['String']['input'];
  firstMembers: Scalars['Int']['input'];
  afterMembers: Scalars['Int']['input'];
}>;

export type GetChatRoomQuery = {
  __typename?: 'Query';
  chatRoom: {
    __typename?: 'ChatRoomEdge';
    id: string;
    cursor: string;
    unreadMessagesCount: number;
    lastMessagePlainText?: string | null;
    lastMessageCreatedTimestamp?: number | null;
    node: {
      __typename?: 'ChatRoomNode';
      guid: string;
      roomType: ChatRoomTypeEnum;
      name: string;
      groupGuid?: string | null;
      id: string;
      isChatRequest: boolean;
      isUserRoomOwner?: boolean | null;
      chatRoomNotificationStatus?: ChatRoomNotificationStatusEnum | null;
    };
    members: {
      __typename?: 'ChatRoomMembersConnection';
      edges: Array<{
        __typename?: 'ChatRoomMemberEdge';
        cursor: string;
        role: ChatRoomRoleEnum;
        node: {
          __typename?: 'UserNode';
          name: string;
          username: string;
          id: string;
          guid: string;
        };
      }>;
      pageInfo: {
        __typename?: 'PageInfo';
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor?: string | null;
        endCursor?: string | null;
      };
    };
  };
};

export type GetChatRoomsListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetChatRoomsListQuery = {
  __typename?: 'Query';
  chatRoomList: {
    __typename?: 'ChatRoomsConnection';
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
    edges: Array<{
      __typename?: 'ChatRoomEdge';
      id: string;
      cursor: string;
      unreadMessagesCount: number;
      lastMessagePlainText?: string | null;
      lastMessageCreatedTimestamp?: number | null;
      node: {
        __typename?: 'ChatRoomNode';
        id: string;
        guid: string;
        name: string;
        roomType: ChatRoomTypeEnum;
        groupGuid?: string | null;
        timeCreatedISO8601: string;
        timeCreatedUnix: string;
      };
      members: {
        __typename?: 'ChatRoomMembersConnection';
        edges: Array<{
          __typename?: 'ChatRoomMemberEdge';
          cursor: string;
          node: {
            __typename?: 'UserNode';
            id: string;
            guid: string;
            username: string;
            name: string;
          };
        }>;
      };
    }>;
  };
};

export type GetTotalChatRoomMembersQueryVariables = Exact<{
  roomGuid: Scalars['String']['input'];
}>;

export type GetTotalChatRoomMembersQuery = {
  __typename?: 'Query';
  chatRoom: { __typename?: 'ChatRoomEdge'; totalMembers: number };
};

export type GetTotalRoomInviteRequestsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetTotalRoomInviteRequestsQuery = {
  __typename?: 'Query';
  totalRoomInviteRequests: number;
};

export type InitChatQueryVariables = Exact<{ [key: string]: never }>;

export type InitChatQuery = {
  __typename?: 'Query';
  chatUnreadMessagesCount: number;
};

export type LeaveChatRoomMutationVariables = Exact<{
  roomGuid: Scalars['String']['input'];
}>;

export type LeaveChatRoomMutation = {
  __typename?: 'Mutation';
  leaveChatRoom: boolean;
};

export type RemoveMemberFromChatRoomMutationVariables = Exact<{
  roomGuid: Scalars['String']['input'];
  memberGuid: Scalars['String']['input'];
}>;

export type RemoveMemberFromChatRoomMutation = {
  __typename?: 'Mutation';
  removeMemberFromChatRoom: boolean;
};

export type ReplyToRoomInviteRequestMutationVariables = Exact<{
  roomGuid: Scalars['String']['input'];
  action: ChatRoomInviteRequestActionEnum;
}>;

export type ReplyToRoomInviteRequestMutation = {
  __typename?: 'Mutation';
  replyToRoomInviteRequest: boolean;
};

export type SetReadReceiptMutationVariables = Exact<{
  roomGuid: Scalars['String']['input'];
  messageGuid: Scalars['String']['input'];
}>;

export type SetReadReceiptMutation = {
  __typename?: 'Mutation';
  readReceipt: {
    __typename?: 'ChatRoomEdge';
    id: string;
    unreadMessagesCount: number;
  };
};

export type UpdateChatRoomNameMutationVariables = Exact<{
  roomGuid: Scalars['String']['input'];
  roomName: Scalars['String']['input'];
}>;

export type UpdateChatRoomNameMutation = {
  __typename?: 'Mutation';
  updateChatRoomName: boolean;
};

export type UpdateChatRoomNotificationSettingsMutationVariables = Exact<{
  roomGuid: Scalars['String']['input'];
  notificationStatus: ChatRoomNotificationStatusEnum;
}>;

export type UpdateChatRoomNotificationSettingsMutation = {
  __typename?: 'Mutation';
  updateNotificationSettings: boolean;
};

export type ClaimGiftCardMutationVariables = Exact<{
  claimCode: Scalars['String']['input'];
}>;

export type ClaimGiftCardMutation = {
  __typename?: 'Mutation';
  claimGiftCard: {
    __typename?: 'GiftCardNode';
    guid?: string | null;
    productId: GiftCardProductIdEnum;
    amount: number;
    balance: number;
    expiresAt: number;
    claimedAt?: number | null;
    claimedByGuid?: string | null;
  };
};

export type CreateGiftCardMutationVariables = Exact<{
  productIdEnum: Scalars['Int']['input'];
  amount: Scalars['Float']['input'];
  stripePaymentMethodId: Scalars['String']['input'];
  targetInput: GiftCardTargetInput;
}>;

export type CreateGiftCardMutation = {
  __typename?: 'Mutation';
  createGiftCard: { __typename?: 'GiftCardNode'; guid?: string | null };
};

export type GetGiftCardBalancesWithExpiryDataQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetGiftCardBalancesWithExpiryDataQuery = {
  __typename?: 'Query';
  giftCardsBalances: Array<{
    __typename?: 'GiftCardBalanceByProductId';
    productId: GiftCardProductIdEnum;
    balance: number;
    earliestExpiringGiftCard?: {
      __typename?: 'GiftCardNode';
      guid?: string | null;
      balance: number;
      expiresAt: number;
    } | null;
  }>;
};

export type GetGiftCardBalancesQueryVariables = Exact<{ [key: string]: never }>;

export type GetGiftCardBalancesQuery = {
  __typename?: 'Query';
  giftCardsBalances: Array<{
    __typename?: 'GiftCardBalanceByProductId';
    productId: GiftCardProductIdEnum;
    balance: number;
  }>;
};

export type GetGiftCardByCodeQueryVariables = Exact<{
  claimCode: Scalars['String']['input'];
}>;

export type GetGiftCardByCodeQuery = {
  __typename?: 'Query';
  giftCardByClaimCode: {
    __typename?: 'GiftCardNode';
    guid?: string | null;
    productId: GiftCardProductIdEnum;
    amount: number;
    balance: number;
    expiresAt: number;
    claimedAt?: number | null;
    issuedByUsername?: string | null;
  };
};

export type GetGiftCardTransactionsLedgerQueryVariables = Exact<{
  giftCardGuid: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetGiftCardTransactionsLedgerQuery = {
  __typename?: 'Query';
  giftCardTransactionLedger: {
    __typename?: 'GiftCardTransactionsConnection';
    edges: Array<{
      __typename?: 'GiftCardTransactionEdge';
      node: {
        __typename?: 'GiftCardTransaction';
        paymentGuid?: string | null;
        giftCardGuid?: string | null;
        amount: number;
        createdAt: number;
        refundedAt?: number | null;
        boostGuid?: string | null;
        id: string;
        giftCardIssuerGuid?: string | null;
        giftCardIssuerName?: string | null;
      };
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      endCursor?: string | null;
      startCursor?: string | null;
    };
  };
};

export type GetGiftCardQueryVariables = Exact<{
  guid: Scalars['String']['input'];
}>;

export type GetGiftCardQuery = {
  __typename?: 'Query';
  giftCard: {
    __typename?: 'GiftCardNode';
    guid?: string | null;
    productId: GiftCardProductIdEnum;
    amount: number;
    balance: number;
    expiresAt: number;
    claimedAt?: number | null;
  };
};

export type GetGiftCardsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  ordering?: InputMaybe<GiftCardOrderingEnum>;
  productId?: InputMaybe<GiftCardProductIdEnum>;
  statusFilter?: InputMaybe<GiftCardStatusFilterEnum>;
}>;

export type GetGiftCardsQuery = {
  __typename?: 'Query';
  giftCards: {
    __typename?: 'GiftCardsConnection';
    edges: Array<{
      __typename?: 'GiftCardEdge';
      node: {
        __typename?: 'GiftCardNode';
        guid?: string | null;
        productId: GiftCardProductIdEnum;
        balance: number;
        expiresAt: number;
      };
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      endCursor?: string | null;
    };
  };
};

export type GetAdminAnalyticsChartAndKpisQueryVariables = Exact<{
  chartMetric: AnalyticsMetricEnum;
  kpiMetrics: Array<AnalyticsMetricEnum> | AnalyticsMetricEnum;
  fromUnixTs: Scalars['Int']['input'];
  toUnixTs: Scalars['Int']['input'];
}>;

export type GetAdminAnalyticsChartAndKpisQuery = {
  __typename?: 'Query';
  tenantAdminAnalyticsChart: {
    __typename?: 'AnalyticsChartType';
    metric: AnalyticsMetricEnum;
    segments: Array<{
      __typename?: 'AnalyticsChartSegmentType';
      buckets: Array<{
        __typename?: 'AnalyticsChartBucketType';
        date: string;
        key: string;
        value: number;
      }>;
    }>;
  };
  tenantAdminAnalyticsKpis: Array<{
    __typename?: 'AnalyticsKpiType';
    metric: AnalyticsMetricEnum;
    value: number;
    previousPeriodValue: number;
  }>;
};

export type GetTenantAnalyticsTableQueryVariables = Exact<{
  table: AnalyticsTableEnum;
  fromUnixTs?: InputMaybe<Scalars['Int']['input']>;
  toUnixTs?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;

export type GetTenantAnalyticsTableQuery = {
  __typename?: 'Query';
  tenantAdminAnalyticsTable: {
    __typename?: 'AnalyticsTableConnection';
    edges: Array<{
      __typename?: 'AnalyticsTableRowEdge';
      cursor: string;
      node:
        | { __typename?: 'ActivityNode'; id: string }
        | {
            __typename?: 'AnalyticsTableRowActivityNode';
            views: number;
            engagements: number;
            id: string;
            activity: {
              __typename?: 'ActivityNode';
              id: string;
              guid: string;
              ownerGuid: string;
              title?: string | null;
              message: string;
              owner: { __typename?: 'UserNode'; username: string };
            };
          }
        | {
            __typename?: 'AnalyticsTableRowGroupNode';
            newMembers: number;
            id: string;
            group: { __typename?: 'GroupNode'; name: string; guid: string };
          }
        | {
            __typename?: 'AnalyticsTableRowUserNode';
            newSubscribers: number;
            totalSubscribers: number;
            id: string;
            user: { __typename?: 'UserNode'; guid: string; username: string };
          }
        | { __typename?: 'BoostNode'; id: string }
        | { __typename?: 'ChatMessageNode'; id: string }
        | { __typename?: 'ChatRichEmbedNode'; id: string }
        | { __typename?: 'ChatRoomNode'; id: string }
        | { __typename?: 'CommentNode'; id: string }
        | { __typename?: 'CustomPage'; id: string }
        | { __typename?: 'FeaturedEntity'; id: string }
        | { __typename?: 'FeaturedEntityConnection'; id: string }
        | { __typename?: 'FeaturedGroup'; id: string }
        | { __typename?: 'FeaturedUser'; id: string }
        | { __typename?: 'FeedExploreTagNode'; id: string }
        | { __typename?: 'FeedHeaderNode'; id: string }
        | { __typename?: 'FeedHighlightsConnection'; id: string }
        | { __typename?: 'FeedNoticeNode'; id: string }
        | { __typename?: 'GiftCardNode'; id: string }
        | { __typename?: 'GiftCardTransaction'; id: string }
        | { __typename?: 'GroupNode'; id: string }
        | { __typename?: 'Invite'; id: string }
        | { __typename?: 'InviteConnection'; id: string }
        | { __typename?: 'NodeImpl'; id: string }
        | { __typename?: 'PublisherRecsConnection'; id: string }
        | { __typename?: 'Report'; id: string }
        | { __typename?: 'UserNode'; id: string };
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
};

export type GetFeaturedEntitiesQueryVariables = Exact<{
  type: FeaturedEntityTypeEnum;
  after?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;

export type GetFeaturedEntitiesQuery = {
  __typename?: 'Query';
  featuredEntities: {
    __typename?: 'FeaturedEntityConnection';
    edges: Array<{
      __typename?: 'FeaturedEntityEdge';
      id: string;
      cursor: string;
      node:
        | { __typename?: 'ActivityNode'; id: string }
        | { __typename?: 'AnalyticsTableRowActivityNode'; id: string }
        | { __typename?: 'AnalyticsTableRowGroupNode'; id: string }
        | { __typename?: 'AnalyticsTableRowUserNode'; id: string }
        | { __typename?: 'BoostNode'; id: string }
        | { __typename?: 'ChatMessageNode'; id: string }
        | { __typename?: 'ChatRichEmbedNode'; id: string }
        | { __typename?: 'ChatRoomNode'; id: string }
        | { __typename?: 'CommentNode'; id: string }
        | { __typename?: 'CustomPage'; id: string }
        | { __typename?: 'FeaturedEntity'; id: string }
        | { __typename?: 'FeaturedEntityConnection'; id: string }
        | {
            __typename: 'FeaturedGroup';
            entityGuid: string;
            id: string;
            autoSubscribe: boolean;
            autoPostSubscription: boolean;
            name: string;
            briefDescription?: string | null;
            membersCount: number;
          }
        | {
            __typename: 'FeaturedUser';
            entityGuid: string;
            id: string;
            autoSubscribe: boolean;
            autoPostSubscription: boolean;
            name: string;
            username?: string | null;
          }
        | { __typename?: 'FeedExploreTagNode'; id: string }
        | { __typename?: 'FeedHeaderNode'; id: string }
        | { __typename?: 'FeedHighlightsConnection'; id: string }
        | { __typename?: 'FeedNoticeNode'; id: string }
        | { __typename?: 'GiftCardNode'; id: string }
        | { __typename?: 'GiftCardTransaction'; id: string }
        | { __typename?: 'GroupNode'; id: string }
        | { __typename?: 'Invite'; id: string }
        | { __typename?: 'InviteConnection'; id: string }
        | { __typename?: 'NodeImpl'; id: string }
        | { __typename?: 'PublisherRecsConnection'; id: string }
        | { __typename?: 'Report'; id: string }
        | { __typename?: 'UserNode'; id: string };
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
};

export type DeleteFeaturedEntityMutationVariables = Exact<{
  entityGuid: Scalars['String']['input'];
}>;

export type DeleteFeaturedEntityMutation = {
  __typename?: 'Mutation';
  deleteFeaturedEntity: boolean;
};

export type StoreFeaturedEntityMutationVariables = Exact<{
  entityGuid: Scalars['String']['input'];
  autoSubscribe?: InputMaybe<Scalars['Boolean']['input']>;
  autoPostSubscription?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type StoreFeaturedEntityMutation = {
  __typename?: 'Mutation';
  storeFeaturedEntity:
    | {
        __typename?: 'FeaturedEntity';
        id: string;
        tenantId: string;
        entityGuid: string;
        autoSubscribe: boolean;
        autoPostSubscription: boolean;
      }
    | {
        __typename?: 'FeaturedGroup';
        id: string;
        tenantId: string;
        entityGuid: string;
        autoSubscribe: boolean;
        autoPostSubscription: boolean;
      }
    | {
        __typename?: 'FeaturedUser';
        id: string;
        tenantId: string;
        entityGuid: string;
        autoSubscribe: boolean;
        autoPostSubscription: boolean;
      };
};

export type GetMobileConfigPreviewStateQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetMobileConfigPreviewStateQuery = {
  __typename?: 'Query';
  mobileConfig: {
    __typename?: 'MobileConfig';
    id: string;
    previewStatus: MobilePreviewStatusEnum;
    previewQRCode: string;
  };
};

export type GetMobileConfigQueryVariables = Exact<{ [key: string]: never }>;

export type GetMobileConfigQuery = {
  __typename?: 'Query';
  mobileConfig: {
    __typename?: 'MobileConfig';
    id: string;
    splashScreenType: MobileSplashScreenTypeEnum;
    welcomeScreenLogoType: MobileWelcomeScreenLogoTypeEnum;
    previewStatus: MobilePreviewStatusEnum;
    previewQRCode: string;
    appTrackingMessageEnabled?: boolean | null;
    appTrackingMessage?: string | null;
  };
};

export type SetMobileConfigMutationVariables = Exact<{
  mobileWelcomeScreenLogoType?: InputMaybe<MobileWelcomeScreenLogoTypeEnum>;
  mobileSplashScreenType?: InputMaybe<MobileSplashScreenTypeEnum>;
  mobilePreviewStatus?: InputMaybe<MobilePreviewStatusEnum>;
  appTrackingMessageEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  appTrackingMessage?: InputMaybe<Scalars['String']['input']>;
}>;

export type SetMobileConfigMutation = {
  __typename?: 'Mutation';
  mobileConfig: {
    __typename?: 'MobileConfig';
    id: string;
    splashScreenType: MobileSplashScreenTypeEnum;
    welcomeScreenLogoType: MobileWelcomeScreenLogoTypeEnum;
    previewStatus: MobilePreviewStatusEnum;
    previewQRCode: string;
    updateTimestamp: number;
    appTrackingMessageEnabled?: boolean | null;
    appTrackingMessage?: string | null;
  };
};

export type CreateNewReportMutationVariables = Exact<{
  entityUrn: Scalars['String']['input'];
  reason: ReportReasonEnum;
  illegalSubReason?: InputMaybe<IllegalSubReasonEnum>;
  nsfwSubReason?: InputMaybe<NsfwSubReasonEnum>;
  securitySubReason?: InputMaybe<SecuritySubReasonEnum>;
}>;

export type CreateNewReportMutation = {
  __typename?: 'Mutation';
  createNewReport: boolean;
};

export type GetReportsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after: Scalars['Int']['input'];
  status?: InputMaybe<ReportStatusEnum>;
}>;

export type GetReportsQuery = {
  __typename?: 'Query';
  reports: {
    __typename?: 'ReportsConnection';
    id: string;
    edges: Array<
      | {
          __typename?: 'ActivityEdge';
          cursor: string;
          node: { __typename?: 'ActivityNode'; id: string };
        }
      | {
          __typename?: 'AnalyticsTableRowEdge';
          cursor: string;
          node:
            | { __typename?: 'ActivityNode'; id: string }
            | { __typename?: 'AnalyticsTableRowActivityNode'; id: string }
            | { __typename?: 'AnalyticsTableRowGroupNode'; id: string }
            | { __typename?: 'AnalyticsTableRowUserNode'; id: string }
            | { __typename?: 'BoostNode'; id: string }
            | { __typename?: 'ChatMessageNode'; id: string }
            | { __typename?: 'ChatRichEmbedNode'; id: string }
            | { __typename?: 'ChatRoomNode'; id: string }
            | { __typename?: 'CommentNode'; id: string }
            | { __typename?: 'CustomPage'; id: string }
            | { __typename?: 'FeaturedEntity'; id: string }
            | { __typename?: 'FeaturedEntityConnection'; id: string }
            | { __typename?: 'FeaturedGroup'; id: string }
            | { __typename?: 'FeaturedUser'; id: string }
            | { __typename?: 'FeedExploreTagNode'; id: string }
            | { __typename?: 'FeedHeaderNode'; id: string }
            | { __typename?: 'FeedHighlightsConnection'; id: string }
            | { __typename?: 'FeedNoticeNode'; id: string }
            | { __typename?: 'GiftCardNode'; id: string }
            | { __typename?: 'GiftCardTransaction'; id: string }
            | { __typename?: 'GroupNode'; id: string }
            | { __typename?: 'Invite'; id: string }
            | { __typename?: 'InviteConnection'; id: string }
            | { __typename?: 'NodeImpl'; id: string }
            | { __typename?: 'PublisherRecsConnection'; id: string }
            | {
                __typename?: 'Report';
                tenantId?: string | null;
                reportGuid?: string | null;
                entityUrn: string;
                entityGuid?: string | null;
                reportedByGuid?: string | null;
                moderatedByGuid?: string | null;
                createdTimestamp: number;
                reason: ReportReasonEnum;
                nsfwSubReason?: NsfwSubReasonEnum | null;
                illegalSubReason?: IllegalSubReasonEnum | null;
                securitySubReason?: SecuritySubReasonEnum | null;
                id: string;
                reportedByUserEdge?: {
                  __typename?: 'UserEdge';
                  node: {
                    __typename?: 'UserNode';
                    guid: string;
                    username: string;
                  };
                } | null;
                entityEdge?:
                  | {
                      __typename?: 'ActivityEdge';
                      node: { __typename?: 'ActivityNode'; legacy: string };
                    }
                  | {
                      __typename?: 'ChatMessageEdge';
                      node: {
                        __typename?: 'ChatMessageNode';
                        id: string;
                        guid: string;
                        roomGuid: string;
                        plainText: string;
                        timeCreatedISO8601: string;
                        timeCreatedUnix: string;
                        sender: {
                          __typename?: 'UserEdge';
                          id: string;
                          type: string;
                          cursor: string;
                          node: {
                            __typename?: 'UserNode';
                            name: string;
                            username: string;
                            id: string;
                            guid: string;
                          };
                        };
                        richEmbed?: {
                          __typename?: 'ChatRichEmbedNode';
                          id: string;
                          url: string;
                          canonicalUrl: string;
                          title?: string | null;
                          thumbnailSrc?: string | null;
                        } | null;
                      };
                    }
                  | {
                      __typename?: 'CommentEdge';
                      node: { __typename?: 'CommentNode'; legacy: string };
                    }
                  | {
                      __typename?: 'GroupEdge';
                      node: { __typename?: 'GroupNode'; legacy: string };
                    }
                  | {
                      __typename?: 'UserEdge';
                      node: { __typename?: 'UserNode'; legacy: string };
                    }
                  | null;
              }
            | { __typename?: 'UserNode'; id: string };
        }
      | {
          __typename?: 'BoostEdge';
          cursor: string;
          node: { __typename?: 'BoostNode'; id: string };
        }
      | {
          __typename?: 'ChatMessageEdge';
          cursor: string;
          node: { __typename?: 'ChatMessageNode'; id: string };
        }
      | {
          __typename?: 'ChatRoomEdge';
          cursor: string;
          node: { __typename?: 'ChatRoomNode'; id: string };
        }
      | {
          __typename?: 'ChatRoomMemberEdge';
          cursor: string;
          node: { __typename?: 'UserNode'; id: string };
        }
      | {
          __typename?: 'CommentEdge';
          cursor: string;
          node: { __typename?: 'CommentNode'; id: string };
        }
      | {
          __typename?: 'EdgeImpl';
          cursor: string;
          node?:
            | { __typename?: 'ActivityNode'; id: string }
            | { __typename?: 'AnalyticsTableRowActivityNode'; id: string }
            | { __typename?: 'AnalyticsTableRowGroupNode'; id: string }
            | { __typename?: 'AnalyticsTableRowUserNode'; id: string }
            | { __typename?: 'BoostNode'; id: string }
            | { __typename?: 'ChatMessageNode'; id: string }
            | { __typename?: 'ChatRichEmbedNode'; id: string }
            | { __typename?: 'ChatRoomNode'; id: string }
            | { __typename?: 'CommentNode'; id: string }
            | { __typename?: 'CustomPage'; id: string }
            | { __typename?: 'FeaturedEntity'; id: string }
            | { __typename?: 'FeaturedEntityConnection'; id: string }
            | { __typename?: 'FeaturedGroup'; id: string }
            | { __typename?: 'FeaturedUser'; id: string }
            | { __typename?: 'FeedExploreTagNode'; id: string }
            | { __typename?: 'FeedHeaderNode'; id: string }
            | { __typename?: 'FeedHighlightsConnection'; id: string }
            | { __typename?: 'FeedNoticeNode'; id: string }
            | { __typename?: 'GiftCardNode'; id: string }
            | { __typename?: 'GiftCardTransaction'; id: string }
            | { __typename?: 'GroupNode'; id: string }
            | { __typename?: 'Invite'; id: string }
            | { __typename?: 'InviteConnection'; id: string }
            | { __typename?: 'NodeImpl'; id: string }
            | { __typename?: 'PublisherRecsConnection'; id: string }
            | {
                __typename?: 'Report';
                tenantId?: string | null;
                reportGuid?: string | null;
                entityUrn: string;
                entityGuid?: string | null;
                reportedByGuid?: string | null;
                moderatedByGuid?: string | null;
                createdTimestamp: number;
                reason: ReportReasonEnum;
                nsfwSubReason?: NsfwSubReasonEnum | null;
                illegalSubReason?: IllegalSubReasonEnum | null;
                securitySubReason?: SecuritySubReasonEnum | null;
                id: string;
                reportedByUserEdge?: {
                  __typename?: 'UserEdge';
                  node: {
                    __typename?: 'UserNode';
                    guid: string;
                    username: string;
                  };
                } | null;
                entityEdge?:
                  | {
                      __typename?: 'ActivityEdge';
                      node: { __typename?: 'ActivityNode'; legacy: string };
                    }
                  | {
                      __typename?: 'ChatMessageEdge';
                      node: {
                        __typename?: 'ChatMessageNode';
                        id: string;
                        guid: string;
                        roomGuid: string;
                        plainText: string;
                        timeCreatedISO8601: string;
                        timeCreatedUnix: string;
                        sender: {
                          __typename?: 'UserEdge';
                          id: string;
                          type: string;
                          cursor: string;
                          node: {
                            __typename?: 'UserNode';
                            name: string;
                            username: string;
                            id: string;
                            guid: string;
                          };
                        };
                        richEmbed?: {
                          __typename?: 'ChatRichEmbedNode';
                          id: string;
                          url: string;
                          canonicalUrl: string;
                          title?: string | null;
                          thumbnailSrc?: string | null;
                        } | null;
                      };
                    }
                  | {
                      __typename?: 'CommentEdge';
                      node: { __typename?: 'CommentNode'; legacy: string };
                    }
                  | {
                      __typename?: 'GroupEdge';
                      node: { __typename?: 'GroupNode'; legacy: string };
                    }
                  | {
                      __typename?: 'UserEdge';
                      node: { __typename?: 'UserNode'; legacy: string };
                    }
                  | null;
              }
            | { __typename?: 'UserNode'; id: string }
            | null;
        }
      | {
          __typename?: 'FeaturedEntityEdge';
          cursor: string;
          node:
            | { __typename?: 'ActivityNode'; id: string }
            | { __typename?: 'AnalyticsTableRowActivityNode'; id: string }
            | { __typename?: 'AnalyticsTableRowGroupNode'; id: string }
            | { __typename?: 'AnalyticsTableRowUserNode'; id: string }
            | { __typename?: 'BoostNode'; id: string }
            | { __typename?: 'ChatMessageNode'; id: string }
            | { __typename?: 'ChatRichEmbedNode'; id: string }
            | { __typename?: 'ChatRoomNode'; id: string }
            | { __typename?: 'CommentNode'; id: string }
            | { __typename?: 'CustomPage'; id: string }
            | { __typename?: 'FeaturedEntity'; id: string }
            | { __typename?: 'FeaturedEntityConnection'; id: string }
            | { __typename?: 'FeaturedGroup'; id: string }
            | { __typename?: 'FeaturedUser'; id: string }
            | { __typename?: 'FeedExploreTagNode'; id: string }
            | { __typename?: 'FeedHeaderNode'; id: string }
            | { __typename?: 'FeedHighlightsConnection'; id: string }
            | { __typename?: 'FeedNoticeNode'; id: string }
            | { __typename?: 'GiftCardNode'; id: string }
            | { __typename?: 'GiftCardTransaction'; id: string }
            | { __typename?: 'GroupNode'; id: string }
            | { __typename?: 'Invite'; id: string }
            | { __typename?: 'InviteConnection'; id: string }
            | { __typename?: 'NodeImpl'; id: string }
            | { __typename?: 'PublisherRecsConnection'; id: string }
            | {
                __typename?: 'Report';
                tenantId?: string | null;
                reportGuid?: string | null;
                entityUrn: string;
                entityGuid?: string | null;
                reportedByGuid?: string | null;
                moderatedByGuid?: string | null;
                createdTimestamp: number;
                reason: ReportReasonEnum;
                nsfwSubReason?: NsfwSubReasonEnum | null;
                illegalSubReason?: IllegalSubReasonEnum | null;
                securitySubReason?: SecuritySubReasonEnum | null;
                id: string;
                reportedByUserEdge?: {
                  __typename?: 'UserEdge';
                  node: {
                    __typename?: 'UserNode';
                    guid: string;
                    username: string;
                  };
                } | null;
                entityEdge?:
                  | {
                      __typename?: 'ActivityEdge';
                      node: { __typename?: 'ActivityNode'; legacy: string };
                    }
                  | {
                      __typename?: 'ChatMessageEdge';
                      node: {
                        __typename?: 'ChatMessageNode';
                        id: string;
                        guid: string;
                        roomGuid: string;
                        plainText: string;
                        timeCreatedISO8601: string;
                        timeCreatedUnix: string;
                        sender: {
                          __typename?: 'UserEdge';
                          id: string;
                          type: string;
                          cursor: string;
                          node: {
                            __typename?: 'UserNode';
                            name: string;
                            username: string;
                            id: string;
                            guid: string;
                          };
                        };
                        richEmbed?: {
                          __typename?: 'ChatRichEmbedNode';
                          id: string;
                          url: string;
                          canonicalUrl: string;
                          title?: string | null;
                          thumbnailSrc?: string | null;
                        } | null;
                      };
                    }
                  | {
                      __typename?: 'CommentEdge';
                      node: { __typename?: 'CommentNode'; legacy: string };
                    }
                  | {
                      __typename?: 'GroupEdge';
                      node: { __typename?: 'GroupNode'; legacy: string };
                    }
                  | {
                      __typename?: 'UserEdge';
                      node: { __typename?: 'UserNode'; legacy: string };
                    }
                  | null;
              }
            | { __typename?: 'UserNode'; id: string };
        }
      | {
          __typename?: 'FeedExploreTagEdge';
          cursor: string;
          node: { __typename?: 'FeedExploreTagNode'; id: string };
        }
      | {
          __typename?: 'FeedHeaderEdge';
          cursor: string;
          node: { __typename?: 'FeedHeaderNode'; id: string };
        }
      | {
          __typename?: 'FeedHighlightsEdge';
          cursor: string;
          node: { __typename?: 'FeedHighlightsConnection'; id: string };
        }
      | {
          __typename?: 'FeedNoticeEdge';
          cursor: string;
          node: { __typename?: 'FeedNoticeNode'; id: string };
        }
      | {
          __typename?: 'GiftCardEdge';
          cursor: string;
          node: { __typename?: 'GiftCardNode'; id: string };
        }
      | {
          __typename?: 'GiftCardTransactionEdge';
          cursor: string;
          node: { __typename?: 'GiftCardTransaction'; id: string };
        }
      | {
          __typename?: 'GroupEdge';
          cursor: string;
          node: { __typename?: 'GroupNode'; id: string };
        }
      | {
          __typename?: 'InviteEdge';
          cursor: string;
          node?: { __typename?: 'Invite'; id: string } | null;
        }
      | {
          __typename?: 'PublisherRecsEdge';
          cursor: string;
          node: { __typename?: 'PublisherRecsConnection'; id: string };
        }
      | {
          __typename?: 'ReportEdge';
          cursor: string;
          node?: {
            __typename?: 'Report';
            tenantId?: string | null;
            reportGuid?: string | null;
            entityUrn: string;
            entityGuid?: string | null;
            reportedByGuid?: string | null;
            moderatedByGuid?: string | null;
            createdTimestamp: number;
            reason: ReportReasonEnum;
            nsfwSubReason?: NsfwSubReasonEnum | null;
            illegalSubReason?: IllegalSubReasonEnum | null;
            securitySubReason?: SecuritySubReasonEnum | null;
            id: string;
            reportedByUserEdge?: {
              __typename?: 'UserEdge';
              node: { __typename?: 'UserNode'; guid: string; username: string };
            } | null;
            entityEdge?:
              | {
                  __typename?: 'ActivityEdge';
                  node: { __typename?: 'ActivityNode'; legacy: string };
                }
              | {
                  __typename?: 'ChatMessageEdge';
                  node: {
                    __typename?: 'ChatMessageNode';
                    id: string;
                    guid: string;
                    roomGuid: string;
                    plainText: string;
                    timeCreatedISO8601: string;
                    timeCreatedUnix: string;
                    sender: {
                      __typename?: 'UserEdge';
                      id: string;
                      type: string;
                      cursor: string;
                      node: {
                        __typename?: 'UserNode';
                        name: string;
                        username: string;
                        id: string;
                        guid: string;
                      };
                    };
                    richEmbed?: {
                      __typename?: 'ChatRichEmbedNode';
                      id: string;
                      url: string;
                      canonicalUrl: string;
                      title?: string | null;
                      thumbnailSrc?: string | null;
                    } | null;
                  };
                }
              | {
                  __typename?: 'CommentEdge';
                  node: { __typename?: 'CommentNode'; legacy: string };
                }
              | {
                  __typename?: 'GroupEdge';
                  node: { __typename?: 'GroupNode'; legacy: string };
                }
              | {
                  __typename?: 'UserEdge';
                  node: { __typename?: 'UserNode'; legacy: string };
                }
              | null;
          } | null;
        }
      | {
          __typename?: 'UserEdge';
          cursor: string;
          node: { __typename?: 'UserNode'; id: string };
        }
      | {
          __typename?: 'UserRoleEdge';
          cursor: string;
          node: { __typename?: 'UserNode'; id: string };
        }
    >;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
};

export type ProvideVerdictMutationVariables = Exact<{
  reportGuid: Scalars['String']['input'];
  action: ReportActionEnum;
}>;

export type ProvideVerdictMutation = {
  __typename?: 'Mutation';
  provideVerdict: boolean;
};

export type ArchiveSiteMembershipMutationVariables = Exact<{
  siteMembershipGuid: Scalars['String']['input'];
}>;

export type ArchiveSiteMembershipMutation = {
  __typename?: 'Mutation';
  archiveSiteMembership: boolean;
};

export type GetSiteMembershipQueryVariables = Exact<{
  membershipGuid: Scalars['String']['input'];
}>;

export type GetSiteMembershipQuery = {
  __typename?: 'Query';
  siteMembership: {
    __typename?: 'SiteMembership';
    id: string;
    membershipGuid: string;
    membershipName: string;
    membershipDescription?: string | null;
    membershipPriceInCents: number;
    priceCurrency: string;
    membershipBillingPeriod: SiteMembershipBillingPeriodEnum;
    membershipPricingModel: SiteMembershipPricingModelEnum;
    archived: boolean;
    isExternal: boolean;
    purchaseUrl?: string | null;
    manageUrl?: string | null;
    roles?: Array<{ __typename?: 'Role'; id: number; name: string }> | null;
    groups?: Array<{
      __typename?: 'GroupNode';
      guid: string;
      name: string;
      membersCount: number;
      legacy: string;
    }> | null;
  };
};

export type GetSiteMembershipsQueryVariables = Exact<{ [key: string]: never }>;

export type GetSiteMembershipsQuery = {
  __typename?: 'Query';
  siteMemberships: Array<{
    __typename?: 'SiteMembership';
    id: string;
    membershipGuid: string;
    membershipName: string;
    membershipDescription?: string | null;
    membershipPriceInCents: number;
    priceCurrency: string;
    membershipBillingPeriod: SiteMembershipBillingPeriodEnum;
    membershipPricingModel: SiteMembershipPricingModelEnum;
    isExternal: boolean;
    purchaseUrl?: string | null;
    manageUrl?: string | null;
    roles?: Array<{ __typename?: 'Role'; id: number; name: string }> | null;
    groups?: Array<{
      __typename?: 'GroupNode';
      guid: string;
      name: string;
      membersCount: number;
      legacy: string;
    }> | null;
  }>;
};

export type GetStripeKeysQueryVariables = Exact<{ [key: string]: never }>;

export type GetStripeKeysQuery = {
  __typename?: 'Query';
  stripeKeys: { __typename?: 'StripeKeysType'; pubKey: string; secKey: string };
};

export type SetSiteMembershipMutationVariables = Exact<{
  membershipName: Scalars['String']['input'];
  membershipPriceInCents: Scalars['Int']['input'];
  membershipBillingPeriod: SiteMembershipBillingPeriodEnum;
  membershipPricingModel: SiteMembershipPricingModelEnum;
  membershipDescription?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  groups?: InputMaybe<
    Array<Scalars['String']['input']> | Scalars['String']['input']
  >;
  isExternal: Scalars['Boolean']['input'];
  purchaseUrl?: InputMaybe<Scalars['String']['input']>;
  manageUrl?: InputMaybe<Scalars['String']['input']>;
}>;

export type SetSiteMembershipMutation = {
  __typename?: 'Mutation';
  siteMembership: {
    __typename?: 'SiteMembership';
    id: string;
    membershipGuid: string;
    membershipName: string;
    membershipPriceInCents: number;
    membershipBillingPeriod: SiteMembershipBillingPeriodEnum;
    membershipPricingModel: SiteMembershipPricingModelEnum;
    membershipDescription?: string | null;
    priceCurrency: string;
    isExternal: boolean;
    purchaseUrl?: string | null;
    manageUrl?: string | null;
    roles?: Array<{ __typename?: 'Role'; id: number; name: string }> | null;
    groups?: Array<{
      __typename?: 'GroupNode';
      id: string;
      name: string;
      guid: string;
      membersCount: number;
      legacy: string;
    }> | null;
  };
};

export type SetStripeKeysMutationVariables = Exact<{
  pubKey: Scalars['String']['input'];
  secKey: Scalars['String']['input'];
}>;

export type SetStripeKeysMutation = {
  __typename?: 'Mutation';
  setStripeKeys: boolean;
};

export type UpdateSiteMembershipMutationVariables = Exact<{
  membershipGuid: Scalars['String']['input'];
  membershipName: Scalars['String']['input'];
  membershipDescription?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  groups?: InputMaybe<
    Array<Scalars['String']['input']> | Scalars['String']['input']
  >;
  purchaseUrl?: InputMaybe<Scalars['String']['input']>;
  manageUrl?: InputMaybe<Scalars['String']['input']>;
}>;

export type UpdateSiteMembershipMutation = {
  __typename?: 'Mutation';
  updateSiteMembership: {
    __typename?: 'SiteMembership';
    id: string;
    membershipGuid: string;
    membershipName: string;
    membershipPriceInCents: number;
    membershipBillingPeriod: SiteMembershipBillingPeriodEnum;
    membershipPricingModel: SiteMembershipPricingModelEnum;
    membershipDescription?: string | null;
    priceCurrency: string;
    isExternal: boolean;
    purchaseUrl?: string | null;
    manageUrl?: string | null;
    roles?: Array<{ __typename?: 'Role'; id: number; name: string }> | null;
    groups?: Array<{
      __typename?: 'GroupNode';
      id: string;
      name: string;
      guid: string;
      membersCount: number;
      legacy: string;
    }> | null;
  };
};

export type GetPermissionIntentsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetPermissionIntentsQuery = {
  __typename?: 'Query';
  permissionIntents: Array<{
    __typename?: 'PermissionIntent';
    permissionId: PermissionsEnum;
    intentType: PermissionIntentTypeEnum;
    membershipGuid?: string | null;
  }>;
};

export type SetPermissionIntentMutationVariables = Exact<{
  permissionId: PermissionsEnum;
  intentType: PermissionIntentTypeEnum;
  membershipGuid?: InputMaybe<Scalars['String']['input']>;
}>;

export type SetPermissionIntentMutation = {
  __typename?: 'Mutation';
  setPermissionIntent?: {
    __typename?: 'PermissionIntent';
    permissionId: PermissionsEnum;
    intentType: PermissionIntentTypeEnum;
    membershipGuid?: string | null;
  } | null;
};

export type AssignUserToRoleMutationVariables = Exact<{
  userGuid: Scalars['String']['input'];
  roleId: Scalars['Int']['input'];
}>;

export type AssignUserToRoleMutation = {
  __typename?: 'Mutation';
  assignUserToRole: {
    __typename?: 'Role';
    id: number;
    name: string;
    permissions: Array<PermissionsEnum>;
  };
};

export type CancelInviteMutationVariables = Exact<{
  inviteId: Scalars['Int']['input'];
}>;

export type CancelInviteMutation = {
  __typename?: 'Mutation';
  cancelInvite?: any | null;
};

export type CreateInviteMutationVariables = Exact<{
  emails: Scalars['String']['input'];
  bespokeMessage: Scalars['String']['input'];
  roles?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  groups?: InputMaybe<
    Array<Scalars['String']['input']> | Scalars['String']['input']
  >;
}>;

export type CreateInviteMutation = {
  __typename?: 'Mutation';
  invite?: any | null;
};

export type DeleteCustomNavigationItemMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type DeleteCustomNavigationItemMutation = {
  __typename?: 'Mutation';
  deleteCustomNavigationItem: boolean;
};

export type GetRolesAndPermissionsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetRolesAndPermissionsQuery = {
  __typename?: 'Query';
  allPermissions: Array<PermissionsEnum>;
  allRoles: Array<{
    __typename?: 'Role';
    id: number;
    name: string;
    permissions: Array<PermissionsEnum>;
  }>;
};

export type GetAssignedRolesQueryVariables = Exact<{
  userGuid: Scalars['String']['input'];
}>;

export type GetAssignedRolesQuery = {
  __typename?: 'Query';
  assignedPermissions: Array<PermissionsEnum>;
  assignedRoles: Array<{
    __typename?: 'Role';
    id: number;
    name: string;
    permissions: Array<PermissionsEnum>;
  }>;
};

export type GetNavigationItemsQueryVariables = Exact<{ [key: string]: never }>;

export type GetNavigationItemsQuery = {
  __typename?: 'Query';
  customNavigationItems: Array<{
    __typename?: 'NavigationItem';
    id: string;
    name: string;
    type: NavigationItemTypeEnum;
    action?: NavigationItemActionEnum | null;
    iconId: string;
    order: number;
    url?: string | null;
    visible: boolean;
    visibleMobile: boolean;
    path?: string | null;
  }>;
};

export type GetCustomPageQueryVariables = Exact<{
  pageType: Scalars['String']['input'];
}>;

export type GetCustomPageQuery = {
  __typename?: 'Query';
  customPage: {
    __typename?: 'CustomPage';
    pageType: CustomPageTypesEnum;
    content?: string | null;
    externalLink?: string | null;
    defaultContent?: string | null;
  };
};

export type GetInvitesQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetInvitesQuery = {
  __typename?: 'Query';
  invites: {
    __typename?: 'InviteConnection';
    id: string;
    edges: Array<{
      __typename?: 'InviteEdge';
      cursor: string;
      node?: {
        __typename?: 'Invite';
        inviteId: number;
        email: string;
        status: InviteEmailStatusEnum;
        bespokeMessage: string;
        createdTimestamp: number;
        sendTimestamp?: number | null;
        id: string;
        roles?: Array<{
          __typename?: 'Role';
          id: number;
          name: string;
          permissions: Array<PermissionsEnum>;
        }> | null;
        groups?: Array<{ __typename?: 'GroupNode'; legacy: string }> | null;
      } | null;
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
};

export type GetMultiTenantConfigQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetMultiTenantConfigQuery = {
  __typename?: 'Query';
  multiTenantConfig?: {
    __typename?: 'MultiTenantConfig';
    siteName?: string | null;
    siteEmail?: string | null;
    colorScheme?: MultiTenantColorScheme | null;
    primaryColor?: string | null;
    canEnableFederation?: boolean | null;
    federationDisabled?: boolean | null;
    replyEmail?: string | null;
    boostEnabled?: boolean | null;
    customHomePageEnabled?: boolean | null;
    customHomePageDescription?: string | null;
    walledGardenEnabled?: boolean | null;
    digestEmailEnabled?: boolean | null;
    welcomeEmailEnabled?: boolean | null;
    isNonProfit?: boolean | null;
  } | null;
};

export type GetMultiTenantDomainQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetMultiTenantDomainQuery = {
  __typename?: 'Query';
  multiTenantDomain: {
    __typename?: 'MultiTenantDomain';
    domain: string;
    status: CustomHostnameStatusEnum;
    dnsRecord?: {
      __typename?: 'MultiTenantDomainDnsRecord';
      name: string;
      type: DnsRecordEnum;
      value: string;
    } | null;
    ownershipVerificationDnsRecord?: {
      __typename?: 'MultiTenantDomainDnsRecord';
      name: string;
      type: DnsRecordEnum;
      value: string;
    } | null;
  };
};

export type GetUsersByRoleQueryVariables = Exact<{
  roleId?: InputMaybe<Scalars['Int']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetUsersByRoleQuery = {
  __typename?: 'Query';
  usersByRole: {
    __typename?: 'UserRoleConnection';
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
    edges: Array<{
      __typename?: 'UserRoleEdge';
      cursor: string;
      node: {
        __typename?: 'UserNode';
        guid: string;
        username: string;
        name: string;
        legacy: string;
      };
      roles: Array<{
        __typename?: 'Role';
        name: string;
        id: number;
        permissions: Array<PermissionsEnum>;
      }>;
    }>;
  };
};

export type ResendInviteMutationVariables = Exact<{
  inviteId: Scalars['Int']['input'];
}>;

export type ResendInviteMutation = {
  __typename?: 'Mutation';
  resendInvite?: any | null;
};

export type ReorderNavigationItemsMutationVariables = Exact<{
  ids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;

export type ReorderNavigationItemsMutation = {
  __typename?: 'Mutation';
  updateCustomNavigationItemsOrder: Array<{
    __typename?: 'NavigationItem';
    id: string;
  }>;
};

export type SetCustomPageMutationVariables = Exact<{
  pageType: Scalars['String']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
  externalLink?: InputMaybe<Scalars['String']['input']>;
}>;

export type SetCustomPageMutation = {
  __typename?: 'Mutation';
  setCustomPage: boolean;
};

export type SetMultiTenantConfigMutationVariables = Exact<{
  siteName?: InputMaybe<Scalars['String']['input']>;
  colorScheme?: InputMaybe<MultiTenantColorScheme>;
  primaryColor?: InputMaybe<Scalars['String']['input']>;
  federationDisabled?: InputMaybe<Scalars['Boolean']['input']>;
  replyEmail?: InputMaybe<Scalars['String']['input']>;
  nsfwEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  boostEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  customHomePageEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  customHomePageDescription?: InputMaybe<Scalars['String']['input']>;
  walledGardenEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  digestEmailEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  welcomeEmailEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  loggedInLandingPageIdWeb?: InputMaybe<Scalars['String']['input']>;
  loggedInLandingPageIdMobile?: InputMaybe<Scalars['String']['input']>;
  isNonProfit?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type SetMultiTenantConfigMutation = {
  __typename?: 'Mutation';
  multiTenantConfig: boolean;
};

export type CreateMultiTenantDomainMutationVariables = Exact<{
  hostname: Scalars['String']['input'];
}>;

export type CreateMultiTenantDomainMutation = {
  __typename?: 'Mutation';
  createMultiTenantDomain: {
    __typename?: 'MultiTenantDomain';
    domain: string;
    status: CustomHostnameStatusEnum;
    dnsRecord?: {
      __typename?: 'MultiTenantDomainDnsRecord';
      name: string;
      type: DnsRecordEnum;
      value: string;
    } | null;
    ownershipVerificationDnsRecord?: {
      __typename?: 'MultiTenantDomainDnsRecord';
      name: string;
      type: DnsRecordEnum;
      value: string;
    } | null;
  };
};

export type SetRolePermissionMutationVariables = Exact<{
  permission: PermissionsEnum;
  roleId: Scalars['Int']['input'];
  enabled: Scalars['Boolean']['input'];
}>;

export type SetRolePermissionMutation = {
  __typename?: 'Mutation';
  setRolePermission: {
    __typename?: 'Role';
    permissions: Array<PermissionsEnum>;
  };
};

export type StartTenantTrialMutationVariables = Exact<{ [key: string]: never }>;

export type StartTenantTrialMutation = {
  __typename?: 'Mutation';
  tenantTrial: {
    __typename?: 'TenantLoginRedirectDetails';
    loginUrl?: string | null;
    jwtToken?: string | null;
    tenant: { __typename?: 'Tenant'; id: number };
  };
};

export type UnassignUserFromRoleMutationVariables = Exact<{
  userGuid: Scalars['String']['input'];
  roleId: Scalars['Int']['input'];
}>;

export type UnassignUserFromRoleMutation = {
  __typename?: 'Mutation';
  unassignUserFromRole: boolean;
};

export type UpsertNavigationItemMutationVariables = Exact<{
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  type: NavigationItemTypeEnum;
  visible: Scalars['Boolean']['input'];
  visibleMobile: Scalars['Boolean']['input'];
  iconId: Scalars['String']['input'];
  order: Scalars['Int']['input'];
  path?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  action?: InputMaybe<NavigationItemActionEnum>;
}>;

export type UpsertNavigationItemMutation = {
  __typename?: 'Mutation';
  upsertCustomNavigationItem: { __typename?: 'NavigationItem'; id: string };
};

export type GetCheckoutLinkQueryVariables = Exact<{
  planId: Scalars['String']['input'];
  addOnIds?: InputMaybe<
    Array<Scalars['String']['input']> | Scalars['String']['input']
  >;
  timePeriod: CheckoutTimePeriodEnum;
  isTrialUpgrade?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type GetCheckoutLinkQuery = {
  __typename?: 'Query';
  checkoutLink: string;
};

export type GetCheckoutPageQueryVariables = Exact<{
  planId: Scalars['String']['input'];
  page: CheckoutPageKeyEnum;
  timePeriod: CheckoutTimePeriodEnum;
  addOnIds?: InputMaybe<
    Array<Scalars['String']['input']> | Scalars['String']['input']
  >;
}>;

export type GetCheckoutPageQuery = {
  __typename?: 'Query';
  checkoutPage: {
    __typename?: 'CheckoutPage';
    id: CheckoutPageKeyEnum;
    title: string;
    description?: string | null;
    timePeriod: CheckoutTimePeriodEnum;
    totalAnnualSavingsCents: number;
    termsMarkdown?: string | null;
    plan: {
      __typename?: 'Plan';
      id: string;
      name: string;
      description: string;
      perksTitle: string;
      perks: Array<string>;
      monthlyFeeCents: number;
      oneTimeFeeCents?: number | null;
    };
    addOns: Array<{
      __typename?: 'AddOn';
      id: string;
      name: string;
      description: string;
      perksTitle: string;
      perks?: Array<string> | null;
      monthlyFeeCents?: number | null;
      oneTimeFeeCents?: number | null;
      inBasket: boolean;
    }>;
    summary: {
      __typename?: 'Summary';
      totalInitialFeeCents: number;
      totalMonthlyFeeCents: number;
      planSummary: {
        __typename?: 'PlanSummary';
        id: string;
        name: string;
        monthlyFeeCents: number;
        oneTimeFeeCents?: number | null;
      };
      addonsSummary: Array<{
        __typename?: 'AddOn';
        id: string;
        name: string;
        monthlyFeeCents?: number | null;
        oneTimeFeeCents?: number | null;
      }>;
    };
  };
};

export type CreateTenantRootUserMutationVariables = Exact<{
  networkUserInput?: InputMaybe<TenantUserInput>;
}>;

export type CreateTenantRootUserMutation = {
  __typename?: 'Mutation';
  createNetworkRootUser: {
    __typename?: 'TenantUser';
    guid: string;
    username: string;
    tenantId: number;
    role: TenantUserRoleEnum;
  };
};

export type CreateTenantMutationVariables = Exact<{ [key: string]: never }>;

export type CreateTenantMutation = {
  __typename?: 'Mutation';
  createTenant: { __typename?: 'Tenant'; id: number };
};

export type GetNetworksListQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  last: Scalars['Int']['input'];
}>;

export type GetNetworksListQuery = {
  __typename?: 'Query';
  tenants: Array<{
    __typename?: 'Tenant';
    id: number;
    domain?: string | null;
    ownerGuid?: string | null;
    rootUserGuid?: string | null;
    plan: TenantPlanEnum;
    config?: {
      __typename?: 'MultiTenantConfig';
      siteName?: string | null;
    } | null;
  }>;
};

export type FetchNewsfeedQueryVariables = Exact<{
  algorithm: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  inFeedNoticesDelivered?: InputMaybe<
    Array<Scalars['String']['input']> | Scalars['String']['input']
  >;
}>;

export type FetchNewsfeedQuery = {
  __typename?: 'Query';
  newsfeed: {
    __typename?: 'NewsfeedConnection';
    edges: Array<
      | {
          __typename?: 'ActivityEdge';
          explicitVotes: boolean;
          cursor: string;
          node: { __typename?: 'ActivityNode'; legacy: string; id: string };
        }
      | {
          __typename?: 'AnalyticsTableRowEdge';
          cursor: string;
          node:
            | { __typename?: 'ActivityNode'; legacy: string; id: string }
            | { __typename?: 'AnalyticsTableRowActivityNode'; id: string }
            | { __typename?: 'AnalyticsTableRowGroupNode'; id: string }
            | { __typename?: 'AnalyticsTableRowUserNode'; id: string }
            | {
                __typename?: 'BoostNode';
                goalButtonUrl?: string | null;
                goalButtonText?: number | null;
                legacy: string;
                id: string;
              }
            | { __typename?: 'ChatMessageNode'; id: string }
            | { __typename?: 'ChatRichEmbedNode'; id: string }
            | { __typename?: 'ChatRoomNode'; id: string }
            | { __typename?: 'CommentNode'; id: string }
            | { __typename?: 'CustomPage'; id: string }
            | { __typename?: 'FeaturedEntity'; id: string }
            | { __typename?: 'FeaturedEntityConnection'; id: string }
            | { __typename?: 'FeaturedGroup'; id: string }
            | { __typename?: 'FeaturedUser'; id: string }
            | { __typename?: 'FeedExploreTagNode'; tag: string; id: string }
            | { __typename?: 'FeedHeaderNode'; text: string; id: string }
            | {
                __typename?: 'FeedHighlightsConnection';
                id: string;
                edges: Array<{
                  __typename?: 'ActivityEdge';
                  node: {
                    __typename?: 'ActivityNode';
                    id: string;
                    legacy: string;
                  };
                }>;
                pageInfo: {
                  __typename?: 'PageInfo';
                  hasPreviousPage: boolean;
                  hasNextPage: boolean;
                  startCursor?: string | null;
                  endCursor?: string | null;
                };
              }
            | {
                __typename?: 'FeedNoticeNode';
                location: string;
                key: string;
                dismissible: boolean;
                id: string;
              }
            | { __typename?: 'GiftCardNode'; id: string }
            | { __typename?: 'GiftCardTransaction'; id: string }
            | { __typename?: 'GroupNode'; id: string }
            | { __typename?: 'Invite'; id: string }
            | { __typename?: 'InviteConnection'; id: string }
            | { __typename?: 'NodeImpl'; id: string }
            | {
                __typename?: 'PublisherRecsConnection';
                dismissible: boolean;
                id: string;
                edges: Array<
                  | {
                      __typename?: 'ActivityEdge';
                      publisherNode: {
                        __typename?: 'ActivityNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'AnalyticsTableRowEdge';
                      publisherNode:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'ChatMessageNode'; id: string }
                        | { __typename?: 'ChatRichEmbedNode'; id: string }
                        | { __typename?: 'ChatRoomNode'; id: string }
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'CustomPage'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'Invite'; id: string }
                        | { __typename?: 'InviteConnection'; id: string }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          };
                    }
                  | {
                      __typename?: 'BoostEdge';
                      publisherNode: {
                        __typename?: 'BoostNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatMessageEdge';
                      publisherNode: {
                        __typename?: 'ChatMessageNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatRoomEdge';
                      publisherNode: {
                        __typename?: 'ChatRoomNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatRoomMemberEdge';
                      publisherNode: {
                        __typename?: 'UserNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'CommentEdge';
                      publisherNode: { __typename?: 'CommentNode'; id: string };
                    }
                  | {
                      __typename?: 'EdgeImpl';
                      publisherNode?:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'ChatMessageNode'; id: string }
                        | { __typename?: 'ChatRichEmbedNode'; id: string }
                        | { __typename?: 'ChatRoomNode'; id: string }
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'CustomPage'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'Invite'; id: string }
                        | { __typename?: 'InviteConnection'; id: string }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          }
                        | null;
                    }
                  | {
                      __typename?: 'FeaturedEntityEdge';
                      publisherNode:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'ChatMessageNode'; id: string }
                        | { __typename?: 'ChatRichEmbedNode'; id: string }
                        | { __typename?: 'ChatRoomNode'; id: string }
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'CustomPage'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'Invite'; id: string }
                        | { __typename?: 'InviteConnection'; id: string }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          };
                    }
                  | {
                      __typename?: 'FeedExploreTagEdge';
                      publisherNode: {
                        __typename?: 'FeedExploreTagNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHeaderEdge';
                      publisherNode: {
                        __typename?: 'FeedHeaderNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHighlightsEdge';
                      publisherNode: {
                        __typename?: 'FeedHighlightsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedNoticeEdge';
                      publisherNode: {
                        __typename?: 'FeedNoticeNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GiftCardEdge';
                      publisherNode: {
                        __typename?: 'GiftCardNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GiftCardTransactionEdge';
                      publisherNode: {
                        __typename?: 'GiftCardTransaction';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GroupEdge';
                      publisherNode: {
                        __typename?: 'GroupNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'InviteEdge';
                      publisherNode?: {
                        __typename?: 'Invite';
                        id: string;
                      } | null;
                    }
                  | {
                      __typename?: 'PublisherRecsEdge';
                      publisherNode: {
                        __typename?: 'PublisherRecsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ReportEdge';
                      publisherNode?: {
                        __typename?: 'Report';
                        id: string;
                      } | null;
                    }
                  | {
                      __typename?: 'UserEdge';
                      publisherNode: {
                        __typename?: 'UserNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'UserRoleEdge';
                      publisherNode: {
                        __typename?: 'UserNode';
                        legacy: string;
                        id: string;
                      };
                    }
                >;
                pageInfo: {
                  __typename?: 'PageInfo';
                  hasPreviousPage: boolean;
                  hasNextPage: boolean;
                  startCursor?: string | null;
                  endCursor?: string | null;
                };
              }
            | { __typename?: 'Report'; id: string }
            | { __typename?: 'UserNode'; id: string };
        }
      | {
          __typename?: 'BoostEdge';
          cursor: string;
          node: {
            __typename?: 'BoostNode';
            goalButtonUrl?: string | null;
            goalButtonText?: number | null;
            legacy: string;
            id: string;
          };
        }
      | {
          __typename?: 'ChatMessageEdge';
          cursor: string;
          node: { __typename?: 'ChatMessageNode'; id: string };
        }
      | {
          __typename?: 'ChatRoomEdge';
          cursor: string;
          node: { __typename?: 'ChatRoomNode'; id: string };
        }
      | {
          __typename?: 'ChatRoomMemberEdge';
          cursor: string;
          node: { __typename?: 'UserNode'; id: string };
        }
      | {
          __typename?: 'CommentEdge';
          cursor: string;
          node: { __typename?: 'CommentNode'; id: string };
        }
      | {
          __typename?: 'EdgeImpl';
          cursor: string;
          node?:
            | { __typename?: 'ActivityNode'; legacy: string; id: string }
            | { __typename?: 'AnalyticsTableRowActivityNode'; id: string }
            | { __typename?: 'AnalyticsTableRowGroupNode'; id: string }
            | { __typename?: 'AnalyticsTableRowUserNode'; id: string }
            | {
                __typename?: 'BoostNode';
                goalButtonUrl?: string | null;
                goalButtonText?: number | null;
                legacy: string;
                id: string;
              }
            | { __typename?: 'ChatMessageNode'; id: string }
            | { __typename?: 'ChatRichEmbedNode'; id: string }
            | { __typename?: 'ChatRoomNode'; id: string }
            | { __typename?: 'CommentNode'; id: string }
            | { __typename?: 'CustomPage'; id: string }
            | { __typename?: 'FeaturedEntity'; id: string }
            | { __typename?: 'FeaturedEntityConnection'; id: string }
            | { __typename?: 'FeaturedGroup'; id: string }
            | { __typename?: 'FeaturedUser'; id: string }
            | { __typename?: 'FeedExploreTagNode'; tag: string; id: string }
            | { __typename?: 'FeedHeaderNode'; text: string; id: string }
            | {
                __typename?: 'FeedHighlightsConnection';
                id: string;
                edges: Array<{
                  __typename?: 'ActivityEdge';
                  node: {
                    __typename?: 'ActivityNode';
                    id: string;
                    legacy: string;
                  };
                }>;
                pageInfo: {
                  __typename?: 'PageInfo';
                  hasPreviousPage: boolean;
                  hasNextPage: boolean;
                  startCursor?: string | null;
                  endCursor?: string | null;
                };
              }
            | {
                __typename?: 'FeedNoticeNode';
                location: string;
                key: string;
                dismissible: boolean;
                id: string;
              }
            | { __typename?: 'GiftCardNode'; id: string }
            | { __typename?: 'GiftCardTransaction'; id: string }
            | { __typename?: 'GroupNode'; id: string }
            | { __typename?: 'Invite'; id: string }
            | { __typename?: 'InviteConnection'; id: string }
            | { __typename?: 'NodeImpl'; id: string }
            | {
                __typename?: 'PublisherRecsConnection';
                dismissible: boolean;
                id: string;
                edges: Array<
                  | {
                      __typename?: 'ActivityEdge';
                      publisherNode: {
                        __typename?: 'ActivityNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'AnalyticsTableRowEdge';
                      publisherNode:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'ChatMessageNode'; id: string }
                        | { __typename?: 'ChatRichEmbedNode'; id: string }
                        | { __typename?: 'ChatRoomNode'; id: string }
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'CustomPage'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'Invite'; id: string }
                        | { __typename?: 'InviteConnection'; id: string }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          };
                    }
                  | {
                      __typename?: 'BoostEdge';
                      publisherNode: {
                        __typename?: 'BoostNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatMessageEdge';
                      publisherNode: {
                        __typename?: 'ChatMessageNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatRoomEdge';
                      publisherNode: {
                        __typename?: 'ChatRoomNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatRoomMemberEdge';
                      publisherNode: {
                        __typename?: 'UserNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'CommentEdge';
                      publisherNode: { __typename?: 'CommentNode'; id: string };
                    }
                  | {
                      __typename?: 'EdgeImpl';
                      publisherNode?:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'ChatMessageNode'; id: string }
                        | { __typename?: 'ChatRichEmbedNode'; id: string }
                        | { __typename?: 'ChatRoomNode'; id: string }
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'CustomPage'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'Invite'; id: string }
                        | { __typename?: 'InviteConnection'; id: string }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          }
                        | null;
                    }
                  | {
                      __typename?: 'FeaturedEntityEdge';
                      publisherNode:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'ChatMessageNode'; id: string }
                        | { __typename?: 'ChatRichEmbedNode'; id: string }
                        | { __typename?: 'ChatRoomNode'; id: string }
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'CustomPage'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'Invite'; id: string }
                        | { __typename?: 'InviteConnection'; id: string }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          };
                    }
                  | {
                      __typename?: 'FeedExploreTagEdge';
                      publisherNode: {
                        __typename?: 'FeedExploreTagNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHeaderEdge';
                      publisherNode: {
                        __typename?: 'FeedHeaderNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHighlightsEdge';
                      publisherNode: {
                        __typename?: 'FeedHighlightsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedNoticeEdge';
                      publisherNode: {
                        __typename?: 'FeedNoticeNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GiftCardEdge';
                      publisherNode: {
                        __typename?: 'GiftCardNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GiftCardTransactionEdge';
                      publisherNode: {
                        __typename?: 'GiftCardTransaction';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GroupEdge';
                      publisherNode: {
                        __typename?: 'GroupNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'InviteEdge';
                      publisherNode?: {
                        __typename?: 'Invite';
                        id: string;
                      } | null;
                    }
                  | {
                      __typename?: 'PublisherRecsEdge';
                      publisherNode: {
                        __typename?: 'PublisherRecsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ReportEdge';
                      publisherNode?: {
                        __typename?: 'Report';
                        id: string;
                      } | null;
                    }
                  | {
                      __typename?: 'UserEdge';
                      publisherNode: {
                        __typename?: 'UserNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'UserRoleEdge';
                      publisherNode: {
                        __typename?: 'UserNode';
                        legacy: string;
                        id: string;
                      };
                    }
                >;
                pageInfo: {
                  __typename?: 'PageInfo';
                  hasPreviousPage: boolean;
                  hasNextPage: boolean;
                  startCursor?: string | null;
                  endCursor?: string | null;
                };
              }
            | { __typename?: 'Report'; id: string }
            | { __typename?: 'UserNode'; id: string }
            | null;
        }
      | {
          __typename?: 'FeaturedEntityEdge';
          cursor: string;
          node:
            | { __typename?: 'ActivityNode'; legacy: string; id: string }
            | { __typename?: 'AnalyticsTableRowActivityNode'; id: string }
            | { __typename?: 'AnalyticsTableRowGroupNode'; id: string }
            | { __typename?: 'AnalyticsTableRowUserNode'; id: string }
            | {
                __typename?: 'BoostNode';
                goalButtonUrl?: string | null;
                goalButtonText?: number | null;
                legacy: string;
                id: string;
              }
            | { __typename?: 'ChatMessageNode'; id: string }
            | { __typename?: 'ChatRichEmbedNode'; id: string }
            | { __typename?: 'ChatRoomNode'; id: string }
            | { __typename?: 'CommentNode'; id: string }
            | { __typename?: 'CustomPage'; id: string }
            | { __typename?: 'FeaturedEntity'; id: string }
            | { __typename?: 'FeaturedEntityConnection'; id: string }
            | { __typename?: 'FeaturedGroup'; id: string }
            | { __typename?: 'FeaturedUser'; id: string }
            | { __typename?: 'FeedExploreTagNode'; tag: string; id: string }
            | { __typename?: 'FeedHeaderNode'; text: string; id: string }
            | {
                __typename?: 'FeedHighlightsConnection';
                id: string;
                edges: Array<{
                  __typename?: 'ActivityEdge';
                  node: {
                    __typename?: 'ActivityNode';
                    id: string;
                    legacy: string;
                  };
                }>;
                pageInfo: {
                  __typename?: 'PageInfo';
                  hasPreviousPage: boolean;
                  hasNextPage: boolean;
                  startCursor?: string | null;
                  endCursor?: string | null;
                };
              }
            | {
                __typename?: 'FeedNoticeNode';
                location: string;
                key: string;
                dismissible: boolean;
                id: string;
              }
            | { __typename?: 'GiftCardNode'; id: string }
            | { __typename?: 'GiftCardTransaction'; id: string }
            | { __typename?: 'GroupNode'; id: string }
            | { __typename?: 'Invite'; id: string }
            | { __typename?: 'InviteConnection'; id: string }
            | { __typename?: 'NodeImpl'; id: string }
            | {
                __typename?: 'PublisherRecsConnection';
                dismissible: boolean;
                id: string;
                edges: Array<
                  | {
                      __typename?: 'ActivityEdge';
                      publisherNode: {
                        __typename?: 'ActivityNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'AnalyticsTableRowEdge';
                      publisherNode:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'ChatMessageNode'; id: string }
                        | { __typename?: 'ChatRichEmbedNode'; id: string }
                        | { __typename?: 'ChatRoomNode'; id: string }
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'CustomPage'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'Invite'; id: string }
                        | { __typename?: 'InviteConnection'; id: string }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          };
                    }
                  | {
                      __typename?: 'BoostEdge';
                      publisherNode: {
                        __typename?: 'BoostNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatMessageEdge';
                      publisherNode: {
                        __typename?: 'ChatMessageNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatRoomEdge';
                      publisherNode: {
                        __typename?: 'ChatRoomNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatRoomMemberEdge';
                      publisherNode: {
                        __typename?: 'UserNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'CommentEdge';
                      publisherNode: { __typename?: 'CommentNode'; id: string };
                    }
                  | {
                      __typename?: 'EdgeImpl';
                      publisherNode?:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'ChatMessageNode'; id: string }
                        | { __typename?: 'ChatRichEmbedNode'; id: string }
                        | { __typename?: 'ChatRoomNode'; id: string }
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'CustomPage'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'Invite'; id: string }
                        | { __typename?: 'InviteConnection'; id: string }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          }
                        | null;
                    }
                  | {
                      __typename?: 'FeaturedEntityEdge';
                      publisherNode:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'ChatMessageNode'; id: string }
                        | { __typename?: 'ChatRichEmbedNode'; id: string }
                        | { __typename?: 'ChatRoomNode'; id: string }
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'CustomPage'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'Invite'; id: string }
                        | { __typename?: 'InviteConnection'; id: string }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          };
                    }
                  | {
                      __typename?: 'FeedExploreTagEdge';
                      publisherNode: {
                        __typename?: 'FeedExploreTagNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHeaderEdge';
                      publisherNode: {
                        __typename?: 'FeedHeaderNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHighlightsEdge';
                      publisherNode: {
                        __typename?: 'FeedHighlightsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedNoticeEdge';
                      publisherNode: {
                        __typename?: 'FeedNoticeNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GiftCardEdge';
                      publisherNode: {
                        __typename?: 'GiftCardNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GiftCardTransactionEdge';
                      publisherNode: {
                        __typename?: 'GiftCardTransaction';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GroupEdge';
                      publisherNode: {
                        __typename?: 'GroupNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'InviteEdge';
                      publisherNode?: {
                        __typename?: 'Invite';
                        id: string;
                      } | null;
                    }
                  | {
                      __typename?: 'PublisherRecsEdge';
                      publisherNode: {
                        __typename?: 'PublisherRecsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ReportEdge';
                      publisherNode?: {
                        __typename?: 'Report';
                        id: string;
                      } | null;
                    }
                  | {
                      __typename?: 'UserEdge';
                      publisherNode: {
                        __typename?: 'UserNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'UserRoleEdge';
                      publisherNode: {
                        __typename?: 'UserNode';
                        legacy: string;
                        id: string;
                      };
                    }
                >;
                pageInfo: {
                  __typename?: 'PageInfo';
                  hasPreviousPage: boolean;
                  hasNextPage: boolean;
                  startCursor?: string | null;
                  endCursor?: string | null;
                };
              }
            | { __typename?: 'Report'; id: string }
            | { __typename?: 'UserNode'; id: string };
        }
      | {
          __typename?: 'FeedExploreTagEdge';
          cursor: string;
          node: { __typename?: 'FeedExploreTagNode'; tag: string; id: string };
        }
      | {
          __typename?: 'FeedHeaderEdge';
          cursor: string;
          node: { __typename?: 'FeedHeaderNode'; text: string; id: string };
        }
      | {
          __typename?: 'FeedHighlightsEdge';
          cursor: string;
          node: {
            __typename?: 'FeedHighlightsConnection';
            id: string;
            edges: Array<{
              __typename?: 'ActivityEdge';
              node: { __typename?: 'ActivityNode'; id: string; legacy: string };
            }>;
            pageInfo: {
              __typename?: 'PageInfo';
              hasPreviousPage: boolean;
              hasNextPage: boolean;
              startCursor?: string | null;
              endCursor?: string | null;
            };
          };
        }
      | {
          __typename?: 'FeedNoticeEdge';
          cursor: string;
          node: {
            __typename?: 'FeedNoticeNode';
            location: string;
            key: string;
            dismissible: boolean;
            id: string;
          };
        }
      | {
          __typename?: 'GiftCardEdge';
          cursor: string;
          node: { __typename?: 'GiftCardNode'; id: string };
        }
      | {
          __typename?: 'GiftCardTransactionEdge';
          cursor: string;
          node: { __typename?: 'GiftCardTransaction'; id: string };
        }
      | {
          __typename?: 'GroupEdge';
          cursor: string;
          node: { __typename?: 'GroupNode'; id: string };
        }
      | {
          __typename?: 'InviteEdge';
          cursor: string;
          node?: { __typename?: 'Invite'; id: string } | null;
        }
      | {
          __typename?: 'PublisherRecsEdge';
          cursor: string;
          node: {
            __typename?: 'PublisherRecsConnection';
            dismissible: boolean;
            id: string;
            edges: Array<
              | {
                  __typename?: 'ActivityEdge';
                  publisherNode: { __typename?: 'ActivityNode'; id: string };
                }
              | {
                  __typename?: 'AnalyticsTableRowEdge';
                  publisherNode:
                    | { __typename?: 'ActivityNode'; id: string }
                    | {
                        __typename?: 'AnalyticsTableRowActivityNode';
                        id: string;
                      }
                    | { __typename?: 'AnalyticsTableRowGroupNode'; id: string }
                    | { __typename?: 'AnalyticsTableRowUserNode'; id: string }
                    | { __typename?: 'BoostNode'; legacy: string; id: string }
                    | { __typename?: 'ChatMessageNode'; id: string }
                    | { __typename?: 'ChatRichEmbedNode'; id: string }
                    | { __typename?: 'ChatRoomNode'; id: string }
                    | { __typename?: 'CommentNode'; id: string }
                    | { __typename?: 'CustomPage'; id: string }
                    | { __typename?: 'FeaturedEntity'; id: string }
                    | { __typename?: 'FeaturedEntityConnection'; id: string }
                    | { __typename?: 'FeaturedGroup'; id: string }
                    | { __typename?: 'FeaturedUser'; id: string }
                    | { __typename?: 'FeedExploreTagNode'; id: string }
                    | { __typename?: 'FeedHeaderNode'; id: string }
                    | { __typename?: 'FeedHighlightsConnection'; id: string }
                    | { __typename?: 'FeedNoticeNode'; id: string }
                    | { __typename?: 'GiftCardNode'; id: string }
                    | { __typename?: 'GiftCardTransaction'; id: string }
                    | { __typename?: 'GroupNode'; legacy: string; id: string }
                    | { __typename?: 'Invite'; id: string }
                    | { __typename?: 'InviteConnection'; id: string }
                    | { __typename?: 'NodeImpl'; id: string }
                    | { __typename?: 'PublisherRecsConnection'; id: string }
                    | { __typename?: 'Report'; id: string }
                    | { __typename?: 'UserNode'; legacy: string; id: string };
                }
              | {
                  __typename?: 'BoostEdge';
                  publisherNode: {
                    __typename?: 'BoostNode';
                    legacy: string;
                    id: string;
                  };
                }
              | {
                  __typename?: 'ChatMessageEdge';
                  publisherNode: { __typename?: 'ChatMessageNode'; id: string };
                }
              | {
                  __typename?: 'ChatRoomEdge';
                  publisherNode: { __typename?: 'ChatRoomNode'; id: string };
                }
              | {
                  __typename?: 'ChatRoomMemberEdge';
                  publisherNode: {
                    __typename?: 'UserNode';
                    legacy: string;
                    id: string;
                  };
                }
              | {
                  __typename?: 'CommentEdge';
                  publisherNode: { __typename?: 'CommentNode'; id: string };
                }
              | {
                  __typename?: 'EdgeImpl';
                  publisherNode?:
                    | { __typename?: 'ActivityNode'; id: string }
                    | {
                        __typename?: 'AnalyticsTableRowActivityNode';
                        id: string;
                      }
                    | { __typename?: 'AnalyticsTableRowGroupNode'; id: string }
                    | { __typename?: 'AnalyticsTableRowUserNode'; id: string }
                    | { __typename?: 'BoostNode'; legacy: string; id: string }
                    | { __typename?: 'ChatMessageNode'; id: string }
                    | { __typename?: 'ChatRichEmbedNode'; id: string }
                    | { __typename?: 'ChatRoomNode'; id: string }
                    | { __typename?: 'CommentNode'; id: string }
                    | { __typename?: 'CustomPage'; id: string }
                    | { __typename?: 'FeaturedEntity'; id: string }
                    | { __typename?: 'FeaturedEntityConnection'; id: string }
                    | { __typename?: 'FeaturedGroup'; id: string }
                    | { __typename?: 'FeaturedUser'; id: string }
                    | { __typename?: 'FeedExploreTagNode'; id: string }
                    | { __typename?: 'FeedHeaderNode'; id: string }
                    | { __typename?: 'FeedHighlightsConnection'; id: string }
                    | { __typename?: 'FeedNoticeNode'; id: string }
                    | { __typename?: 'GiftCardNode'; id: string }
                    | { __typename?: 'GiftCardTransaction'; id: string }
                    | { __typename?: 'GroupNode'; legacy: string; id: string }
                    | { __typename?: 'Invite'; id: string }
                    | { __typename?: 'InviteConnection'; id: string }
                    | { __typename?: 'NodeImpl'; id: string }
                    | { __typename?: 'PublisherRecsConnection'; id: string }
                    | { __typename?: 'Report'; id: string }
                    | { __typename?: 'UserNode'; legacy: string; id: string }
                    | null;
                }
              | {
                  __typename?: 'FeaturedEntityEdge';
                  publisherNode:
                    | { __typename?: 'ActivityNode'; id: string }
                    | {
                        __typename?: 'AnalyticsTableRowActivityNode';
                        id: string;
                      }
                    | { __typename?: 'AnalyticsTableRowGroupNode'; id: string }
                    | { __typename?: 'AnalyticsTableRowUserNode'; id: string }
                    | { __typename?: 'BoostNode'; legacy: string; id: string }
                    | { __typename?: 'ChatMessageNode'; id: string }
                    | { __typename?: 'ChatRichEmbedNode'; id: string }
                    | { __typename?: 'ChatRoomNode'; id: string }
                    | { __typename?: 'CommentNode'; id: string }
                    | { __typename?: 'CustomPage'; id: string }
                    | { __typename?: 'FeaturedEntity'; id: string }
                    | { __typename?: 'FeaturedEntityConnection'; id: string }
                    | { __typename?: 'FeaturedGroup'; id: string }
                    | { __typename?: 'FeaturedUser'; id: string }
                    | { __typename?: 'FeedExploreTagNode'; id: string }
                    | { __typename?: 'FeedHeaderNode'; id: string }
                    | { __typename?: 'FeedHighlightsConnection'; id: string }
                    | { __typename?: 'FeedNoticeNode'; id: string }
                    | { __typename?: 'GiftCardNode'; id: string }
                    | { __typename?: 'GiftCardTransaction'; id: string }
                    | { __typename?: 'GroupNode'; legacy: string; id: string }
                    | { __typename?: 'Invite'; id: string }
                    | { __typename?: 'InviteConnection'; id: string }
                    | { __typename?: 'NodeImpl'; id: string }
                    | { __typename?: 'PublisherRecsConnection'; id: string }
                    | { __typename?: 'Report'; id: string }
                    | { __typename?: 'UserNode'; legacy: string; id: string };
                }
              | {
                  __typename?: 'FeedExploreTagEdge';
                  publisherNode: {
                    __typename?: 'FeedExploreTagNode';
                    id: string;
                  };
                }
              | {
                  __typename?: 'FeedHeaderEdge';
                  publisherNode: { __typename?: 'FeedHeaderNode'; id: string };
                }
              | {
                  __typename?: 'FeedHighlightsEdge';
                  publisherNode: {
                    __typename?: 'FeedHighlightsConnection';
                    id: string;
                  };
                }
              | {
                  __typename?: 'FeedNoticeEdge';
                  publisherNode: { __typename?: 'FeedNoticeNode'; id: string };
                }
              | {
                  __typename?: 'GiftCardEdge';
                  publisherNode: { __typename?: 'GiftCardNode'; id: string };
                }
              | {
                  __typename?: 'GiftCardTransactionEdge';
                  publisherNode: {
                    __typename?: 'GiftCardTransaction';
                    id: string;
                  };
                }
              | {
                  __typename?: 'GroupEdge';
                  publisherNode: {
                    __typename?: 'GroupNode';
                    legacy: string;
                    id: string;
                  };
                }
              | {
                  __typename?: 'InviteEdge';
                  publisherNode?: { __typename?: 'Invite'; id: string } | null;
                }
              | {
                  __typename?: 'PublisherRecsEdge';
                  publisherNode: {
                    __typename?: 'PublisherRecsConnection';
                    id: string;
                  };
                }
              | {
                  __typename?: 'ReportEdge';
                  publisherNode?: { __typename?: 'Report'; id: string } | null;
                }
              | {
                  __typename?: 'UserEdge';
                  publisherNode: {
                    __typename?: 'UserNode';
                    legacy: string;
                    id: string;
                  };
                }
              | {
                  __typename?: 'UserRoleEdge';
                  publisherNode: {
                    __typename?: 'UserNode';
                    legacy: string;
                    id: string;
                  };
                }
            >;
            pageInfo: {
              __typename?: 'PageInfo';
              hasPreviousPage: boolean;
              hasNextPage: boolean;
              startCursor?: string | null;
              endCursor?: string | null;
            };
          };
        }
      | {
          __typename?: 'ReportEdge';
          cursor: string;
          node?: { __typename?: 'Report'; id: string } | null;
        }
      | {
          __typename?: 'UserEdge';
          cursor: string;
          node: { __typename?: 'UserNode'; id: string };
        }
      | {
          __typename?: 'UserRoleEdge';
          cursor: string;
          node: { __typename?: 'UserNode'; id: string };
        }
    >;
    pageInfo: {
      __typename?: 'PageInfo';
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
};

export type PageInfoFragment = {
  __typename?: 'PageInfo';
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
};

export type GetPostSubscriptionQueryVariables = Exact<{
  entityGuid: Scalars['String']['input'];
}>;

export type GetPostSubscriptionQuery = {
  __typename?: 'Query';
  postSubscription: {
    __typename?: 'PostSubscription';
    userGuid: string;
    entityGuid: string;
    frequency: PostSubscriptionFrequencyEnum;
  };
};

export type UpdatePostSubscriptionsMutationVariables = Exact<{
  entityGuid: Scalars['String']['input'];
  frequency: PostSubscriptionFrequencyEnum;
}>;

export type UpdatePostSubscriptionsMutation = {
  __typename?: 'Mutation';
  updatePostSubscription: {
    __typename?: 'PostSubscription';
    userGuid: string;
    entityGuid: string;
    frequency: PostSubscriptionFrequencyEnum;
  };
};

export type CompleteOnboardingStepMutationVariables = Exact<{
  stepKey: Scalars['String']['input'];
  stepType: Scalars['String']['input'];
  additionalData?: InputMaybe<Array<KeyValuePairInput> | KeyValuePairInput>;
}>;

export type CompleteOnboardingStepMutation = {
  __typename?: 'Mutation';
  completeOnboardingStep: {
    __typename?: 'OnboardingStepProgressState';
    userGuid?: string | null;
    stepKey: string;
    stepType: string;
    completedAt?: number | null;
  };
};

export type GetOnboardingStateQueryVariables = Exact<{ [key: string]: never }>;

export type GetOnboardingStateQuery = {
  __typename?: 'Query';
  onboardingState?: {
    __typename?: 'OnboardingState';
    userGuid?: string | null;
    startedAt: number;
    completedAt?: number | null;
  } | null;
};

export type GetOnboardingStepProgressQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetOnboardingStepProgressQuery = {
  __typename?: 'Query';
  onboardingStepProgress: Array<{
    __typename?: 'OnboardingStepProgressState';
    userGuid?: string | null;
    stepKey: string;
    stepType: string;
    completedAt?: number | null;
  }>;
};

export type SetOnboardingStateMutationVariables = Exact<{
  completed: Scalars['Boolean']['input'];
}>;

export type SetOnboardingStateMutation = {
  __typename?: 'Mutation';
  setOnboardingState: {
    __typename?: 'OnboardingState';
    userGuid?: string | null;
    startedAt: number;
    completedAt?: number | null;
  };
};

export type FetchPaymentMethodsQueryVariables = Exact<{
  giftCardProductId?: InputMaybe<GiftCardProductIdEnum>;
}>;

export type FetchPaymentMethodsQuery = {
  __typename?: 'Query';
  paymentMethods: Array<{
    __typename?: 'PaymentMethod';
    id: string;
    name: string;
    balance?: number | null;
  }>;
};

export type FetchSearchQueryVariables = Exact<{
  query: Scalars['String']['input'];
  filter: SearchFilterEnum;
  mediaType: SearchMediaTypeEnum;
  nsfw?: InputMaybe<Array<SearchNsfwEnum> | SearchNsfwEnum>;
  limit: Scalars['Int']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
}>;

export type FetchSearchQuery = {
  __typename?: 'Query';
  search: {
    __typename?: 'SearchResultsConnection';
    edges: Array<
      | {
          __typename?: 'ActivityEdge';
          cursor: string;
          node: { __typename?: 'ActivityNode'; legacy: string; id: string };
        }
      | {
          __typename?: 'AnalyticsTableRowEdge';
          cursor: string;
          node:
            | { __typename?: 'ActivityNode'; legacy: string; id: string }
            | { __typename?: 'AnalyticsTableRowActivityNode'; id: string }
            | { __typename?: 'AnalyticsTableRowGroupNode'; id: string }
            | { __typename?: 'AnalyticsTableRowUserNode'; id: string }
            | {
                __typename?: 'BoostNode';
                goalButtonUrl?: string | null;
                goalButtonText?: number | null;
                legacy: string;
                id: string;
              }
            | { __typename?: 'ChatMessageNode'; id: string }
            | { __typename?: 'ChatRichEmbedNode'; id: string }
            | { __typename?: 'ChatRoomNode'; id: string }
            | { __typename?: 'CommentNode'; id: string }
            | { __typename?: 'CustomPage'; id: string }
            | { __typename?: 'FeaturedEntity'; id: string }
            | { __typename?: 'FeaturedEntityConnection'; id: string }
            | { __typename?: 'FeaturedGroup'; id: string }
            | { __typename?: 'FeaturedUser'; id: string }
            | { __typename?: 'FeedExploreTagNode'; id: string }
            | { __typename?: 'FeedHeaderNode'; id: string }
            | { __typename?: 'FeedHighlightsConnection'; id: string }
            | {
                __typename?: 'FeedNoticeNode';
                location: string;
                key: string;
                id: string;
              }
            | { __typename?: 'GiftCardNode'; id: string }
            | { __typename?: 'GiftCardTransaction'; id: string }
            | { __typename?: 'GroupNode'; legacy: string; id: string }
            | { __typename?: 'Invite'; id: string }
            | { __typename?: 'InviteConnection'; id: string }
            | { __typename?: 'NodeImpl'; id: string }
            | {
                __typename?: 'PublisherRecsConnection';
                id: string;
                edges: Array<
                  | {
                      __typename?: 'ActivityEdge';
                      publisherNode: {
                        __typename?: 'ActivityNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'AnalyticsTableRowEdge';
                      publisherNode:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'ChatMessageNode'; id: string }
                        | { __typename?: 'ChatRichEmbedNode'; id: string }
                        | { __typename?: 'ChatRoomNode'; id: string }
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'CustomPage'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'Invite'; id: string }
                        | { __typename?: 'InviteConnection'; id: string }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          };
                    }
                  | {
                      __typename?: 'BoostEdge';
                      publisherNode: {
                        __typename?: 'BoostNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatMessageEdge';
                      publisherNode: {
                        __typename?: 'ChatMessageNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatRoomEdge';
                      publisherNode: {
                        __typename?: 'ChatRoomNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatRoomMemberEdge';
                      publisherNode: {
                        __typename?: 'UserNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'CommentEdge';
                      publisherNode: { __typename?: 'CommentNode'; id: string };
                    }
                  | {
                      __typename?: 'EdgeImpl';
                      publisherNode?:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'ChatMessageNode'; id: string }
                        | { __typename?: 'ChatRichEmbedNode'; id: string }
                        | { __typename?: 'ChatRoomNode'; id: string }
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'CustomPage'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'Invite'; id: string }
                        | { __typename?: 'InviteConnection'; id: string }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          }
                        | null;
                    }
                  | {
                      __typename?: 'FeaturedEntityEdge';
                      publisherNode:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'ChatMessageNode'; id: string }
                        | { __typename?: 'ChatRichEmbedNode'; id: string }
                        | { __typename?: 'ChatRoomNode'; id: string }
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'CustomPage'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'Invite'; id: string }
                        | { __typename?: 'InviteConnection'; id: string }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          };
                    }
                  | {
                      __typename?: 'FeedExploreTagEdge';
                      publisherNode: {
                        __typename?: 'FeedExploreTagNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHeaderEdge';
                      publisherNode: {
                        __typename?: 'FeedHeaderNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHighlightsEdge';
                      publisherNode: {
                        __typename?: 'FeedHighlightsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedNoticeEdge';
                      publisherNode: {
                        __typename?: 'FeedNoticeNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GiftCardEdge';
                      publisherNode: {
                        __typename?: 'GiftCardNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GiftCardTransactionEdge';
                      publisherNode: {
                        __typename?: 'GiftCardTransaction';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GroupEdge';
                      publisherNode: {
                        __typename?: 'GroupNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'InviteEdge';
                      publisherNode?: {
                        __typename?: 'Invite';
                        id: string;
                      } | null;
                    }
                  | {
                      __typename?: 'PublisherRecsEdge';
                      publisherNode: {
                        __typename?: 'PublisherRecsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ReportEdge';
                      publisherNode?: {
                        __typename?: 'Report';
                        id: string;
                      } | null;
                    }
                  | {
                      __typename?: 'UserEdge';
                      publisherNode: {
                        __typename?: 'UserNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'UserRoleEdge';
                      publisherNode: {
                        __typename?: 'UserNode';
                        legacy: string;
                        id: string;
                      };
                    }
                >;
                pageInfo: {
                  __typename?: 'PageInfo';
                  hasPreviousPage: boolean;
                  hasNextPage: boolean;
                  startCursor?: string | null;
                  endCursor?: string | null;
                };
              }
            | { __typename?: 'Report'; id: string }
            | { __typename?: 'UserNode'; legacy: string; id: string };
        }
      | {
          __typename?: 'BoostEdge';
          cursor: string;
          node: {
            __typename?: 'BoostNode';
            goalButtonUrl?: string | null;
            goalButtonText?: number | null;
            legacy: string;
            id: string;
          };
        }
      | {
          __typename?: 'ChatMessageEdge';
          cursor: string;
          node: { __typename?: 'ChatMessageNode'; id: string };
        }
      | {
          __typename?: 'ChatRoomEdge';
          cursor: string;
          node: { __typename?: 'ChatRoomNode'; id: string };
        }
      | {
          __typename?: 'ChatRoomMemberEdge';
          cursor: string;
          node: { __typename?: 'UserNode'; legacy: string; id: string };
        }
      | {
          __typename?: 'CommentEdge';
          cursor: string;
          node: { __typename?: 'CommentNode'; id: string };
        }
      | {
          __typename?: 'EdgeImpl';
          cursor: string;
          node?:
            | { __typename?: 'ActivityNode'; legacy: string; id: string }
            | { __typename?: 'AnalyticsTableRowActivityNode'; id: string }
            | { __typename?: 'AnalyticsTableRowGroupNode'; id: string }
            | { __typename?: 'AnalyticsTableRowUserNode'; id: string }
            | {
                __typename?: 'BoostNode';
                goalButtonUrl?: string | null;
                goalButtonText?: number | null;
                legacy: string;
                id: string;
              }
            | { __typename?: 'ChatMessageNode'; id: string }
            | { __typename?: 'ChatRichEmbedNode'; id: string }
            | { __typename?: 'ChatRoomNode'; id: string }
            | { __typename?: 'CommentNode'; id: string }
            | { __typename?: 'CustomPage'; id: string }
            | { __typename?: 'FeaturedEntity'; id: string }
            | { __typename?: 'FeaturedEntityConnection'; id: string }
            | { __typename?: 'FeaturedGroup'; id: string }
            | { __typename?: 'FeaturedUser'; id: string }
            | { __typename?: 'FeedExploreTagNode'; id: string }
            | { __typename?: 'FeedHeaderNode'; id: string }
            | { __typename?: 'FeedHighlightsConnection'; id: string }
            | {
                __typename?: 'FeedNoticeNode';
                location: string;
                key: string;
                id: string;
              }
            | { __typename?: 'GiftCardNode'; id: string }
            | { __typename?: 'GiftCardTransaction'; id: string }
            | { __typename?: 'GroupNode'; legacy: string; id: string }
            | { __typename?: 'Invite'; id: string }
            | { __typename?: 'InviteConnection'; id: string }
            | { __typename?: 'NodeImpl'; id: string }
            | {
                __typename?: 'PublisherRecsConnection';
                id: string;
                edges: Array<
                  | {
                      __typename?: 'ActivityEdge';
                      publisherNode: {
                        __typename?: 'ActivityNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'AnalyticsTableRowEdge';
                      publisherNode:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'ChatMessageNode'; id: string }
                        | { __typename?: 'ChatRichEmbedNode'; id: string }
                        | { __typename?: 'ChatRoomNode'; id: string }
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'CustomPage'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'Invite'; id: string }
                        | { __typename?: 'InviteConnection'; id: string }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          };
                    }
                  | {
                      __typename?: 'BoostEdge';
                      publisherNode: {
                        __typename?: 'BoostNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatMessageEdge';
                      publisherNode: {
                        __typename?: 'ChatMessageNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatRoomEdge';
                      publisherNode: {
                        __typename?: 'ChatRoomNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatRoomMemberEdge';
                      publisherNode: {
                        __typename?: 'UserNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'CommentEdge';
                      publisherNode: { __typename?: 'CommentNode'; id: string };
                    }
                  | {
                      __typename?: 'EdgeImpl';
                      publisherNode?:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'ChatMessageNode'; id: string }
                        | { __typename?: 'ChatRichEmbedNode'; id: string }
                        | { __typename?: 'ChatRoomNode'; id: string }
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'CustomPage'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'Invite'; id: string }
                        | { __typename?: 'InviteConnection'; id: string }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          }
                        | null;
                    }
                  | {
                      __typename?: 'FeaturedEntityEdge';
                      publisherNode:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'ChatMessageNode'; id: string }
                        | { __typename?: 'ChatRichEmbedNode'; id: string }
                        | { __typename?: 'ChatRoomNode'; id: string }
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'CustomPage'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'Invite'; id: string }
                        | { __typename?: 'InviteConnection'; id: string }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          };
                    }
                  | {
                      __typename?: 'FeedExploreTagEdge';
                      publisherNode: {
                        __typename?: 'FeedExploreTagNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHeaderEdge';
                      publisherNode: {
                        __typename?: 'FeedHeaderNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHighlightsEdge';
                      publisherNode: {
                        __typename?: 'FeedHighlightsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedNoticeEdge';
                      publisherNode: {
                        __typename?: 'FeedNoticeNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GiftCardEdge';
                      publisherNode: {
                        __typename?: 'GiftCardNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GiftCardTransactionEdge';
                      publisherNode: {
                        __typename?: 'GiftCardTransaction';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GroupEdge';
                      publisherNode: {
                        __typename?: 'GroupNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'InviteEdge';
                      publisherNode?: {
                        __typename?: 'Invite';
                        id: string;
                      } | null;
                    }
                  | {
                      __typename?: 'PublisherRecsEdge';
                      publisherNode: {
                        __typename?: 'PublisherRecsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ReportEdge';
                      publisherNode?: {
                        __typename?: 'Report';
                        id: string;
                      } | null;
                    }
                  | {
                      __typename?: 'UserEdge';
                      publisherNode: {
                        __typename?: 'UserNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'UserRoleEdge';
                      publisherNode: {
                        __typename?: 'UserNode';
                        legacy: string;
                        id: string;
                      };
                    }
                >;
                pageInfo: {
                  __typename?: 'PageInfo';
                  hasPreviousPage: boolean;
                  hasNextPage: boolean;
                  startCursor?: string | null;
                  endCursor?: string | null;
                };
              }
            | { __typename?: 'Report'; id: string }
            | { __typename?: 'UserNode'; legacy: string; id: string }
            | null;
        }
      | {
          __typename?: 'FeaturedEntityEdge';
          cursor: string;
          node:
            | { __typename?: 'ActivityNode'; legacy: string; id: string }
            | { __typename?: 'AnalyticsTableRowActivityNode'; id: string }
            | { __typename?: 'AnalyticsTableRowGroupNode'; id: string }
            | { __typename?: 'AnalyticsTableRowUserNode'; id: string }
            | {
                __typename?: 'BoostNode';
                goalButtonUrl?: string | null;
                goalButtonText?: number | null;
                legacy: string;
                id: string;
              }
            | { __typename?: 'ChatMessageNode'; id: string }
            | { __typename?: 'ChatRichEmbedNode'; id: string }
            | { __typename?: 'ChatRoomNode'; id: string }
            | { __typename?: 'CommentNode'; id: string }
            | { __typename?: 'CustomPage'; id: string }
            | { __typename?: 'FeaturedEntity'; id: string }
            | { __typename?: 'FeaturedEntityConnection'; id: string }
            | { __typename?: 'FeaturedGroup'; id: string }
            | { __typename?: 'FeaturedUser'; id: string }
            | { __typename?: 'FeedExploreTagNode'; id: string }
            | { __typename?: 'FeedHeaderNode'; id: string }
            | { __typename?: 'FeedHighlightsConnection'; id: string }
            | {
                __typename?: 'FeedNoticeNode';
                location: string;
                key: string;
                id: string;
              }
            | { __typename?: 'GiftCardNode'; id: string }
            | { __typename?: 'GiftCardTransaction'; id: string }
            | { __typename?: 'GroupNode'; legacy: string; id: string }
            | { __typename?: 'Invite'; id: string }
            | { __typename?: 'InviteConnection'; id: string }
            | { __typename?: 'NodeImpl'; id: string }
            | {
                __typename?: 'PublisherRecsConnection';
                id: string;
                edges: Array<
                  | {
                      __typename?: 'ActivityEdge';
                      publisherNode: {
                        __typename?: 'ActivityNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'AnalyticsTableRowEdge';
                      publisherNode:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'ChatMessageNode'; id: string }
                        | { __typename?: 'ChatRichEmbedNode'; id: string }
                        | { __typename?: 'ChatRoomNode'; id: string }
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'CustomPage'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'Invite'; id: string }
                        | { __typename?: 'InviteConnection'; id: string }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          };
                    }
                  | {
                      __typename?: 'BoostEdge';
                      publisherNode: {
                        __typename?: 'BoostNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatMessageEdge';
                      publisherNode: {
                        __typename?: 'ChatMessageNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatRoomEdge';
                      publisherNode: {
                        __typename?: 'ChatRoomNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ChatRoomMemberEdge';
                      publisherNode: {
                        __typename?: 'UserNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'CommentEdge';
                      publisherNode: { __typename?: 'CommentNode'; id: string };
                    }
                  | {
                      __typename?: 'EdgeImpl';
                      publisherNode?:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'ChatMessageNode'; id: string }
                        | { __typename?: 'ChatRichEmbedNode'; id: string }
                        | { __typename?: 'ChatRoomNode'; id: string }
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'CustomPage'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'Invite'; id: string }
                        | { __typename?: 'InviteConnection'; id: string }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          }
                        | null;
                    }
                  | {
                      __typename?: 'FeaturedEntityEdge';
                      publisherNode:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'AnalyticsTableRowActivityNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowGroupNode';
                            id: string;
                          }
                        | {
                            __typename?: 'AnalyticsTableRowUserNode';
                            id: string;
                          }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'ChatMessageNode'; id: string }
                        | { __typename?: 'ChatRichEmbedNode'; id: string }
                        | { __typename?: 'ChatRoomNode'; id: string }
                        | { __typename?: 'CommentNode'; id: string }
                        | { __typename?: 'CustomPage'; id: string }
                        | { __typename?: 'FeaturedEntity'; id: string }
                        | {
                            __typename?: 'FeaturedEntityConnection';
                            id: string;
                          }
                        | { __typename?: 'FeaturedGroup'; id: string }
                        | { __typename?: 'FeaturedUser'; id: string }
                        | { __typename?: 'FeedExploreTagNode'; id: string }
                        | { __typename?: 'FeedHeaderNode'; id: string }
                        | {
                            __typename?: 'FeedHighlightsConnection';
                            id: string;
                          }
                        | { __typename?: 'FeedNoticeNode'; id: string }
                        | { __typename?: 'GiftCardNode'; id: string }
                        | { __typename?: 'GiftCardTransaction'; id: string }
                        | {
                            __typename?: 'GroupNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'Invite'; id: string }
                        | { __typename?: 'InviteConnection'; id: string }
                        | { __typename?: 'NodeImpl'; id: string }
                        | { __typename?: 'PublisherRecsConnection'; id: string }
                        | { __typename?: 'Report'; id: string }
                        | {
                            __typename?: 'UserNode';
                            legacy: string;
                            id: string;
                          };
                    }
                  | {
                      __typename?: 'FeedExploreTagEdge';
                      publisherNode: {
                        __typename?: 'FeedExploreTagNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHeaderEdge';
                      publisherNode: {
                        __typename?: 'FeedHeaderNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedHighlightsEdge';
                      publisherNode: {
                        __typename?: 'FeedHighlightsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'FeedNoticeEdge';
                      publisherNode: {
                        __typename?: 'FeedNoticeNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GiftCardEdge';
                      publisherNode: {
                        __typename?: 'GiftCardNode';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GiftCardTransactionEdge';
                      publisherNode: {
                        __typename?: 'GiftCardTransaction';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'GroupEdge';
                      publisherNode: {
                        __typename?: 'GroupNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'InviteEdge';
                      publisherNode?: {
                        __typename?: 'Invite';
                        id: string;
                      } | null;
                    }
                  | {
                      __typename?: 'PublisherRecsEdge';
                      publisherNode: {
                        __typename?: 'PublisherRecsConnection';
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'ReportEdge';
                      publisherNode?: {
                        __typename?: 'Report';
                        id: string;
                      } | null;
                    }
                  | {
                      __typename?: 'UserEdge';
                      publisherNode: {
                        __typename?: 'UserNode';
                        legacy: string;
                        id: string;
                      };
                    }
                  | {
                      __typename?: 'UserRoleEdge';
                      publisherNode: {
                        __typename?: 'UserNode';
                        legacy: string;
                        id: string;
                      };
                    }
                >;
                pageInfo: {
                  __typename?: 'PageInfo';
                  hasPreviousPage: boolean;
                  hasNextPage: boolean;
                  startCursor?: string | null;
                  endCursor?: string | null;
                };
              }
            | { __typename?: 'Report'; id: string }
            | { __typename?: 'UserNode'; legacy: string; id: string };
        }
      | {
          __typename?: 'FeedExploreTagEdge';
          cursor: string;
          node: { __typename?: 'FeedExploreTagNode'; id: string };
        }
      | {
          __typename?: 'FeedHeaderEdge';
          cursor: string;
          node: { __typename?: 'FeedHeaderNode'; id: string };
        }
      | {
          __typename?: 'FeedHighlightsEdge';
          cursor: string;
          node: { __typename?: 'FeedHighlightsConnection'; id: string };
        }
      | {
          __typename?: 'FeedNoticeEdge';
          cursor: string;
          node: {
            __typename?: 'FeedNoticeNode';
            location: string;
            key: string;
            id: string;
          };
        }
      | {
          __typename?: 'GiftCardEdge';
          cursor: string;
          node: { __typename?: 'GiftCardNode'; id: string };
        }
      | {
          __typename?: 'GiftCardTransactionEdge';
          cursor: string;
          node: { __typename?: 'GiftCardTransaction'; id: string };
        }
      | {
          __typename?: 'GroupEdge';
          cursor: string;
          node: { __typename?: 'GroupNode'; legacy: string; id: string };
        }
      | {
          __typename?: 'InviteEdge';
          cursor: string;
          node?: { __typename?: 'Invite'; id: string } | null;
        }
      | {
          __typename?: 'PublisherRecsEdge';
          cursor: string;
          node: {
            __typename?: 'PublisherRecsConnection';
            id: string;
            edges: Array<
              | {
                  __typename?: 'ActivityEdge';
                  publisherNode: { __typename?: 'ActivityNode'; id: string };
                }
              | {
                  __typename?: 'AnalyticsTableRowEdge';
                  publisherNode:
                    | { __typename?: 'ActivityNode'; id: string }
                    | {
                        __typename?: 'AnalyticsTableRowActivityNode';
                        id: string;
                      }
                    | { __typename?: 'AnalyticsTableRowGroupNode'; id: string }
                    | { __typename?: 'AnalyticsTableRowUserNode'; id: string }
                    | { __typename?: 'BoostNode'; legacy: string; id: string }
                    | { __typename?: 'ChatMessageNode'; id: string }
                    | { __typename?: 'ChatRichEmbedNode'; id: string }
                    | { __typename?: 'ChatRoomNode'; id: string }
                    | { __typename?: 'CommentNode'; id: string }
                    | { __typename?: 'CustomPage'; id: string }
                    | { __typename?: 'FeaturedEntity'; id: string }
                    | { __typename?: 'FeaturedEntityConnection'; id: string }
                    | { __typename?: 'FeaturedGroup'; id: string }
                    | { __typename?: 'FeaturedUser'; id: string }
                    | { __typename?: 'FeedExploreTagNode'; id: string }
                    | { __typename?: 'FeedHeaderNode'; id: string }
                    | { __typename?: 'FeedHighlightsConnection'; id: string }
                    | { __typename?: 'FeedNoticeNode'; id: string }
                    | { __typename?: 'GiftCardNode'; id: string }
                    | { __typename?: 'GiftCardTransaction'; id: string }
                    | { __typename?: 'GroupNode'; legacy: string; id: string }
                    | { __typename?: 'Invite'; id: string }
                    | { __typename?: 'InviteConnection'; id: string }
                    | { __typename?: 'NodeImpl'; id: string }
                    | { __typename?: 'PublisherRecsConnection'; id: string }
                    | { __typename?: 'Report'; id: string }
                    | { __typename?: 'UserNode'; legacy: string; id: string };
                }
              | {
                  __typename?: 'BoostEdge';
                  publisherNode: {
                    __typename?: 'BoostNode';
                    legacy: string;
                    id: string;
                  };
                }
              | {
                  __typename?: 'ChatMessageEdge';
                  publisherNode: { __typename?: 'ChatMessageNode'; id: string };
                }
              | {
                  __typename?: 'ChatRoomEdge';
                  publisherNode: { __typename?: 'ChatRoomNode'; id: string };
                }
              | {
                  __typename?: 'ChatRoomMemberEdge';
                  publisherNode: {
                    __typename?: 'UserNode';
                    legacy: string;
                    id: string;
                  };
                }
              | {
                  __typename?: 'CommentEdge';
                  publisherNode: { __typename?: 'CommentNode'; id: string };
                }
              | {
                  __typename?: 'EdgeImpl';
                  publisherNode?:
                    | { __typename?: 'ActivityNode'; id: string }
                    | {
                        __typename?: 'AnalyticsTableRowActivityNode';
                        id: string;
                      }
                    | { __typename?: 'AnalyticsTableRowGroupNode'; id: string }
                    | { __typename?: 'AnalyticsTableRowUserNode'; id: string }
                    | { __typename?: 'BoostNode'; legacy: string; id: string }
                    | { __typename?: 'ChatMessageNode'; id: string }
                    | { __typename?: 'ChatRichEmbedNode'; id: string }
                    | { __typename?: 'ChatRoomNode'; id: string }
                    | { __typename?: 'CommentNode'; id: string }
                    | { __typename?: 'CustomPage'; id: string }
                    | { __typename?: 'FeaturedEntity'; id: string }
                    | { __typename?: 'FeaturedEntityConnection'; id: string }
                    | { __typename?: 'FeaturedGroup'; id: string }
                    | { __typename?: 'FeaturedUser'; id: string }
                    | { __typename?: 'FeedExploreTagNode'; id: string }
                    | { __typename?: 'FeedHeaderNode'; id: string }
                    | { __typename?: 'FeedHighlightsConnection'; id: string }
                    | { __typename?: 'FeedNoticeNode'; id: string }
                    | { __typename?: 'GiftCardNode'; id: string }
                    | { __typename?: 'GiftCardTransaction'; id: string }
                    | { __typename?: 'GroupNode'; legacy: string; id: string }
                    | { __typename?: 'Invite'; id: string }
                    | { __typename?: 'InviteConnection'; id: string }
                    | { __typename?: 'NodeImpl'; id: string }
                    | { __typename?: 'PublisherRecsConnection'; id: string }
                    | { __typename?: 'Report'; id: string }
                    | { __typename?: 'UserNode'; legacy: string; id: string }
                    | null;
                }
              | {
                  __typename?: 'FeaturedEntityEdge';
                  publisherNode:
                    | { __typename?: 'ActivityNode'; id: string }
                    | {
                        __typename?: 'AnalyticsTableRowActivityNode';
                        id: string;
                      }
                    | { __typename?: 'AnalyticsTableRowGroupNode'; id: string }
                    | { __typename?: 'AnalyticsTableRowUserNode'; id: string }
                    | { __typename?: 'BoostNode'; legacy: string; id: string }
                    | { __typename?: 'ChatMessageNode'; id: string }
                    | { __typename?: 'ChatRichEmbedNode'; id: string }
                    | { __typename?: 'ChatRoomNode'; id: string }
                    | { __typename?: 'CommentNode'; id: string }
                    | { __typename?: 'CustomPage'; id: string }
                    | { __typename?: 'FeaturedEntity'; id: string }
                    | { __typename?: 'FeaturedEntityConnection'; id: string }
                    | { __typename?: 'FeaturedGroup'; id: string }
                    | { __typename?: 'FeaturedUser'; id: string }
                    | { __typename?: 'FeedExploreTagNode'; id: string }
                    | { __typename?: 'FeedHeaderNode'; id: string }
                    | { __typename?: 'FeedHighlightsConnection'; id: string }
                    | { __typename?: 'FeedNoticeNode'; id: string }
                    | { __typename?: 'GiftCardNode'; id: string }
                    | { __typename?: 'GiftCardTransaction'; id: string }
                    | { __typename?: 'GroupNode'; legacy: string; id: string }
                    | { __typename?: 'Invite'; id: string }
                    | { __typename?: 'InviteConnection'; id: string }
                    | { __typename?: 'NodeImpl'; id: string }
                    | { __typename?: 'PublisherRecsConnection'; id: string }
                    | { __typename?: 'Report'; id: string }
                    | { __typename?: 'UserNode'; legacy: string; id: string };
                }
              | {
                  __typename?: 'FeedExploreTagEdge';
                  publisherNode: {
                    __typename?: 'FeedExploreTagNode';
                    id: string;
                  };
                }
              | {
                  __typename?: 'FeedHeaderEdge';
                  publisherNode: { __typename?: 'FeedHeaderNode'; id: string };
                }
              | {
                  __typename?: 'FeedHighlightsEdge';
                  publisherNode: {
                    __typename?: 'FeedHighlightsConnection';
                    id: string;
                  };
                }
              | {
                  __typename?: 'FeedNoticeEdge';
                  publisherNode: { __typename?: 'FeedNoticeNode'; id: string };
                }
              | {
                  __typename?: 'GiftCardEdge';
                  publisherNode: { __typename?: 'GiftCardNode'; id: string };
                }
              | {
                  __typename?: 'GiftCardTransactionEdge';
                  publisherNode: {
                    __typename?: 'GiftCardTransaction';
                    id: string;
                  };
                }
              | {
                  __typename?: 'GroupEdge';
                  publisherNode: {
                    __typename?: 'GroupNode';
                    legacy: string;
                    id: string;
                  };
                }
              | {
                  __typename?: 'InviteEdge';
                  publisherNode?: { __typename?: 'Invite'; id: string } | null;
                }
              | {
                  __typename?: 'PublisherRecsEdge';
                  publisherNode: {
                    __typename?: 'PublisherRecsConnection';
                    id: string;
                  };
                }
              | {
                  __typename?: 'ReportEdge';
                  publisherNode?: { __typename?: 'Report'; id: string } | null;
                }
              | {
                  __typename?: 'UserEdge';
                  publisherNode: {
                    __typename?: 'UserNode';
                    legacy: string;
                    id: string;
                  };
                }
              | {
                  __typename?: 'UserRoleEdge';
                  publisherNode: {
                    __typename?: 'UserNode';
                    legacy: string;
                    id: string;
                  };
                }
            >;
            pageInfo: {
              __typename?: 'PageInfo';
              hasPreviousPage: boolean;
              hasNextPage: boolean;
              startCursor?: string | null;
              endCursor?: string | null;
            };
          };
        }
      | {
          __typename?: 'ReportEdge';
          cursor: string;
          node?: { __typename?: 'Report'; id: string } | null;
        }
      | {
          __typename?: 'UserEdge';
          cursor: string;
          node: { __typename?: 'UserNode'; legacy: string; id: string };
        }
      | {
          __typename?: 'UserRoleEdge';
          cursor: string;
          node: { __typename?: 'UserNode'; legacy: string; id: string };
        }
    >;
    pageInfo: {
      __typename?: 'PageInfo';
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
};

export type CountSearchQueryVariables = Exact<{
  query: Scalars['String']['input'];
  filter: SearchFilterEnum;
  mediaType: SearchMediaTypeEnum;
  nsfw?: InputMaybe<Array<SearchNsfwEnum> | SearchNsfwEnum>;
  cursor?: InputMaybe<Scalars['String']['input']>;
}>;

export type CountSearchQuery = {
  __typename?: 'Query';
  search: {
    __typename?: 'SearchResultsConnection';
    count: number;
    pageInfo: {
      __typename?: 'PageInfo';
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
};

export type DeletePostHogPersonMutationVariables = Exact<{
  [key: string]: never;
}>;

export type DeletePostHogPersonMutation = {
  __typename?: 'Mutation';
  deletePostHogPerson: boolean;
};

export type FetchEmbeddedCommentsSettingsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type FetchEmbeddedCommentsSettingsQuery = {
  __typename?: 'Query';
  embeddedCommentsSettings?: {
    __typename?: 'EmbeddedCommentsSettings';
    domain: string;
    pathRegex: string;
    autoImportsEnabled: boolean;
  } | null;
};

export type SetEmbeddedCommentsSettingsMutationVariables = Exact<{
  domain: Scalars['String']['input'];
  pathRegex: Scalars['String']['input'];
  autoImportsEnabled: Scalars['Boolean']['input'];
}>;

export type SetEmbeddedCommentsSettingsMutation = {
  __typename?: 'Mutation';
  setEmbeddedCommentsSettings: {
    __typename?: 'EmbeddedCommentsSettings';
    domain: string;
    pathRegex: string;
    autoImportsEnabled: boolean;
  };
};

export type CreateRssFeedMutationVariables = Exact<{
  input: RssFeedInput;
}>;

export type CreateRssFeedMutation = {
  __typename?: 'Mutation';
  createRssFeed: {
    __typename?: 'RssFeed';
    feedId: string;
    title: string;
    url: string;
    createdAtTimestamp?: number | null;
    lastFetchAtTimestamp?: number | null;
    lastFetchStatus?: RssFeedLastFetchStatusEnum | null;
  };
};

export type FetchRssFeedsQueryVariables = Exact<{ [key: string]: never }>;

export type FetchRssFeedsQuery = {
  __typename?: 'Query';
  rssFeeds: Array<{
    __typename?: 'RssFeed';
    feedId: string;
    title: string;
    url: string;
    createdAtTimestamp?: number | null;
    lastFetchAtTimestamp?: number | null;
    lastFetchStatus?: RssFeedLastFetchStatusEnum | null;
  }>;
};

export type RefreshRssFeedMutationVariables = Exact<{
  feedId: Scalars['String']['input'];
}>;

export type RefreshRssFeedMutation = {
  __typename?: 'Mutation';
  refreshRssFeed: {
    __typename?: 'RssFeed';
    feedId: string;
    title: string;
    url: string;
    createdAtTimestamp?: number | null;
    lastFetchAtTimestamp?: number | null;
    lastFetchStatus?: RssFeedLastFetchStatusEnum | null;
  };
};

export type RemoveRssFeedMutationVariables = Exact<{
  feedId: Scalars['String']['input'];
}>;

export type RemoveRssFeedMutation = {
  __typename?: 'Mutation';
  removeRssFeed?: any | null;
};

export type CreatePersonalApiKeyMutationVariables = Exact<{
  name: Scalars['String']['input'];
  scopes: Array<ApiScopeEnum> | ApiScopeEnum;
  expireInDays?: InputMaybe<Scalars['Int']['input']>;
}>;

export type CreatePersonalApiKeyMutation = {
  __typename?: 'Mutation';
  createPersonalApiKey: {
    __typename?: 'PersonalApiKey';
    secret: string;
    id: string;
    name: string;
    scopes: Array<ApiScopeEnum>;
    timeCreated: any;
    timeExpires?: any | null;
  };
};

export type DeletePersonalApiKeyMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type DeletePersonalApiKeyMutation = {
  __typename?: 'Mutation';
  deletePersonalApiKey: boolean;
};

export type GetPersonalApiKeysQueryVariables = Exact<{ [key: string]: never }>;

export type GetPersonalApiKeysQuery = {
  __typename?: 'Query';
  listPersonalApiKeys: Array<{
    __typename?: 'PersonalApiKey';
    secret: string;
    id: string;
    name: string;
    scopes: Array<ApiScopeEnum>;
    timeCreated: any;
    timeExpires?: any | null;
  }>;
};

export type GetSiteMembershipsAndSubscriptionsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetSiteMembershipsAndSubscriptionsQuery = {
  __typename?: 'Query';
  siteMemberships: Array<{
    __typename?: 'SiteMembership';
    id: string;
    membershipGuid: string;
    membershipName: string;
    membershipDescription?: string | null;
    membershipPriceInCents: number;
    priceCurrency: string;
    membershipBillingPeriod: SiteMembershipBillingPeriodEnum;
    membershipPricingModel: SiteMembershipPricingModelEnum;
    isExternal: boolean;
    purchaseUrl?: string | null;
    manageUrl?: string | null;
    roles?: Array<{ __typename?: 'Role'; id: number; name: string }> | null;
    groups?: Array<{
      __typename?: 'GroupNode';
      guid: string;
      name: string;
      membersCount: number;
      legacy: string;
    }> | null;
  }>;
  siteMembershipSubscriptions: Array<{
    __typename?: 'SiteMembershipSubscription';
    membershipGuid: string;
    membershipSubscriptionId: number;
    autoRenew: boolean;
    isManual: boolean;
    validFromTimestamp?: number | null;
    validToTimestamp?: number | null;
  }>;
};

export type GetSiteMembershipSubscriptionsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetSiteMembershipSubscriptionsQuery = {
  __typename?: 'Query';
  siteMembershipSubscriptions: Array<{
    __typename?: 'SiteMembershipSubscription';
    membershipGuid: string;
    membershipSubscriptionId: number;
    autoRenew: boolean;
    validFromTimestamp?: number | null;
    validToTimestamp?: number | null;
  }>;
};

export const PageInfoFragmentDoc = gql`
  fragment PageInfo on PageInfo {
    hasPreviousPage
    hasNextPage
    startCursor
    endCursor
  }
`;
export const DismissDocument = gql`
  mutation Dismiss($key: String!) {
    dismiss(key: $key) {
      userGuid
      key
      dismissalTimestamp
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DismissGQL extends Apollo.Mutation<
  DismissMutation,
  DismissMutationVariables
> {
  document = DismissDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetDismissalByKeyDocument = gql`
  query GetDismissalByKey($key: String!) {
    dismissalByKey(key: $key) {
      userGuid
      key
      dismissalTimestamp
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetDismissalByKeyGQL extends Apollo.Query<
  GetDismissalByKeyQuery,
  GetDismissalByKeyQueryVariables
> {
  document = GetDismissalByKeyDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetDismissalsDocument = gql`
  query GetDismissals {
    dismissals {
      userGuid
      key
      dismissalTimestamp
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetDismissalsGQL extends Apollo.Query<
  GetDismissalsQuery,
  GetDismissalsQueryVariables
> {
  document = GetDismissalsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchOidcProvidersDocument = gql`
  query FetchOidcProviders {
    oidcProviders {
      id
      name
      loginUrl
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchOidcProvidersGQL extends Apollo.Query<
  FetchOidcProvidersQuery,
  FetchOidcProvidersQueryVariables
> {
  document = FetchOidcProvidersDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const AdminUpdateAccountDocument = gql`
  mutation AdminUpdateAccount(
    $currentUsername: String!
    $newUsername: String
    $newEmail: String
    $resetMFA: Boolean
  ) {
    updateAccount(
      currentUsername: $currentUsername
      newUsername: $newUsername
      newEmail: $newEmail
      resetMFA: $resetMFA
    )
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AdminUpdateAccountGQL extends Apollo.Mutation<
  AdminUpdateAccountMutation,
  AdminUpdateAccountMutationVariables
> {
  document = AdminUpdateAccountDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const ModerationSetUserBanStateDocument = gql`
  mutation ModerationSetUserBanState(
    $subjectGuid: String!
    $banState: Boolean!
  ) {
    setUserBanState(subjectGuid: $subjectGuid, banState: $banState)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ModerationSetUserBanStateGQL extends Apollo.Mutation<
  ModerationSetUserBanStateMutation,
  ModerationSetUserBanStateMutationVariables
> {
  document = ModerationSetUserBanStateDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const ModerationDeleteEntityDocument = gql`
  mutation ModerationDeleteEntity($subjectUrn: String!) {
    deleteEntity(subjectUrn: $subjectUrn)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ModerationDeleteEntityGQL extends Apollo.Mutation<
  ModerationDeleteEntityMutation,
  ModerationDeleteEntityMutationVariables
> {
  document = ModerationDeleteEntityDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetBoostFeedDocument = gql`
  query GetBoostFeed(
    $targetLocation: Int
    $first: Int
    $after: Int!
    $source: String!
  ) {
    boosts(
      targetLocation: $targetLocation
      first: $first
      after: $after
      source: $source
    ) {
      edges {
        node {
          guid
          activity {
            legacy
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetBoostFeedGQL extends Apollo.Query<
  GetBoostFeedQuery,
  GetBoostFeedQueryVariables
> {
  document = GetBoostFeedDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const AdminCancelBoostsDocument = gql`
  mutation AdminCancelBoosts($entityGuid: String!) {
    adminCancelBoosts(entityGuid: $entityGuid)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AdminCancelBoostsGQL extends Apollo.Mutation<
  AdminCancelBoostsMutation,
  AdminCancelBoostsMutationVariables
> {
  document = AdminCancelBoostsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const AddMembersToChatRoomDocument = gql`
  mutation AddMembersToChatRoom($roomGuid: String!, $memberGuids: [String!]!) {
    addMembersToChatRoom(roomGuid: $roomGuid, memberGuids: $memberGuids)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AddMembersToChatRoomGQL extends Apollo.Mutation<
  AddMembersToChatRoomMutation,
  AddMembersToChatRoomMutationVariables
> {
  document = AddMembersToChatRoomDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateChatMessageDocument = gql`
  mutation CreateChatMessage($plainText: String!, $roomGuid: String!) {
    createChatMessage(plainText: $plainText, roomGuid: $roomGuid) {
      id
      cursor
      node {
        id
        guid
        roomGuid
        plainText
        timeCreatedISO8601
        timeCreatedUnix
        sender {
          id
          type
          cursor
          node {
            name
            username
            guid
            id
          }
        }
        richEmbed {
          id
          url
          canonicalUrl
          title
          thumbnailSrc
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateChatMessageGQL extends Apollo.Mutation<
  CreateChatMessageMutation,
  CreateChatMessageMutationVariables
> {
  document = CreateChatMessageDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateChatRoomDocument = gql`
  mutation CreateChatRoom(
    $otherMemberGuids: [String!]!
    $roomType: ChatRoomTypeEnum
    $groupGuid: String
  ) {
    createChatRoom(
      otherMemberGuids: $otherMemberGuids
      roomType: $roomType
      groupGuid: $groupGuid
    ) {
      cursor
      node {
        id
        guid
        roomType
        groupGuid
        timeCreatedISO8601
        timeCreatedUnix
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateChatRoomGQL extends Apollo.Mutation<
  CreateChatRoomMutation,
  CreateChatRoomMutationVariables
> {
  document = CreateChatRoomDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateGroupChatRoomDocument = gql`
  mutation CreateGroupChatRoom($groupGuid: String!) {
    createGroupChatRoom(groupGuid: $groupGuid) {
      cursor
      node {
        id
        guid
        roomType
        groupGuid
        timeCreatedISO8601
        timeCreatedUnix
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateGroupChatRoomGQL extends Apollo.Mutation<
  CreateGroupChatRoomMutation,
  CreateGroupChatRoomMutationVariables
> {
  document = CreateGroupChatRoomDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeleteChatMessageDocument = gql`
  mutation DeleteChatMessage($roomGuid: String!, $messageGuid: String!) {
    deleteChatMessage(roomGuid: $roomGuid, messageGuid: $messageGuid)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DeleteChatMessageGQL extends Apollo.Mutation<
  DeleteChatMessageMutation,
  DeleteChatMessageMutationVariables
> {
  document = DeleteChatMessageDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeleteChatRoomAndBlockUserDocument = gql`
  mutation DeleteChatRoomAndBlockUser($roomGuid: String!) {
    deleteChatRoomAndBlockUser(roomGuid: $roomGuid)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DeleteChatRoomAndBlockUserGQL extends Apollo.Mutation<
  DeleteChatRoomAndBlockUserMutation,
  DeleteChatRoomAndBlockUserMutationVariables
> {
  document = DeleteChatRoomAndBlockUserDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeleteChatRoomDocument = gql`
  mutation DeleteChatRoom($roomGuid: String!) {
    deleteChatRoom(roomGuid: $roomGuid)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DeleteChatRoomGQL extends Apollo.Mutation<
  DeleteChatRoomMutation,
  DeleteChatRoomMutationVariables
> {
  document = DeleteChatRoomDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeleteGroupChatRoomsDocument = gql`
  mutation DeleteGroupChatRooms($groupGuid: String!) {
    deleteGroupChatRooms(groupGuid: $groupGuid)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DeleteGroupChatRoomsGQL extends Apollo.Mutation<
  DeleteGroupChatRoomsMutation,
  DeleteGroupChatRoomsMutationVariables
> {
  document = DeleteGroupChatRoomsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetChatMessagesDocument = gql`
  query GetChatMessages(
    $roomGuid: String!
    $first: Int!
    $after: String
    $before: String
  ) {
    chatMessages(
      after: $after
      first: $first
      before: $before
      roomGuid: $roomGuid
    ) {
      edges {
        cursor
        id
        node {
          id
          guid
          roomGuid
          plainText
          timeCreatedISO8601
          timeCreatedUnix
          sender {
            id
            type
            cursor
            node {
              name
              username
              id
              guid
            }
          }
          richEmbed {
            id
            url
            canonicalUrl
            title
            thumbnailSrc
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetChatMessagesGQL extends Apollo.Query<
  GetChatMessagesQuery,
  GetChatMessagesQueryVariables
> {
  document = GetChatMessagesDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetChatRoomGuidsDocument = gql`
  query GetChatRoomGuids {
    chatRoomGuids
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetChatRoomGuidsGQL extends Apollo.Query<
  GetChatRoomGuidsQuery,
  GetChatRoomGuidsQueryVariables
> {
  document = GetChatRoomGuidsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetChatRoomInviteRequestsDocument = gql`
  query GetChatRoomInviteRequests($first: Int, $after: String) {
    chatRoomInviteRequests(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          guid
          roomType
          timeCreatedISO8601
          timeCreatedUnix
        }
        members(first: 3) {
          edges {
            cursor
            node {
              id
              guid
              username
              name
            }
          }
        }
        lastMessagePlainText
        lastMessageCreatedTimestamp
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetChatRoomInviteRequestsGQL extends Apollo.Query<
  GetChatRoomInviteRequestsQuery,
  GetChatRoomInviteRequestsQueryVariables
> {
  document = GetChatRoomInviteRequestsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetChatRoomMembersDocument = gql`
  query GetChatRoomMembers(
    $roomGuid: String!
    $first: Int!
    $after: String
    $excludeSelf: Boolean
  ) {
    chatRoomMembers(
      roomGuid: $roomGuid
      first: $first
      after: $after
      excludeSelf: $excludeSelf
    ) {
      edges {
        cursor
        role
        node {
          id
          guid
          name
          username
          urn
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetChatRoomMembersGQL extends Apollo.Query<
  GetChatRoomMembersQuery,
  GetChatRoomMembersQueryVariables
> {
  document = GetChatRoomMembersDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetChatRoomNotificationStatusDocument = gql`
  query GetChatRoomNotificationStatus($roomGuid: String!) {
    chatRoom(roomGuid: $roomGuid) {
      id
      node {
        chatRoomNotificationStatus
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetChatRoomNotificationStatusGQL extends Apollo.Query<
  GetChatRoomNotificationStatusQuery,
  GetChatRoomNotificationStatusQueryVariables
> {
  document = GetChatRoomNotificationStatusDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetChatRoomDocument = gql`
  query GetChatRoom(
    $roomGuid: String!
    $firstMembers: Int!
    $afterMembers: Int!
  ) {
    chatRoom(roomGuid: $roomGuid) {
      id
      cursor
      node {
        guid
        roomType
        name
        groupGuid
        id
        isChatRequest
        isUserRoomOwner
        chatRoomNotificationStatus
      }
      members(first: $firstMembers, after: $afterMembers) {
        edges {
          cursor
          role
          node {
            name
            username
            id
            guid
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
      unreadMessagesCount
      lastMessagePlainText
      lastMessageCreatedTimestamp
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetChatRoomGQL extends Apollo.Query<
  GetChatRoomQuery,
  GetChatRoomQueryVariables
> {
  document = GetChatRoomDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetChatRoomsListDocument = gql`
  query GetChatRoomsList($first: Int, $after: String) {
    chatRoomList(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        id
        cursor
        node {
          id
          guid
          name
          roomType
          groupGuid
          timeCreatedISO8601
          timeCreatedUnix
        }
        members(first: 3) {
          edges {
            cursor
            node {
              id
              guid
              username
              name
            }
          }
        }
        unreadMessagesCount
        lastMessagePlainText
        lastMessageCreatedTimestamp
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetChatRoomsListGQL extends Apollo.Query<
  GetChatRoomsListQuery,
  GetChatRoomsListQueryVariables
> {
  document = GetChatRoomsListDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetTotalChatRoomMembersDocument = gql`
  query GetTotalChatRoomMembers($roomGuid: String!) {
    chatRoom(roomGuid: $roomGuid) {
      totalMembers
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetTotalChatRoomMembersGQL extends Apollo.Query<
  GetTotalChatRoomMembersQuery,
  GetTotalChatRoomMembersQueryVariables
> {
  document = GetTotalChatRoomMembersDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetTotalRoomInviteRequestsDocument = gql`
  query GetTotalRoomInviteRequests {
    totalRoomInviteRequests
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetTotalRoomInviteRequestsGQL extends Apollo.Query<
  GetTotalRoomInviteRequestsQuery,
  GetTotalRoomInviteRequestsQueryVariables
> {
  document = GetTotalRoomInviteRequestsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const InitChatDocument = gql`
  query InitChat {
    chatUnreadMessagesCount
  }
`;

@Injectable({
  providedIn: 'root',
})
export class InitChatGQL extends Apollo.Query<
  InitChatQuery,
  InitChatQueryVariables
> {
  document = InitChatDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const LeaveChatRoomDocument = gql`
  mutation LeaveChatRoom($roomGuid: String!) {
    leaveChatRoom(roomGuid: $roomGuid)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LeaveChatRoomGQL extends Apollo.Mutation<
  LeaveChatRoomMutation,
  LeaveChatRoomMutationVariables
> {
  document = LeaveChatRoomDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const RemoveMemberFromChatRoomDocument = gql`
  mutation RemoveMemberFromChatRoom($roomGuid: String!, $memberGuid: String!) {
    removeMemberFromChatRoom(roomGuid: $roomGuid, memberGuid: $memberGuid)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class RemoveMemberFromChatRoomGQL extends Apollo.Mutation<
  RemoveMemberFromChatRoomMutation,
  RemoveMemberFromChatRoomMutationVariables
> {
  document = RemoveMemberFromChatRoomDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const ReplyToRoomInviteRequestDocument = gql`
  mutation ReplyToRoomInviteRequest(
    $roomGuid: String!
    $action: ChatRoomInviteRequestActionEnum!
  ) {
    replyToRoomInviteRequest(
      roomGuid: $roomGuid
      chatRoomInviteRequestActionEnum: $action
    )
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ReplyToRoomInviteRequestGQL extends Apollo.Mutation<
  ReplyToRoomInviteRequestMutation,
  ReplyToRoomInviteRequestMutationVariables
> {
  document = ReplyToRoomInviteRequestDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SetReadReceiptDocument = gql`
  mutation SetReadReceipt($roomGuid: String!, $messageGuid: String!) {
    readReceipt(roomGuid: $roomGuid, messageGuid: $messageGuid) {
      id
      unreadMessagesCount
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SetReadReceiptGQL extends Apollo.Mutation<
  SetReadReceiptMutation,
  SetReadReceiptMutationVariables
> {
  document = SetReadReceiptDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateChatRoomNameDocument = gql`
  mutation UpdateChatRoomName($roomGuid: String!, $roomName: String!) {
    updateChatRoomName(roomGuid: $roomGuid, roomName: $roomName)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateChatRoomNameGQL extends Apollo.Mutation<
  UpdateChatRoomNameMutation,
  UpdateChatRoomNameMutationVariables
> {
  document = UpdateChatRoomNameDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateChatRoomNotificationSettingsDocument = gql`
  mutation UpdateChatRoomNotificationSettings(
    $roomGuid: String!
    $notificationStatus: ChatRoomNotificationStatusEnum!
  ) {
    updateNotificationSettings(
      roomGuid: $roomGuid
      notificationStatus: $notificationStatus
    )
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateChatRoomNotificationSettingsGQL extends Apollo.Mutation<
  UpdateChatRoomNotificationSettingsMutation,
  UpdateChatRoomNotificationSettingsMutationVariables
> {
  document = UpdateChatRoomNotificationSettingsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const ClaimGiftCardDocument = gql`
  mutation ClaimGiftCard($claimCode: String!) {
    claimGiftCard(claimCode: $claimCode) {
      guid
      productId
      amount
      balance
      expiresAt
      claimedAt
      claimedByGuid
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ClaimGiftCardGQL extends Apollo.Mutation<
  ClaimGiftCardMutation,
  ClaimGiftCardMutationVariables
> {
  document = ClaimGiftCardDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateGiftCardDocument = gql`
  mutation CreateGiftCard(
    $productIdEnum: Int!
    $amount: Float!
    $stripePaymentMethodId: String!
    $targetInput: GiftCardTargetInput!
  ) {
    createGiftCard(
      productIdEnum: $productIdEnum
      amount: $amount
      stripePaymentMethodId: $stripePaymentMethodId
      targetInput: $targetInput
    ) {
      guid
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateGiftCardGQL extends Apollo.Mutation<
  CreateGiftCardMutation,
  CreateGiftCardMutationVariables
> {
  document = CreateGiftCardDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetGiftCardBalancesWithExpiryDataDocument = gql`
  query GetGiftCardBalancesWithExpiryData {
    giftCardsBalances {
      productId
      balance
      earliestExpiringGiftCard {
        guid
        balance
        expiresAt
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetGiftCardBalancesWithExpiryDataGQL extends Apollo.Query<
  GetGiftCardBalancesWithExpiryDataQuery,
  GetGiftCardBalancesWithExpiryDataQueryVariables
> {
  document = GetGiftCardBalancesWithExpiryDataDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetGiftCardBalancesDocument = gql`
  query GetGiftCardBalances {
    giftCardsBalances {
      productId
      balance
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetGiftCardBalancesGQL extends Apollo.Query<
  GetGiftCardBalancesQuery,
  GetGiftCardBalancesQueryVariables
> {
  document = GetGiftCardBalancesDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetGiftCardByCodeDocument = gql`
  query GetGiftCardByCode($claimCode: String!) {
    giftCardByClaimCode(claimCode: $claimCode) {
      guid
      productId
      amount
      balance
      expiresAt
      claimedAt
      issuedByUsername
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetGiftCardByCodeGQL extends Apollo.Query<
  GetGiftCardByCodeQuery,
  GetGiftCardByCodeQueryVariables
> {
  document = GetGiftCardByCodeDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetGiftCardTransactionsLedgerDocument = gql`
  query GetGiftCardTransactionsLedger(
    $giftCardGuid: String!
    $first: Int
    $after: String
  ) {
    giftCardTransactionLedger(
      giftCardGuid: $giftCardGuid
      first: $first
      after: $after
    ) {
      edges {
        node {
          paymentGuid
          giftCardGuid
          amount
          createdAt
          refundedAt
          boostGuid
          id
          giftCardIssuerGuid
          giftCardIssuerName
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetGiftCardTransactionsLedgerGQL extends Apollo.Query<
  GetGiftCardTransactionsLedgerQuery,
  GetGiftCardTransactionsLedgerQueryVariables
> {
  document = GetGiftCardTransactionsLedgerDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetGiftCardDocument = gql`
  query GetGiftCard($guid: String!) {
    giftCard(guid: $guid) {
      guid
      productId
      amount
      balance
      expiresAt
      claimedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetGiftCardGQL extends Apollo.Query<
  GetGiftCardQuery,
  GetGiftCardQueryVariables
> {
  document = GetGiftCardDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetGiftCardsDocument = gql`
  query GetGiftCards(
    $first: Int
    $after: String
    $ordering: GiftCardOrderingEnum
    $productId: GiftCardProductIdEnum
    $statusFilter: GiftCardStatusFilterEnum
  ) {
    giftCards(
      first: $first
      after: $after
      ordering: $ordering
      productId: $productId
      statusFilter: $statusFilter
    ) {
      edges {
        node {
          guid
          productId
          balance
          expiresAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetGiftCardsGQL extends Apollo.Query<
  GetGiftCardsQuery,
  GetGiftCardsQueryVariables
> {
  document = GetGiftCardsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetAdminAnalyticsChartAndKpisDocument = gql`
  query GetAdminAnalyticsChartAndKpis(
    $chartMetric: AnalyticsMetricEnum!
    $kpiMetrics: [AnalyticsMetricEnum!]!
    $fromUnixTs: Int!
    $toUnixTs: Int!
  ) {
    tenantAdminAnalyticsChart(
      metric: $chartMetric
      fromUnixTs: $fromUnixTs
      toUnixTs: $toUnixTs
    ) {
      metric
      segments {
        buckets {
          date
          key
          value
        }
      }
    }
    tenantAdminAnalyticsKpis(
      metrics: $kpiMetrics
      fromUnixTs: $fromUnixTs
      toUnixTs: $toUnixTs
    ) {
      metric
      value
      previousPeriodValue
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetAdminAnalyticsChartAndKpisGQL extends Apollo.Query<
  GetAdminAnalyticsChartAndKpisQuery,
  GetAdminAnalyticsChartAndKpisQueryVariables
> {
  document = GetAdminAnalyticsChartAndKpisDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetTenantAnalyticsTableDocument = gql`
  query GetTenantAnalyticsTable(
    $table: AnalyticsTableEnum!
    $fromUnixTs: Int
    $toUnixTs: Int
    $after: String
    $limit: Int
  ) {
    tenantAdminAnalyticsTable(
      table: $table
      fromUnixTs: $fromUnixTs
      toUnixTs: $toUnixTs
      after: $after
      limit: $limit
    ) {
      edges {
        node {
          id
          ... on AnalyticsTableRowActivityNode {
            views
            engagements
            activity {
              id
              guid
              ownerGuid
              title
              message
              owner {
                username
              }
            }
          }
          ... on AnalyticsTableRowGroupNode {
            newMembers
            group {
              name
              guid
            }
          }
          ... on AnalyticsTableRowUserNode {
            newSubscribers
            totalSubscribers
            user {
              guid
              username
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetTenantAnalyticsTableGQL extends Apollo.Query<
  GetTenantAnalyticsTableQuery,
  GetTenantAnalyticsTableQueryVariables
> {
  document = GetTenantAnalyticsTableDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetFeaturedEntitiesDocument = gql`
  query GetFeaturedEntities(
    $type: FeaturedEntityTypeEnum!
    $after: Int
    $first: Int
  ) {
    featuredEntities(type: $type, after: $after, first: $first) {
      edges {
        id
        node {
          id
          ... on FeaturedUser {
            __typename
            entityGuid
            id
            autoSubscribe
            autoPostSubscription
            name
            username
          }
          ... on FeaturedGroup {
            __typename
            entityGuid
            id
            autoSubscribe
            autoPostSubscription
            name
            briefDescription
            membersCount
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetFeaturedEntitiesGQL extends Apollo.Query<
  GetFeaturedEntitiesQuery,
  GetFeaturedEntitiesQueryVariables
> {
  document = GetFeaturedEntitiesDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeleteFeaturedEntityDocument = gql`
  mutation deleteFeaturedEntity($entityGuid: String!) {
    deleteFeaturedEntity(entityGuid: $entityGuid)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DeleteFeaturedEntityGQL extends Apollo.Mutation<
  DeleteFeaturedEntityMutation,
  DeleteFeaturedEntityMutationVariables
> {
  document = DeleteFeaturedEntityDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const StoreFeaturedEntityDocument = gql`
  mutation StoreFeaturedEntity(
    $entityGuid: String!
    $autoSubscribe: Boolean
    $autoPostSubscription: Boolean
  ) {
    storeFeaturedEntity(
      featuredEntity: {
        entityGuid: $entityGuid
        autoSubscribe: $autoSubscribe
        autoPostSubscription: $autoPostSubscription
      }
    ) {
      id
      tenantId
      entityGuid
      autoSubscribe
      autoPostSubscription
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class StoreFeaturedEntityGQL extends Apollo.Mutation<
  StoreFeaturedEntityMutation,
  StoreFeaturedEntityMutationVariables
> {
  document = StoreFeaturedEntityDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetMobileConfigPreviewStateDocument = gql`
  query GetMobileConfigPreviewState {
    mobileConfig {
      id
      previewStatus
      previewQRCode
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetMobileConfigPreviewStateGQL extends Apollo.Query<
  GetMobileConfigPreviewStateQuery,
  GetMobileConfigPreviewStateQueryVariables
> {
  document = GetMobileConfigPreviewStateDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetMobileConfigDocument = gql`
  query GetMobileConfig {
    mobileConfig {
      id
      splashScreenType
      welcomeScreenLogoType
      previewStatus
      previewQRCode
      appTrackingMessageEnabled
      appTrackingMessage
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetMobileConfigGQL extends Apollo.Query<
  GetMobileConfigQuery,
  GetMobileConfigQueryVariables
> {
  document = GetMobileConfigDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SetMobileConfigDocument = gql`
  mutation SetMobileConfig(
    $mobileWelcomeScreenLogoType: MobileWelcomeScreenLogoTypeEnum
    $mobileSplashScreenType: MobileSplashScreenTypeEnum
    $mobilePreviewStatus: MobilePreviewStatusEnum
    $appTrackingMessageEnabled: Boolean
    $appTrackingMessage: String
  ) {
    mobileConfig(
      mobileWelcomeScreenLogoType: $mobileWelcomeScreenLogoType
      mobileSplashScreenType: $mobileSplashScreenType
      mobilePreviewStatus: $mobilePreviewStatus
      appTrackingMessageEnabled: $appTrackingMessageEnabled
      appTrackingMessage: $appTrackingMessage
    ) {
      id
      splashScreenType
      welcomeScreenLogoType
      previewStatus
      previewQRCode
      updateTimestamp
      appTrackingMessageEnabled
      appTrackingMessage
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SetMobileConfigGQL extends Apollo.Mutation<
  SetMobileConfigMutation,
  SetMobileConfigMutationVariables
> {
  document = SetMobileConfigDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateNewReportDocument = gql`
  mutation CreateNewReport(
    $entityUrn: String!
    $reason: ReportReasonEnum!
    $illegalSubReason: IllegalSubReasonEnum
    $nsfwSubReason: NsfwSubReasonEnum
    $securitySubReason: SecuritySubReasonEnum
  ) {
    createNewReport(
      reportInput: {
        entityUrn: $entityUrn
        reason: $reason
        securitySubReason: $securitySubReason
        illegalSubReason: $illegalSubReason
        nsfwSubReason: $nsfwSubReason
      }
    )
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateNewReportGQL extends Apollo.Mutation<
  CreateNewReportMutation,
  CreateNewReportMutationVariables
> {
  document = CreateNewReportDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetReportsDocument = gql`
  query GetReports($first: Int!, $after: Int!, $status: ReportStatusEnum) {
    reports(first: $first, after: $after, status: $status) {
      edges {
        node {
          id
          ... on Report {
            tenantId
            reportGuid
            entityUrn
            entityGuid
            reportedByGuid
            reportedByUserEdge {
              node {
                guid
                username
              }
            }
            moderatedByGuid
            createdTimestamp
            reason
            nsfwSubReason
            illegalSubReason
            securitySubReason
            createdTimestamp
            entityEdge {
              ... on ActivityEdge {
                node {
                  legacy
                }
              }
              ... on UserEdge {
                node {
                  legacy
                }
              }
              ... on GroupEdge {
                node {
                  legacy
                }
              }
              ... on CommentEdge {
                node {
                  legacy
                }
              }
              ... on ChatMessageEdge {
                node {
                  id
                  guid
                  roomGuid
                  plainText
                  timeCreatedISO8601
                  timeCreatedUnix
                  sender {
                    id
                    type
                    cursor
                    node {
                      name
                      username
                      id
                      guid
                    }
                  }
                  richEmbed {
                    id
                    url
                    canonicalUrl
                    title
                    thumbnailSrc
                  }
                }
              }
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetReportsGQL extends Apollo.Query<
  GetReportsQuery,
  GetReportsQueryVariables
> {
  document = GetReportsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const ProvideVerdictDocument = gql`
  mutation ProvideVerdict($reportGuid: String!, $action: ReportActionEnum!) {
    provideVerdict(verdictInput: { reportGuid: $reportGuid, action: $action })
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ProvideVerdictGQL extends Apollo.Mutation<
  ProvideVerdictMutation,
  ProvideVerdictMutationVariables
> {
  document = ProvideVerdictDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const ArchiveSiteMembershipDocument = gql`
  mutation archiveSiteMembership($siteMembershipGuid: String!) {
    archiveSiteMembership(siteMembershipGuid: $siteMembershipGuid)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ArchiveSiteMembershipGQL extends Apollo.Mutation<
  ArchiveSiteMembershipMutation,
  ArchiveSiteMembershipMutationVariables
> {
  document = ArchiveSiteMembershipDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetSiteMembershipDocument = gql`
  query GetSiteMembership($membershipGuid: String!) {
    siteMembership(membershipGuid: $membershipGuid) {
      id
      membershipGuid
      membershipName
      membershipDescription
      membershipPriceInCents
      priceCurrency
      membershipBillingPeriod
      membershipPricingModel
      archived
      roles {
        id
        name
      }
      groups {
        guid
        name
        membersCount
        legacy
      }
      isExternal
      purchaseUrl
      manageUrl
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetSiteMembershipGQL extends Apollo.Query<
  GetSiteMembershipQuery,
  GetSiteMembershipQueryVariables
> {
  document = GetSiteMembershipDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetSiteMembershipsDocument = gql`
  query GetSiteMemberships {
    siteMemberships {
      id
      membershipGuid
      membershipName
      membershipDescription
      membershipPriceInCents
      priceCurrency
      membershipBillingPeriod
      membershipPricingModel
      roles {
        id
        name
      }
      groups {
        guid
        name
        membersCount
        legacy
      }
      isExternal
      purchaseUrl
      manageUrl
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetSiteMembershipsGQL extends Apollo.Query<
  GetSiteMembershipsQuery,
  GetSiteMembershipsQueryVariables
> {
  document = GetSiteMembershipsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetStripeKeysDocument = gql`
  query GetStripeKeys {
    stripeKeys {
      pubKey
      secKey
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetStripeKeysGQL extends Apollo.Query<
  GetStripeKeysQuery,
  GetStripeKeysQueryVariables
> {
  document = GetStripeKeysDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SetSiteMembershipDocument = gql`
  mutation SetSiteMembership(
    $membershipName: String!
    $membershipPriceInCents: Int!
    $membershipBillingPeriod: SiteMembershipBillingPeriodEnum!
    $membershipPricingModel: SiteMembershipPricingModelEnum!
    $membershipDescription: String
    $roles: [Int!]
    $groups: [String!]
    $isExternal: Boolean!
    $purchaseUrl: String
    $manageUrl: String
  ) {
    siteMembership(
      siteMembershipInput: {
        membershipName: $membershipName
        membershipPriceInCents: $membershipPriceInCents
        membershipBillingPeriod: $membershipBillingPeriod
        membershipPricingModel: $membershipPricingModel
        membershipDescription: $membershipDescription
        roles: $roles
        groups: $groups
        isExternal: $isExternal
        purchaseUrl: $purchaseUrl
        manageUrl: $manageUrl
      }
    ) {
      id
      membershipGuid
      membershipName
      membershipPriceInCents
      membershipBillingPeriod
      membershipPricingModel
      membershipDescription
      priceCurrency
      roles {
        id
        name
      }
      groups {
        id
        name
        guid
        membersCount
        legacy
      }
      isExternal
      purchaseUrl
      manageUrl
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SetSiteMembershipGQL extends Apollo.Mutation<
  SetSiteMembershipMutation,
  SetSiteMembershipMutationVariables
> {
  document = SetSiteMembershipDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SetStripeKeysDocument = gql`
  mutation SetStripeKeys($pubKey: String!, $secKey: String!) {
    setStripeKeys(pubKey: $pubKey, secKey: $secKey)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SetStripeKeysGQL extends Apollo.Mutation<
  SetStripeKeysMutation,
  SetStripeKeysMutationVariables
> {
  document = SetStripeKeysDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateSiteMembershipDocument = gql`
  mutation UpdateSiteMembership(
    $membershipGuid: String!
    $membershipName: String!
    $membershipDescription: String
    $roles: [Int!]
    $groups: [String!]
    $purchaseUrl: String
    $manageUrl: String
  ) {
    updateSiteMembership(
      siteMembershipInput: {
        membershipGuid: $membershipGuid
        membershipName: $membershipName
        membershipDescription: $membershipDescription
        roles: $roles
        groups: $groups
        purchaseUrl: $purchaseUrl
        manageUrl: $manageUrl
      }
    ) {
      id
      membershipGuid
      membershipName
      membershipPriceInCents
      membershipBillingPeriod
      membershipPricingModel
      membershipDescription
      priceCurrency
      roles {
        id
        name
      }
      groups {
        id
        name
        guid
        membersCount
        legacy
      }
      isExternal
      purchaseUrl
      manageUrl
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateSiteMembershipGQL extends Apollo.Mutation<
  UpdateSiteMembershipMutation,
  UpdateSiteMembershipMutationVariables
> {
  document = UpdateSiteMembershipDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetPermissionIntentsDocument = gql`
  query GetPermissionIntents {
    permissionIntents {
      permissionId
      intentType
      membershipGuid
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetPermissionIntentsGQL extends Apollo.Query<
  GetPermissionIntentsQuery,
  GetPermissionIntentsQueryVariables
> {
  document = GetPermissionIntentsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SetPermissionIntentDocument = gql`
  mutation SetPermissionIntent(
    $permissionId: PermissionsEnum!
    $intentType: PermissionIntentTypeEnum!
    $membershipGuid: String
  ) {
    setPermissionIntent(
      permissionId: $permissionId
      intentType: $intentType
      membershipGuid: $membershipGuid
    ) {
      permissionId
      intentType
      membershipGuid
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SetPermissionIntentGQL extends Apollo.Mutation<
  SetPermissionIntentMutation,
  SetPermissionIntentMutationVariables
> {
  document = SetPermissionIntentDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const AssignUserToRoleDocument = gql`
  mutation AssignUserToRole($userGuid: String!, $roleId: Int!) {
    assignUserToRole(userGuid: $userGuid, roleId: $roleId) {
      id
      name
      permissions
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AssignUserToRoleGQL extends Apollo.Mutation<
  AssignUserToRoleMutation,
  AssignUserToRoleMutationVariables
> {
  document = AssignUserToRoleDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CancelInviteDocument = gql`
  mutation cancelInvite($inviteId: Int!) {
    cancelInvite(inviteId: $inviteId)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CancelInviteGQL extends Apollo.Mutation<
  CancelInviteMutation,
  CancelInviteMutationVariables
> {
  document = CancelInviteDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateInviteDocument = gql`
  mutation createInvite(
    $emails: String!
    $bespokeMessage: String!
    $roles: [Int!]
    $groups: [String!]
  ) {
    invite(
      emails: $emails
      bespokeMessage: $bespokeMessage
      roles: $roles
      groups: $groups
    )
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateInviteGQL extends Apollo.Mutation<
  CreateInviteMutation,
  CreateInviteMutationVariables
> {
  document = CreateInviteDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeleteCustomNavigationItemDocument = gql`
  mutation deleteCustomNavigationItem($id: String!) {
    deleteCustomNavigationItem(id: $id)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DeleteCustomNavigationItemGQL extends Apollo.Mutation<
  DeleteCustomNavigationItemMutation,
  DeleteCustomNavigationItemMutationVariables
> {
  document = DeleteCustomNavigationItemDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetRolesAndPermissionsDocument = gql`
  query GetRolesAndPermissions {
    allRoles {
      id
      name
      permissions
    }
    allPermissions
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetRolesAndPermissionsGQL extends Apollo.Query<
  GetRolesAndPermissionsQuery,
  GetRolesAndPermissionsQueryVariables
> {
  document = GetRolesAndPermissionsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetAssignedRolesDocument = gql`
  query GetAssignedRoles($userGuid: String!) {
    assignedRoles(userGuid: $userGuid) {
      id
      name
      permissions
    }
    assignedPermissions
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetAssignedRolesGQL extends Apollo.Query<
  GetAssignedRolesQuery,
  GetAssignedRolesQueryVariables
> {
  document = GetAssignedRolesDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetNavigationItemsDocument = gql`
  query getNavigationItems {
    customNavigationItems {
      id
      name
      type
      action
      iconId
      order
      url
      visible
      visibleMobile
      path
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetNavigationItemsGQL extends Apollo.Query<
  GetNavigationItemsQuery,
  GetNavigationItemsQueryVariables
> {
  document = GetNavigationItemsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetCustomPageDocument = gql`
  query GetCustomPage($pageType: String!) {
    customPage(pageType: $pageType) {
      pageType
      content
      externalLink
      defaultContent
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetCustomPageGQL extends Apollo.Query<
  GetCustomPageQuery,
  GetCustomPageQueryVariables
> {
  document = GetCustomPageDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetInvitesDocument = gql`
  query getInvites($first: Int!, $after: String, $search: String) {
    invites(first: $first, after: $after, search: $search) {
      edges {
        node {
          inviteId
          email
          status
          bespokeMessage
          createdTimestamp
          sendTimestamp
          id
          roles {
            id
            name
            permissions
          }
          groups {
            legacy
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetInvitesGQL extends Apollo.Query<
  GetInvitesQuery,
  GetInvitesQueryVariables
> {
  document = GetInvitesDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetMultiTenantConfigDocument = gql`
  query GetMultiTenantConfig {
    multiTenantConfig {
      siteName
      siteEmail
      colorScheme
      primaryColor
      canEnableFederation
      federationDisabled
      replyEmail
      boostEnabled
      customHomePageEnabled
      customHomePageDescription
      walledGardenEnabled
      digestEmailEnabled
      welcomeEmailEnabled
      isNonProfit
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetMultiTenantConfigGQL extends Apollo.Query<
  GetMultiTenantConfigQuery,
  GetMultiTenantConfigQueryVariables
> {
  document = GetMultiTenantConfigDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetMultiTenantDomainDocument = gql`
  query GetMultiTenantDomain {
    multiTenantDomain {
      domain
      dnsRecord {
        name
        type
        value
      }
      status
      ownershipVerificationDnsRecord {
        name
        type
        value
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetMultiTenantDomainGQL extends Apollo.Query<
  GetMultiTenantDomainQuery,
  GetMultiTenantDomainQueryVariables
> {
  document = GetMultiTenantDomainDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetUsersByRoleDocument = gql`
  query GetUsersByRole(
    $roleId: Int
    $username: String
    $first: Int
    $after: String
  ) {
    usersByRole(
      roleId: $roleId
      username: $username
      first: $first
      after: $after
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          guid
          username
          name
          legacy
        }
        cursor
        roles {
          name
          id
          permissions
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetUsersByRoleGQL extends Apollo.Query<
  GetUsersByRoleQuery,
  GetUsersByRoleQueryVariables
> {
  document = GetUsersByRoleDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const ResendInviteDocument = gql`
  mutation resendInvite($inviteId: Int!) {
    resendInvite(inviteId: $inviteId)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ResendInviteGQL extends Apollo.Mutation<
  ResendInviteMutation,
  ResendInviteMutationVariables
> {
  document = ResendInviteDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const ReorderNavigationItemsDocument = gql`
  mutation reorderNavigationItems($ids: [String!]!) {
    updateCustomNavigationItemsOrder(orderedIds: $ids) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ReorderNavigationItemsGQL extends Apollo.Mutation<
  ReorderNavigationItemsMutation,
  ReorderNavigationItemsMutationVariables
> {
  document = ReorderNavigationItemsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SetCustomPageDocument = gql`
  mutation SetCustomPage(
    $pageType: String!
    $content: String
    $externalLink: String
  ) {
    setCustomPage(
      pageType: $pageType
      content: $content
      externalLink: $externalLink
    )
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SetCustomPageGQL extends Apollo.Mutation<
  SetCustomPageMutation,
  SetCustomPageMutationVariables
> {
  document = SetCustomPageDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SetMultiTenantConfigDocument = gql`
  mutation SetMultiTenantConfig(
    $siteName: String
    $colorScheme: MultiTenantColorScheme
    $primaryColor: String
    $federationDisabled: Boolean
    $replyEmail: String
    $nsfwEnabled: Boolean
    $boostEnabled: Boolean
    $customHomePageEnabled: Boolean
    $customHomePageDescription: String
    $walledGardenEnabled: Boolean
    $digestEmailEnabled: Boolean
    $welcomeEmailEnabled: Boolean
    $loggedInLandingPageIdWeb: String
    $loggedInLandingPageIdMobile: String
    $isNonProfit: Boolean
  ) {
    multiTenantConfig(
      multiTenantConfigInput: {
        siteName: $siteName
        colorScheme: $colorScheme
        primaryColor: $primaryColor
        federationDisabled: $federationDisabled
        replyEmail: $replyEmail
        nsfwEnabled: $nsfwEnabled
        boostEnabled: $boostEnabled
        customHomePageEnabled: $customHomePageEnabled
        customHomePageDescription: $customHomePageDescription
        walledGardenEnabled: $walledGardenEnabled
        digestEmailEnabled: $digestEmailEnabled
        welcomeEmailEnabled: $welcomeEmailEnabled
        loggedInLandingPageIdWeb: $loggedInLandingPageIdWeb
        loggedInLandingPageIdMobile: $loggedInLandingPageIdMobile
        isNonProfit: $isNonProfit
      }
    )
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SetMultiTenantConfigGQL extends Apollo.Mutation<
  SetMultiTenantConfigMutation,
  SetMultiTenantConfigMutationVariables
> {
  document = SetMultiTenantConfigDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateMultiTenantDomainDocument = gql`
  mutation CreateMultiTenantDomain($hostname: String!) {
    createMultiTenantDomain(hostname: $hostname) {
      domain
      dnsRecord {
        name
        type
        value
      }
      status
      ownershipVerificationDnsRecord {
        name
        type
        value
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateMultiTenantDomainGQL extends Apollo.Mutation<
  CreateMultiTenantDomainMutation,
  CreateMultiTenantDomainMutationVariables
> {
  document = CreateMultiTenantDomainDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SetRolePermissionDocument = gql`
  mutation SetRolePermission(
    $permission: PermissionsEnum!
    $roleId: Int!
    $enabled: Boolean!
  ) {
    setRolePermission(
      permission: $permission
      roleId: $roleId
      enabled: $enabled
    ) {
      permissions
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SetRolePermissionGQL extends Apollo.Mutation<
  SetRolePermissionMutation,
  SetRolePermissionMutationVariables
> {
  document = SetRolePermissionDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const StartTenantTrialDocument = gql`
  mutation StartTenantTrial {
    tenantTrial {
      tenant {
        id
      }
      loginUrl
      jwtToken
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class StartTenantTrialGQL extends Apollo.Mutation<
  StartTenantTrialMutation,
  StartTenantTrialMutationVariables
> {
  document = StartTenantTrialDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UnassignUserFromRoleDocument = gql`
  mutation UnassignUserFromRole($userGuid: String!, $roleId: Int!) {
    unassignUserFromRole(userGuid: $userGuid, roleId: $roleId)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UnassignUserFromRoleGQL extends Apollo.Mutation<
  UnassignUserFromRoleMutation,
  UnassignUserFromRoleMutationVariables
> {
  document = UnassignUserFromRoleDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpsertNavigationItemDocument = gql`
  mutation upsertNavigationItem(
    $id: String!
    $name: String!
    $type: NavigationItemTypeEnum!
    $visible: Boolean!
    $visibleMobile: Boolean!
    $iconId: String!
    $order: Int!
    $path: String
    $url: String
    $action: NavigationItemActionEnum
  ) {
    upsertCustomNavigationItem(
      id: $id
      name: $name
      type: $type
      visible: $visible
      visibleMobile: $visibleMobile
      iconId: $iconId
      order: $order
      path: $path
      url: $url
      action: $action
    ) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpsertNavigationItemGQL extends Apollo.Mutation<
  UpsertNavigationItemMutation,
  UpsertNavigationItemMutationVariables
> {
  document = UpsertNavigationItemDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetCheckoutLinkDocument = gql`
  query GetCheckoutLink(
    $planId: String!
    $addOnIds: [String!]
    $timePeriod: CheckoutTimePeriodEnum!
    $isTrialUpgrade: Boolean
  ) {
    checkoutLink(
      planId: $planId
      addOnIds: $addOnIds
      timePeriod: $timePeriod
      isTrialUpgrade: $isTrialUpgrade
    )
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetCheckoutLinkGQL extends Apollo.Query<
  GetCheckoutLinkQuery,
  GetCheckoutLinkQueryVariables
> {
  document = GetCheckoutLinkDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetCheckoutPageDocument = gql`
  query GetCheckoutPage(
    $planId: String!
    $page: CheckoutPageKeyEnum!
    $timePeriod: CheckoutTimePeriodEnum!
    $addOnIds: [String!]
  ) {
    checkoutPage(
      planId: $planId
      page: $page
      timePeriod: $timePeriod
      addOnIds: $addOnIds
    ) {
      id
      title
      description
      timePeriod
      totalAnnualSavingsCents
      termsMarkdown
      plan {
        id
        name
        description
        perksTitle
        perks
        monthlyFeeCents
        oneTimeFeeCents
      }
      addOns {
        id
        name
        description
        perksTitle
        perks
        monthlyFeeCents
        oneTimeFeeCents
        inBasket
      }
      summary {
        planSummary {
          id
          name
          monthlyFeeCents
          oneTimeFeeCents
        }
        addonsSummary {
          id
          name
          monthlyFeeCents
          oneTimeFeeCents
        }
        totalInitialFeeCents
        totalMonthlyFeeCents
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetCheckoutPageGQL extends Apollo.Query<
  GetCheckoutPageQuery,
  GetCheckoutPageQueryVariables
> {
  document = GetCheckoutPageDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateTenantRootUserDocument = gql`
  mutation CreateTenantRootUser($networkUserInput: TenantUserInput) {
    createNetworkRootUser(networkUser: $networkUserInput) {
      guid
      username
      tenantId
      role
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateTenantRootUserGQL extends Apollo.Mutation<
  CreateTenantRootUserMutation,
  CreateTenantRootUserMutationVariables
> {
  document = CreateTenantRootUserDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateTenantDocument = gql`
  mutation CreateTenant {
    createTenant(tenant: {}) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateTenantGQL extends Apollo.Mutation<
  CreateTenantMutation,
  CreateTenantMutationVariables
> {
  document = CreateTenantDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetNetworksListDocument = gql`
  query GetNetworksList($first: Int!, $last: Int!) {
    tenants(first: $first, last: $last) {
      id
      domain
      ownerGuid
      rootUserGuid
      plan
      config {
        siteName
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetNetworksListGQL extends Apollo.Query<
  GetNetworksListQuery,
  GetNetworksListQueryVariables
> {
  document = GetNetworksListDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchNewsfeedDocument = gql`
  query FetchNewsfeed(
    $algorithm: String!
    $limit: Int!
    $cursor: String
    $inFeedNoticesDelivered: [String!]
  ) {
    newsfeed(
      algorithm: $algorithm
      first: $limit
      after: $cursor
      inFeedNoticesDelivered: $inFeedNoticesDelivered
    ) {
      edges {
        cursor
        ... on ActivityEdge {
          explicitVotes
        }
        node {
          id
          ... on ActivityNode {
            legacy
          }
          ... on BoostNode {
            goalButtonUrl
            goalButtonText
            legacy
          }
          ... on FeedNoticeNode {
            location
            key
            dismissible
          }
          ... on FeedHighlightsConnection {
            edges {
              node {
                id
                legacy
              }
            }
            pageInfo {
              ...PageInfo
            }
          }
          ... on PublisherRecsConnection {
            dismissible
            edges {
              publisherNode: node {
                id
                ... on UserNode {
                  legacy
                }
                ... on BoostNode {
                  legacy
                }
                ... on GroupNode {
                  legacy
                }
              }
            }
            pageInfo {
              ...PageInfo
            }
          }
          ... on FeedHeaderNode {
            text
          }
          ... on FeedExploreTagNode {
            tag
          }
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${PageInfoFragmentDoc}
`;

@Injectable({
  providedIn: 'root',
})
export class FetchNewsfeedGQL extends Apollo.Query<
  FetchNewsfeedQuery,
  FetchNewsfeedQueryVariables
> {
  document = FetchNewsfeedDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetPostSubscriptionDocument = gql`
  query GetPostSubscription($entityGuid: String!) {
    postSubscription(entityGuid: $entityGuid) {
      userGuid
      entityGuid
      frequency
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetPostSubscriptionGQL extends Apollo.Query<
  GetPostSubscriptionQuery,
  GetPostSubscriptionQueryVariables
> {
  document = GetPostSubscriptionDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdatePostSubscriptionsDocument = gql`
  mutation UpdatePostSubscriptions(
    $entityGuid: String!
    $frequency: PostSubscriptionFrequencyEnum!
  ) {
    updatePostSubscription(entityGuid: $entityGuid, frequency: $frequency) {
      userGuid
      entityGuid
      frequency
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdatePostSubscriptionsGQL extends Apollo.Mutation<
  UpdatePostSubscriptionsMutation,
  UpdatePostSubscriptionsMutationVariables
> {
  document = UpdatePostSubscriptionsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CompleteOnboardingStepDocument = gql`
  mutation CompleteOnboardingStep(
    $stepKey: String!
    $stepType: String!
    $additionalData: [KeyValuePairInput!]
  ) {
    completeOnboardingStep(
      stepKey: $stepKey
      stepType: $stepType
      additionalData: $additionalData
    ) {
      userGuid
      stepKey
      stepType
      completedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CompleteOnboardingStepGQL extends Apollo.Mutation<
  CompleteOnboardingStepMutation,
  CompleteOnboardingStepMutationVariables
> {
  document = CompleteOnboardingStepDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetOnboardingStateDocument = gql`
  query GetOnboardingState {
    onboardingState {
      userGuid
      startedAt
      completedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetOnboardingStateGQL extends Apollo.Query<
  GetOnboardingStateQuery,
  GetOnboardingStateQueryVariables
> {
  document = GetOnboardingStateDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetOnboardingStepProgressDocument = gql`
  query GetOnboardingStepProgress {
    onboardingStepProgress {
      userGuid
      stepKey
      stepType
      completedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetOnboardingStepProgressGQL extends Apollo.Query<
  GetOnboardingStepProgressQuery,
  GetOnboardingStepProgressQueryVariables
> {
  document = GetOnboardingStepProgressDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SetOnboardingStateDocument = gql`
  mutation SetOnboardingState($completed: Boolean!) {
    setOnboardingState(completed: $completed) {
      userGuid
      startedAt
      completedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SetOnboardingStateGQL extends Apollo.Mutation<
  SetOnboardingStateMutation,
  SetOnboardingStateMutationVariables
> {
  document = SetOnboardingStateDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchPaymentMethodsDocument = gql`
  query FetchPaymentMethods($giftCardProductId: GiftCardProductIdEnum) {
    paymentMethods(productId: $giftCardProductId) {
      id
      name
      balance
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchPaymentMethodsGQL extends Apollo.Query<
  FetchPaymentMethodsQuery,
  FetchPaymentMethodsQueryVariables
> {
  document = FetchPaymentMethodsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchSearchDocument = gql`
  query FetchSearch(
    $query: String!
    $filter: SearchFilterEnum!
    $mediaType: SearchMediaTypeEnum!
    $nsfw: [SearchNsfwEnum!]
    $limit: Int!
    $cursor: String
  ) {
    search(
      query: $query
      filter: $filter
      mediaType: $mediaType
      nsfw: $nsfw
      first: $limit
      after: $cursor
    ) {
      edges {
        cursor
        node {
          id
          ... on ActivityNode {
            legacy
          }
          ... on UserNode {
            legacy
          }
          ... on GroupNode {
            legacy
          }
          ... on BoostNode {
            goalButtonUrl
            goalButtonText
            legacy
          }
          ... on FeedNoticeNode {
            location
            key
          }
          ... on PublisherRecsConnection {
            edges {
              publisherNode: node {
                id
                ... on UserNode {
                  legacy
                }
                ... on BoostNode {
                  legacy
                }
                ... on GroupNode {
                  legacy
                }
              }
            }
            pageInfo {
              ...PageInfo
            }
          }
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${PageInfoFragmentDoc}
`;

@Injectable({
  providedIn: 'root',
})
export class FetchSearchGQL extends Apollo.Query<
  FetchSearchQuery,
  FetchSearchQueryVariables
> {
  document = FetchSearchDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CountSearchDocument = gql`
  query CountSearch(
    $query: String!
    $filter: SearchFilterEnum!
    $mediaType: SearchMediaTypeEnum!
    $nsfw: [SearchNsfwEnum!]
    $cursor: String
  ) {
    search(
      query: $query
      filter: $filter
      mediaType: $mediaType
      nsfw: $nsfw
      before: $cursor
    ) {
      count
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${PageInfoFragmentDoc}
`;

@Injectable({
  providedIn: 'root',
})
export class CountSearchGQL extends Apollo.Query<
  CountSearchQuery,
  CountSearchQueryVariables
> {
  document = CountSearchDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeletePostHogPersonDocument = gql`
  mutation DeletePostHogPerson {
    deletePostHogPerson
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DeletePostHogPersonGQL extends Apollo.Mutation<
  DeletePostHogPersonMutation,
  DeletePostHogPersonMutationVariables
> {
  document = DeletePostHogPersonDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchEmbeddedCommentsSettingsDocument = gql`
  query FetchEmbeddedCommentsSettings {
    embeddedCommentsSettings {
      domain
      pathRegex
      autoImportsEnabled
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchEmbeddedCommentsSettingsGQL extends Apollo.Query<
  FetchEmbeddedCommentsSettingsQuery,
  FetchEmbeddedCommentsSettingsQueryVariables
> {
  document = FetchEmbeddedCommentsSettingsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SetEmbeddedCommentsSettingsDocument = gql`
  mutation SetEmbeddedCommentsSettings(
    $domain: String!
    $pathRegex: String!
    $autoImportsEnabled: Boolean!
  ) {
    setEmbeddedCommentsSettings(
      domain: $domain
      pathRegex: $pathRegex
      autoImportsEnabled: $autoImportsEnabled
    ) {
      domain
      pathRegex
      autoImportsEnabled
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SetEmbeddedCommentsSettingsGQL extends Apollo.Mutation<
  SetEmbeddedCommentsSettingsMutation,
  SetEmbeddedCommentsSettingsMutationVariables
> {
  document = SetEmbeddedCommentsSettingsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateRssFeedDocument = gql`
  mutation CreateRSSFeed($input: RssFeedInput!) {
    createRssFeed(rssFeed: $input) {
      feedId
      title
      url
      createdAtTimestamp
      lastFetchAtTimestamp
      lastFetchStatus
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateRssFeedGQL extends Apollo.Mutation<
  CreateRssFeedMutation,
  CreateRssFeedMutationVariables
> {
  document = CreateRssFeedDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchRssFeedsDocument = gql`
  query FetchRSSFeeds {
    rssFeeds {
      feedId
      title
      url
      createdAtTimestamp
      lastFetchAtTimestamp
      lastFetchStatus
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchRssFeedsGQL extends Apollo.Query<
  FetchRssFeedsQuery,
  FetchRssFeedsQueryVariables
> {
  document = FetchRssFeedsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const RefreshRssFeedDocument = gql`
  mutation RefreshRSSFeed($feedId: String!) {
    refreshRssFeed(feedId: $feedId) {
      feedId
      title
      url
      createdAtTimestamp
      lastFetchAtTimestamp
      lastFetchStatus
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class RefreshRssFeedGQL extends Apollo.Mutation<
  RefreshRssFeedMutation,
  RefreshRssFeedMutationVariables
> {
  document = RefreshRssFeedDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const RemoveRssFeedDocument = gql`
  mutation RemoveRSSFeed($feedId: String!) {
    removeRssFeed(feedId: $feedId)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class RemoveRssFeedGQL extends Apollo.Mutation<
  RemoveRssFeedMutation,
  RemoveRssFeedMutationVariables
> {
  document = RemoveRssFeedDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreatePersonalApiKeyDocument = gql`
  mutation CreatePersonalApiKey(
    $name: String!
    $scopes: [ApiScopeEnum!]!
    $expireInDays: Int
  ) {
    createPersonalApiKey(
      name: $name
      scopes: $scopes
      expireInDays: $expireInDays
    ) {
      secret
      id
      name
      scopes
      timeCreated
      timeExpires
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreatePersonalApiKeyGQL extends Apollo.Mutation<
  CreatePersonalApiKeyMutation,
  CreatePersonalApiKeyMutationVariables
> {
  document = CreatePersonalApiKeyDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeletePersonalApiKeyDocument = gql`
  mutation DeletePersonalApiKey($id: String!) {
    deletePersonalApiKey(id: $id)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DeletePersonalApiKeyGQL extends Apollo.Mutation<
  DeletePersonalApiKeyMutation,
  DeletePersonalApiKeyMutationVariables
> {
  document = DeletePersonalApiKeyDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetPersonalApiKeysDocument = gql`
  query GetPersonalApiKeys {
    listPersonalApiKeys {
      secret
      id
      name
      scopes
      timeCreated
      timeExpires
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetPersonalApiKeysGQL extends Apollo.Query<
  GetPersonalApiKeysQuery,
  GetPersonalApiKeysQueryVariables
> {
  document = GetPersonalApiKeysDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetSiteMembershipsAndSubscriptionsDocument = gql`
  query GetSiteMembershipsAndSubscriptions {
    siteMemberships {
      id
      membershipGuid
      membershipName
      membershipDescription
      membershipPriceInCents
      priceCurrency
      membershipBillingPeriod
      membershipPricingModel
      roles {
        id
        name
      }
      groups {
        guid
        name
        membersCount
        legacy
      }
      isExternal
      purchaseUrl
      manageUrl
    }
    siteMembershipSubscriptions {
      membershipGuid
      membershipSubscriptionId
      autoRenew
      isManual
      validFromTimestamp
      validToTimestamp
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetSiteMembershipsAndSubscriptionsGQL extends Apollo.Query<
  GetSiteMembershipsAndSubscriptionsQuery,
  GetSiteMembershipsAndSubscriptionsQueryVariables
> {
  document = GetSiteMembershipsAndSubscriptionsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetSiteMembershipSubscriptionsDocument = gql`
  query GetSiteMembershipSubscriptions {
    siteMembershipSubscriptions {
      membershipGuid
      membershipSubscriptionId
      autoRenew
      validFromTimestamp
      validToTimestamp
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetSiteMembershipSubscriptionsGQL extends Apollo.Query<
  GetSiteMembershipSubscriptionsQuery,
  GetSiteMembershipSubscriptionsQueryVariables
> {
  document = GetSiteMembershipSubscriptionsDocument;
  client = 'default';
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
