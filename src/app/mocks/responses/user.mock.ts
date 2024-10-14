import { MindsUser } from '../../interfaces/entities';
/**
 * Mock user for testing with storybook.
 *
 * User is admin, plus and pro
 * copied from the @minds account
 */

// TODO can't use MindsUser bc it stays types for
// time_created and icontime are numbers

// const userMock: <MindsUser> = {
const userMock: any = {
  guid: '100000000000000519',
  type: 'user',
  subtype: false,
  time_created: '1349787581',
  time_updated: '1376600843',
  container_guid: '0',
  owner_guid: '100000000000000000',
  site_guid: '1',
  access_id: '2',
  tags: [
    'minds',
    'technology',
    'opensource',
    'freespeech',
    'blockchain',
    'minds',
    'crypto',
    'technology',
  ],
  nsfw: [],
  nsfw_lock: [],
  allow_comments: false,
  name: 'Minds',
  username: 'minds',
  language: 'en',
  icontime: '1635862076',
  legacy_guid: '519',
  featured_id: '531565912310951936',
  banned: 'no',
  ban_reason: false,
  website: '',
  briefdescription:
    'Welcome to the official Minds channel! Thank you for supporting Internet freedom. \n\nHere are some helpful links to get you started:\n\nBuy Tokens - \nhttps://minds.com/token\n\nUpgrade Your Channel - \nhttps://minds.com/upgrade\n\nRead Our Docs - \nhttps://developers.minds.com\n\nFAQ - \nhttps://minds.com/help\n\nContent Policy - \nhttps://minds.com/content-policy',
  gender: '',
  city: 'Earth',
  merchant: {
    service: 'stripe',
    id: 'acct_19WYikGRf8yRX40X',
    exclusive: {
      enabled: true,
      amount: 2,
      intro:
        'Crowdfund Minds to keep us free and independent! Supporting us enables you to join the chatroom of our video conferences where we will respond to all of your questions and ideas!',
    },
  },
  boostProPlus: false,
  fb: false,
  mature: 0,
  monetized: '',
  signup_method: false,
  social_profiles: [
    {
      key: 'twitter',
      value: 'https://twitter.com/minds',
    },
    {
      key: 'instagram',
      value: 'https://instagram.com/minds',
    },
    {
      key: 'linkedin',
      value: 'https://www.linkedin.com/company/minds-com/',
    },
    {
      key: 'facebook',
      value: 'https://www.facebook.com/mindsdotcom/',
    },
  ],
  feature_flags: false,
  programs: [],
  plus: true,
  hashtags: false,
  verified: true,
  founder: true,
  disabled_boost: false,
  boost_autorotate: true,
  categories: [],
  wire_rewards: null,
  pinned_posts: ['1195126387417759744', '1195126387417759744'],
  is_mature: false,
  mature_lock: false,
  last_accepted_tos: 1558597098,
  opted_in_hashtags: 3,
  last_avatar_upload: '1635862076',
  canary: true,
  theme: 'dark',
  toaster_notifications: false,
  mode: 0,
  btc_address: '36yjCYUyh8ytkxUnQgKWPFr9WB7o5rpbpJ',
  surge_token: '',
  hide_share_buttons: true,
  allow_unsubscribed_contact: false,
  dismissed_widgets: ['matrix', 'discovery-disclaimer-2020'],
  liquidity_spot_opt_out: 1,
  'thumbs:up:count': '0',
  'thumbs:down:count': '-372',
  'thumbs:up:user_guids': [],
  'thumbs:down:user_guids': [],
  did: 'did:web:minds.com:minds',
  chat: true,
  urn: 'urn:user:100000000000000519',
  subscribed: true,
  subscriber: true,
  subscriptions_count: 754,
  impressions: 31045689,
  boost_rating: 2,
  pro: true,
  plus_method: 'tokens',
  pro_method: 'tokens',
  rewards: true,
  p2p_media_enabled: false,
  is_admin: true,
  onchain_booster: 0,
  email_confirmed: true,
  eth_wallet: '0x1f28c6fb3Ea8bA23038C70A51d8986c5D1276A8d',
  rating: 1,
  disable_autoplay_videos: false,
  yt_channels: [
    {
      id: 'UCS-AJHxtG6oaIGA2-yEIzww',
      title: 'Minds',
      connected: 1597167578,
      auto_import: true,
    },
  ],
  avatar_url: {
    tiny: 'https://www.minds.com/icon/100000000000000519/tiny/1349787581/1635862076/1655219240',
    small:
      'https://www.minds.com/icon/100000000000000519/small/1349787581/1635862076/1655219240',
    medium:
      'https://www.minds.com/icon/100000000000000519/medium/1349787581/1635862076/1655219240',
    large:
      'https://www.minds.com/icon/100000000000000519/large/1349787581/1635862076/1655219240',
    master:
      'https://www.minds.com/icon/100000000000000519/master/1349787581/1635862076/1655219240',
  },
  carousels: [
    {
      guid: '1256337606490992640',
      top_offset: false,
      src: 'https://cdn.minds.com/fs/v1/banners/1256337606490992640/fat/',
    },
  ],
  blocked: false,
  blocked_by: false,
  pro_settings: {
    user_guid: '100000000000000519',
    domain: 'blog.minds.com',
    title: 'Minds',
    headline: '',
    text_color: '#000000',
    primary_color: '#1b85d6',
    plain_background_color: '#ffffff',
    tile_ratio: '16:9',
    footer_text: '',
    footer_links: [],
    tag_list: [],
    has_custom_logo: true,
    logo_image:
      'https://cdn.minds.com/fs/v1/pro/100000000000000519/logo/1615810130',
    has_custom_background: true,
    background_image:
      'https://cdn.minds.com/fs/v1/pro/100000000000000519/background/1615810130',
    featured_content: ['1195126377804414976'],
    scheme: 'light',
    custom_head: '',
    one_line_headline: '',
    styles: {
      text_color: '#000000',
      primary_color: '#1b85d6',
      plain_background_color: '#ffffff',
      transparent_background_color: '#ffffffa0',
      more_transparent_background_color: '#ffffff50',
      tile_ratio: '56.25%',
    },
    published: false,
    splash: false,
    time_updated: 1615810130,
    payout_method: 'tokens',
  },
};

export default userMock;
