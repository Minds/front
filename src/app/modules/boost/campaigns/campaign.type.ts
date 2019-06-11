export type CampaignType = 'newsfeed' | 'content' | 'banner' | 'video';

export type Campaign = {
  name: string,
  type: CampaignType,
  content: string[],
  hashtags: string,
  start: number,
  end: number,
  budget: number,
  max_surge: number,
  impressions?: number, // For display only
};
