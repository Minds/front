import { MindsUser, MindsGroup } from './entities';

/*
* Minds response object
*/
export interface MindsResponse { }

export interface MindsChannelResponse extends MindsResponse {
  status: string;
  message: string;
  channel: MindsUser;
}

export interface MindsBlogResponse extends MindsResponse {
  blog: any;
}

export interface MindsBlogListResponse extends MindsResponse {
  blogs: Array<any>;
  'load-next': string;
}


export interface MindsUserConversationResponse extends MindsResponse {
  publickeys: any;
  messages: Array<any>;
  'load-previous': string;
  'load-next': string;
}

export interface MindsGatheringsSearchResponse extends MindsResponse {
  user: Array<any>;
}

export interface MindsKeysResponse extends MindsResponse {
  key: any;
}

export interface MindsConversationResponse extends MindsResponse {
  conversations: Array<any>;
  'load-next': string;
}

export interface MindsGroupResponse extends MindsResponse {
  group: MindsGroup;
}

export interface MindsGroupListResponse extends MindsResponse {
  groups: Array<any>;
  'load-next': string;
}

export interface MindsWalletResponse extends MindsResponse {
  boost_rate: number;
  btc: string;
  cap: number;
  count: number;
  ex: any;
  min: number;
  satoshi: number;
  status: string;
  usd: number;
}

export interface MindsBoostRateResponse extends MindsResponse {
  rate: number;
  balance: number;
  min: number;
  cap: number;
}

export interface MindsBoostResponse extends MindsResponse {
  status: string;
}

export interface MindsUserSearchResponse extends MindsResponse {
  entities: Array<any>;
}
