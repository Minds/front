import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
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

export type AssetConnection = ConnectionInterface & {
  __typename?: 'AssetConnection';
  edges: Array<EdgeInterface>;
  pageInfo: PageInfo;
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
    edges: Array<EdgeInterface>;
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
  node?: Maybe<NodeInterface>;
  /** Gets type for GraphQL. */
  type: Scalars['String']['output'];
};

export type FeaturedEntityInput = {
  autoSubscribe?: InputMaybe<Scalars['Boolean']['input']>;
  entityGuid: Scalars['String']['input'];
  recommended?: InputMaybe<Scalars['Boolean']['input']>;
};

export type FeaturedEntityInterface = {
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
    autoSubscribe: Scalars['Boolean']['output'];
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

export type KeyValuePairInput = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export enum MultiTenantColorScheme {
  Dark = 'DARK',
  Light = 'LIGHT',
}

export type MultiTenantConfig = {
  __typename?: 'MultiTenantConfig';
  colorScheme?: Maybe<MultiTenantColorScheme>;
  communityGuidelines?: Maybe<Scalars['String']['output']>;
  federationDisabled?: Maybe<Scalars['Boolean']['output']>;
  lastCacheTimestamp?: Maybe<Scalars['Int']['output']>;
  primaryColor?: Maybe<Scalars['String']['output']>;
  siteEmail?: Maybe<Scalars['String']['output']>;
  siteName?: Maybe<Scalars['String']['output']>;
  updatedTimestamp?: Maybe<Scalars['Int']['output']>;
};

export type MultiTenantConfigInput = {
  colorScheme?: InputMaybe<MultiTenantColorScheme>;
  communityGuidelines?: InputMaybe<Scalars['String']['input']>;
  federationDisabled?: InputMaybe<Scalars['Boolean']['input']>;
  primaryColor?: InputMaybe<Scalars['String']['input']>;
  siteEmail?: InputMaybe<Scalars['String']['input']>;
  siteName?: InputMaybe<Scalars['String']['input']>;
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
  /** Assigns a user to a role */
  assignUserToRole: Role;
  claimGiftCard: GiftCardNode;
  /** Mark an onboarding step for a user as completed. */
  completeOnboardingStep: OnboardingStepProgressState;
  /** Creates a comment on a remote url */
  createEmbeddedComment: CommentEdge;
  createGiftCard: GiftCardNode;
  createMultiTenantDomain: MultiTenantDomain;
  createNetworkRootUser: TenantUser;
  /** Create a new report. */
  createNewReport: Scalars['Boolean']['output'];
  createRssFeed: RssFeed;
  createTenant: Tenant;
  /** Deletes featured entity. */
  deleteFeaturedEntity: Scalars['Boolean']['output'];
  /** Dismiss a notice by its key. */
  dismiss: Dismissal;
  /** Sets multi-tenant config for the calling tenant. */
  multiTenantConfig: Scalars['Boolean']['output'];
  /** Provide a verdict for a report. */
  provideVerdict: Scalars['Boolean']['output'];
  refreshRssFeed: RssFeed;
  removeRssFeed?: Maybe<Scalars['Void']['output']>;
  /** Creates a comment on a remote url */
  setEmbeddedCommentsSettings: EmbeddedCommentsSettings;
  /** Sets onboarding state for the currently logged in user. */
  setOnboardingState: OnboardingState;
  /** Sets a permission for that a role has */
  setRolePermission: Role;
  /** Stores featured entity. */
  storeFeaturedEntity: FeaturedEntityInterface;
  /** Un-ssigns a user to a role */
  unassignUserFromRole: Scalars['Boolean']['output'];
  updateAccount: Array<Scalars['String']['output']>;
  updatePostSubscription: PostSubscription;
};

export type MutationAssignUserToRoleArgs = {
  roleId: Scalars['Int']['input'];
  userGuid: Scalars['String']['input'];
};

export type MutationClaimGiftCardArgs = {
  claimCode: Scalars['String']['input'];
};

export type MutationCompleteOnboardingStepArgs = {
  additionalData?: InputMaybe<Array<KeyValuePairInput>>;
  stepKey: Scalars['String']['input'];
  stepType: Scalars['String']['input'];
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

export type MutationCreateMultiTenantDomainArgs = {
  hostname: Scalars['String']['input'];
};

export type MutationCreateNetworkRootUserArgs = {
  networkUser?: InputMaybe<TenantUserInput>;
};

export type MutationCreateNewReportArgs = {
  reportInput: ReportInput;
};

export type MutationCreateRssFeedArgs = {
  rssFeed: RssFeedInput;
};

export type MutationCreateTenantArgs = {
  tenant?: InputMaybe<TenantInput>;
};

export type MutationDeleteFeaturedEntityArgs = {
  entityGuid: Scalars['String']['input'];
};

export type MutationDismissArgs = {
  key: Scalars['String']['input'];
};

export type MutationMultiTenantConfigArgs = {
  multiTenantConfigInput: MultiTenantConfigInput;
};

export type MutationProvideVerdictArgs = {
  verdictInput: VerdictInput;
};

export type MutationRefreshRssFeedArgs = {
  feedId: Scalars['String']['input'];
};

export type MutationRemoveRssFeedArgs = {
  feedId: Scalars['String']['input'];
};

export type MutationSetEmbeddedCommentsSettingsArgs = {
  autoImportsEnabled: Scalars['Boolean']['input'];
  domain: Scalars['String']['input'];
  pathRegex: Scalars['String']['input'];
};

export type MutationSetOnboardingStateArgs = {
  completed: Scalars['Boolean']['input'];
};

export type MutationSetRolePermissionArgs = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  permission: PermissionsEnum;
  roleId: Scalars['Int']['input'];
};

export type MutationStoreFeaturedEntityArgs = {
  featuredEntity: FeaturedEntityInput;
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

export type MutationUpdatePostSubscriptionArgs = {
  entityGuid: Scalars['String']['input'];
  frequency: PostSubscriptionFrequencyEnum;
};

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

export enum PermissionsEnum {
  CanAssignPermissions = 'CAN_ASSIGN_PERMISSIONS',
  CanBoost = 'CAN_BOOST',
  CanComment = 'CAN_COMMENT',
  CanCreateGroup = 'CAN_CREATE_GROUP',
  CanCreatePost = 'CAN_CREATE_POST',
  CanInteract = 'CAN_INTERACT',
  CanUploadVideo = 'CAN_UPLOAD_VIDEO',
}

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
  /** Returns the permissions that the current session holds */
  assignedPermissions: Array<PermissionsEnum>;
  /** Returns the roles the session holds */
  assignedRoles: Array<Role>;
  /** Gets Boosts. */
  boosts: BoostsConnection;
  checkoutLink: Scalars['String']['output'];
  checkoutPage: CheckoutPage;
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
  postSubscription: PostSubscription;
  /** Gets reports. */
  reports: ReportsConnection;
  rssFeed: RssFeed;
  rssFeeds: Array<RssFeed>;
  search: SearchResultsConnection;
  tenantAssets: AssetConnection;
  tenantQuotaUsage: QuotaDetails;
  tenants: Array<Tenant>;
  userAssets: AssetConnection;
  userQuotaUsage: QuotaDetails;
  /** Returns users and their roles */
  usersByRole: UserRoleConnection;
};

export type QueryActivityArgs = {
  guid: Scalars['String']['input'];
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

export type QueryCheckoutLinkArgs = {
  addOnIds?: InputMaybe<Array<Scalars['String']['input']>>;
  planId: Scalars['String']['input'];
  timePeriod: CheckoutTimePeriodEnum;
};

export type QueryCheckoutPageArgs = {
  addOnIds?: InputMaybe<Array<Scalars['String']['input']>>;
  page: CheckoutPageKeyEnum;
  planId: Scalars['String']['input'];
  timePeriod: CheckoutTimePeriodEnum;
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
  entityEdge?: Maybe<UnionActivityEdgeUserEdgeGroupEdgeCommentEdge>;
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
  rootUserGuid?: Maybe<Scalars['String']['output']>;
};

export type TenantInput = {
  config?: InputMaybe<MultiTenantConfigInput>;
  domain?: InputMaybe<Scalars['String']['input']>;
  ownerGuid?: InputMaybe<Scalars['Int']['input']>;
};

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

export type UnionActivityEdgeUserEdgeGroupEdgeCommentEdge =
  | ActivityEdge
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

export type GetFeaturedEntitiesQueryVariables = Exact<{
  type: FeaturedEntityTypeEnum;
  after?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;

export type GetFeaturedEntitiesQuery = {
  __typename?: 'Query';
  featuredEntities: {
    __typename?: 'FeaturedEntityConnection';
    id: string;
    edges: Array<
      | {
          __typename?: 'ActivityEdge';
          cursor: string;
          node: { __typename?: 'ActivityNode'; id: string };
        }
      | {
          __typename?: 'BoostEdge';
          cursor: string;
          node: { __typename?: 'BoostNode'; id: string };
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
            | { __typename?: 'BoostNode'; id: string }
            | { __typename?: 'CommentNode'; id: string }
            | { __typename?: 'FeaturedEntity'; id: string }
            | { __typename?: 'FeaturedEntityConnection'; id: string }
            | {
                __typename: 'FeaturedGroup';
                entityGuid: string;
                id: string;
                autoSubscribe: boolean;
                name: string;
                membersCount: number;
              }
            | {
                __typename: 'FeaturedUser';
                entityGuid: string;
                id: string;
                autoSubscribe: boolean;
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
            | { __typename?: 'NodeImpl'; id: string }
            | { __typename?: 'PublisherRecsConnection'; id: string }
            | { __typename?: 'Report'; id: string }
            | { __typename?: 'UserNode'; id: string }
            | null;
        }
      | {
          __typename?: 'FeaturedEntityEdge';
          cursor: string;
          node?:
            | { __typename?: 'ActivityNode'; id: string }
            | { __typename?: 'BoostNode'; id: string }
            | { __typename?: 'CommentNode'; id: string }
            | { __typename?: 'FeaturedEntity'; id: string }
            | { __typename?: 'FeaturedEntityConnection'; id: string }
            | {
                __typename: 'FeaturedGroup';
                entityGuid: string;
                id: string;
                autoSubscribe: boolean;
                name: string;
                membersCount: number;
              }
            | {
                __typename: 'FeaturedUser';
                entityGuid: string;
                id: string;
                autoSubscribe: boolean;
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
            | { __typename?: 'NodeImpl'; id: string }
            | { __typename?: 'PublisherRecsConnection'; id: string }
            | { __typename?: 'Report'; id: string }
            | { __typename?: 'UserNode'; id: string }
            | null;
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
          __typename?: 'PublisherRecsEdge';
          cursor: string;
          node: { __typename?: 'PublisherRecsConnection'; id: string };
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
}>;

export type StoreFeaturedEntityMutation = {
  __typename?: 'Mutation';
  storeFeaturedEntity:
    | {
        __typename?: 'FeaturedEntity';
        tenantId: string;
        entityGuid: string;
        autoSubscribe: boolean;
      }
    | {
        __typename?: 'FeaturedGroup';
        tenantId: string;
        entityGuid: string;
        autoSubscribe: boolean;
      }
    | {
        __typename?: 'FeaturedUser';
        tenantId: string;
        entityGuid: string;
        autoSubscribe: boolean;
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
          __typename?: 'BoostEdge';
          cursor: string;
          node: { __typename?: 'BoostNode'; id: string };
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
            | { __typename?: 'BoostNode'; id: string }
            | { __typename?: 'CommentNode'; id: string }
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
          node?:
            | { __typename?: 'ActivityNode'; id: string }
            | { __typename?: 'BoostNode'; id: string }
            | { __typename?: 'CommentNode'; id: string }
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
    communityGuidelines?: string | null;
    federationDisabled?: boolean | null;
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

export type SetMultiTenantConfigMutationVariables = Exact<{
  siteName?: InputMaybe<Scalars['String']['input']>;
  colorScheme?: InputMaybe<MultiTenantColorScheme>;
  primaryColor?: InputMaybe<Scalars['String']['input']>;
  communityGuidelines?: InputMaybe<Scalars['String']['input']>;
  federationDisabled?: InputMaybe<Scalars['Boolean']['input']>;
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

export type UnassignUserFromRoleMutationVariables = Exact<{
  userGuid: Scalars['String']['input'];
  roleId: Scalars['Int']['input'];
}>;

export type UnassignUserFromRoleMutation = {
  __typename?: 'Mutation';
  unassignUserFromRole: boolean;
};

export type GetCheckoutLinkQueryVariables = Exact<{
  planId: Scalars['String']['input'];
  addOnIds?: InputMaybe<
    Array<Scalars['String']['input']> | Scalars['String']['input']
  >;
  timePeriod: CheckoutTimePeriodEnum;
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
          __typename?: 'CommentEdge';
          cursor: string;
          node: { __typename?: 'CommentNode'; id: string };
        }
      | {
          __typename?: 'EdgeImpl';
          cursor: string;
          node?:
            | { __typename?: 'ActivityNode'; legacy: string; id: string }
            | {
                __typename?: 'BoostNode';
                goalButtonUrl?: string | null;
                goalButtonText?: number | null;
                legacy: string;
                id: string;
              }
            | { __typename?: 'CommentNode'; id: string }
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
                      __typename?: 'BoostEdge';
                      publisherNode: {
                        __typename?: 'BoostNode';
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
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'CommentNode'; id: string }
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
                      publisherNode?:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'CommentNode'; id: string }
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
          node?:
            | { __typename?: 'ActivityNode'; legacy: string; id: string }
            | {
                __typename?: 'BoostNode';
                goalButtonUrl?: string | null;
                goalButtonText?: number | null;
                legacy: string;
                id: string;
              }
            | { __typename?: 'CommentNode'; id: string }
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
                      __typename?: 'BoostEdge';
                      publisherNode: {
                        __typename?: 'BoostNode';
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
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'CommentNode'; id: string }
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
                      publisherNode?:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'CommentNode'; id: string }
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
                  __typename?: 'BoostEdge';
                  publisherNode: {
                    __typename?: 'BoostNode';
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
                    | { __typename?: 'BoostNode'; legacy: string; id: string }
                    | { __typename?: 'CommentNode'; id: string }
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
                    | { __typename?: 'NodeImpl'; id: string }
                    | { __typename?: 'PublisherRecsConnection'; id: string }
                    | { __typename?: 'Report'; id: string }
                    | { __typename?: 'UserNode'; legacy: string; id: string }
                    | null;
                }
              | {
                  __typename?: 'FeaturedEntityEdge';
                  publisherNode?:
                    | { __typename?: 'ActivityNode'; id: string }
                    | { __typename?: 'BoostNode'; legacy: string; id: string }
                    | { __typename?: 'CommentNode'; id: string }
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
                    | { __typename?: 'NodeImpl'; id: string }
                    | { __typename?: 'PublisherRecsConnection'; id: string }
                    | { __typename?: 'Report'; id: string }
                    | { __typename?: 'UserNode'; legacy: string; id: string }
                    | null;
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
          __typename?: 'CommentEdge';
          cursor: string;
          node: { __typename?: 'CommentNode'; id: string };
        }
      | {
          __typename?: 'EdgeImpl';
          cursor: string;
          node?:
            | { __typename?: 'ActivityNode'; legacy: string; id: string }
            | {
                __typename?: 'BoostNode';
                goalButtonUrl?: string | null;
                goalButtonText?: number | null;
                legacy: string;
                id: string;
              }
            | { __typename?: 'CommentNode'; id: string }
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
                      __typename?: 'BoostEdge';
                      publisherNode: {
                        __typename?: 'BoostNode';
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
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'CommentNode'; id: string }
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
                      publisherNode?:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'CommentNode'; id: string }
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
          node?:
            | { __typename?: 'ActivityNode'; legacy: string; id: string }
            | {
                __typename?: 'BoostNode';
                goalButtonUrl?: string | null;
                goalButtonText?: number | null;
                legacy: string;
                id: string;
              }
            | { __typename?: 'CommentNode'; id: string }
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
                      __typename?: 'BoostEdge';
                      publisherNode: {
                        __typename?: 'BoostNode';
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
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'CommentNode'; id: string }
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
                      publisherNode?:
                        | { __typename?: 'ActivityNode'; id: string }
                        | {
                            __typename?: 'BoostNode';
                            legacy: string;
                            id: string;
                          }
                        | { __typename?: 'CommentNode'; id: string }
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
                  __typename?: 'BoostEdge';
                  publisherNode: {
                    __typename?: 'BoostNode';
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
                    | { __typename?: 'BoostNode'; legacy: string; id: string }
                    | { __typename?: 'CommentNode'; id: string }
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
                    | { __typename?: 'NodeImpl'; id: string }
                    | { __typename?: 'PublisherRecsConnection'; id: string }
                    | { __typename?: 'Report'; id: string }
                    | { __typename?: 'UserNode'; legacy: string; id: string }
                    | null;
                }
              | {
                  __typename?: 'FeaturedEntityEdge';
                  publisherNode?:
                    | { __typename?: 'ActivityNode'; id: string }
                    | { __typename?: 'BoostNode'; legacy: string; id: string }
                    | { __typename?: 'CommentNode'; id: string }
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
                    | { __typename?: 'NodeImpl'; id: string }
                    | { __typename?: 'PublisherRecsConnection'; id: string }
                    | { __typename?: 'Report'; id: string }
                    | { __typename?: 'UserNode'; legacy: string; id: string }
                    | null;
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
export const GetFeaturedEntitiesDocument = gql`
  query GetFeaturedEntities(
    $type: FeaturedEntityTypeEnum!
    $after: Int
    $first: Int
  ) {
    featuredEntities(type: $type, after: $after, first: $first) {
      edges {
        node {
          id
          ... on FeaturedUser {
            __typename
            entityGuid
            id
            autoSubscribe
            name
            username
          }
          ... on FeaturedGroup {
            __typename
            entityGuid
            id
            autoSubscribe
            name
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
      id
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
  mutation StoreFeaturedEntity($entityGuid: String!, $autoSubscribe: Boolean) {
    storeFeaturedEntity(
      featuredEntity: { entityGuid: $entityGuid, autoSubscribe: $autoSubscribe }
    ) {
      tenantId
      entityGuid
      autoSubscribe
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
export const GetMultiTenantConfigDocument = gql`
  query GetMultiTenantConfig {
    multiTenantConfig {
      siteName
      siteEmail
      colorScheme
      primaryColor
      communityGuidelines
      federationDisabled
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
  query GetUsersByRole($roleId: Int, $first: Int, $after: String) {
    usersByRole(roleId: $roleId, first: $first, after: $after) {
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
export const SetMultiTenantConfigDocument = gql`
  mutation SetMultiTenantConfig(
    $siteName: String
    $colorScheme: MultiTenantColorScheme
    $primaryColor: String
    $communityGuidelines: String
    $federationDisabled: Boolean
  ) {
    multiTenantConfig(
      multiTenantConfigInput: {
        siteName: $siteName
        colorScheme: $colorScheme
        primaryColor: $primaryColor
        communityGuidelines: $communityGuidelines
        federationDisabled: $federationDisabled
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
export const GetCheckoutLinkDocument = gql`
  query GetCheckoutLink(
    $planId: String!
    $addOnIds: [String!]
    $timePeriod: CheckoutTimePeriodEnum!
  ) {
    checkoutLink(planId: $planId, addOnIds: $addOnIds, timePeriod: $timePeriod)
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
