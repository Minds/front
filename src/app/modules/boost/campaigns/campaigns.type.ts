export type CampaignType = 'newsfeed' | 'content' | 'banner' | 'video';
export type CampaignDelivery = 'active' | 'ended';

export type Campaign = {
  urn?: string,
  name: string,
  type: CampaignType,
  delivery?: CampaignDelivery,
  content: string[],
  hashtags: string,
  start: number,
  end: number,
  budget: number,
  max_surge: number,
  impressions?: number, // For display only
  cpm?: number, // For display only
};
