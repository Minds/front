export type CampaignType = 'newsfeed' | 'content' | 'banner' | 'video';
export type CampaignDeliveryStatus = 'pending' | 'created' | 'failed' | 'approved' | 'rejected' | 'revoked' | 'completed';

export type Campaign = {
  // User provided
  name: string,
  type: CampaignType,
  entity_urns: string[],
  hashtags: string[],
  start: number,
  end: number,
  budget: number,

  // Engine
  urn?: string,
  checksum?: string,

  // Client-side
  client_guid?: string,
  original_campaign?: Campaign,

  // Read Only
  delivery_status?: CampaignDeliveryStatus,
  impressions?: number,
  impressions_met?: number,
  cpm?: number,
  created_timestamp?: number,
  reviewed_timestamp?: number,
  revoked_timestamp?: number,
  rejected_timestamp?: number,
  completed_timestamp?: number,
};

export type CampaignPayment = {
  address: string,
  txHash: string,
};
