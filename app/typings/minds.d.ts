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
  site_url: string;
  notifications_count: number;
  socket_server: string;
  thirdpartynetworks: any;
  categories: any;
  language: any;
  stripe_key?: any;
  recaptchaKey?: string;
  max_video_length?: number;
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
}
declare var window: Window;

declare var MaterialDatetimePicker;
