export type CampaignType = 'newsfeed' | 'content' | 'banner' | 'video';
export type CampaignBudgetType = 'tokens';
export type CampaignDeliveryStatus =
  | 'pending'
  | 'created'
  | 'failed'
  | 'approved'
  | 'rejected'
  | 'revoked'
  | 'completed';

export type Campaign = {
  // User provided
  type: CampaignType;
  name: string;
  entity_urns: string[];
  hashtags: string[];
  nsfw: number[];
  start: number;
  end: number;
  budget: number;
  budget_type: CampaignBudgetType;

  // Engine
  urn?: string;
  checksum?: string;
  payments?: any[];

  // Client-side
  client_guid?: string;
  original_campaign?: Campaign;

  // Read Only
  impressions?: number;
  impressions_met?: number;
  created_timestamp?: number;
  reviewed_timestamp?: number;
  revoked_timestamp?: number;
  rejected_timestamp?: number;
  completed_timestamp?: number;
  delivery_status?: CampaignDeliveryStatus;
  cpm?: number;
};

export type CampaignPayment = {
  address: string;
  txHash: string;
  amount: number;
};

export type CampaignPreview = {
  canBeDelivered: boolean;
  durationDays: number;
  globalViewsPerDay: number;
  viewsPerDayRequested: number;
};
