export type CampaignType = 'newsfeed' | 'content' | 'banner' | 'video';
export type CampaignDeliveryStatus = 'pending' | 'created' | 'failed' | 'approved' | 'accepted' | 'rejected' | 'revoked' | 'completed';

export type Campaign = {
  // User provided
  name: string,
  type: CampaignType,
  entity_urns: string[],
  hashtags: string,
  start: number,
  end: number,
  budget: number,

  // Engine
  urn?: string,
  delivery_status?: CampaignDeliveryStatus,
  impressions?: number, // For display only
  cpm?: number, // For display only
};
