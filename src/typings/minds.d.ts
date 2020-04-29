// Type definitions for Minds
interface Minds {
  MindsContext: string;
  MindsEmbed: any;
  LoggedIn: boolean;
  Admin?: boolean;
  user: any;
  wallet: any;
  navigation: MindsNavigation | any;
  cdn_url: string;
  cdn_assets_url: string;
  site_url: string;
  cinemr_url: string;
  notifications_count: number;
  socket_server: string;
  thirdpartynetworks: any;
  categories: any;
  languages: any;
  language: any;
  stripe_key?: any;
  recaptchaKey?: string;
  max_video_length?: number;
  max_video_file_size?: number;
  features?: any;
  blockchain?: any;
  sale?: boolean | string;
  last_tos_update: number;
  tags: string[];
  pro?: any;
  handlers?: { pro: string; plus: string };
  upgrades?: {
    pro: {
      monthly: { tokens: number; usd: number };
      yearly: { tokens: number; usd: number };
    };
    plus: {
      monthly: { tokens: number; usd: number };
      yearly: { tokens: number; usd: number };
    };
  };
  contribution_values: { [key: string]: number };
  from_email_confirmation?: boolean;
}

interface MindsNavigation {
  topbar: any;
  sidebar: any;
}

interface Window {
  Minds: Minds;
  componentHandler: any;
  ga: any;
  adsbygoogle?: any;
  onErrorCallback?: any;
  onSuccessCallback?: any;
  BraintreeLoaded?: any;
  io?: any;
  google?: any;
  twoOhSix?: any;
  web3?: any;
  ethereum?: any;
  sale?: boolean | string;
  _inMemoryStorageAdapterDb?: any;
}
declare var window: Window;
