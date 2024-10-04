/**
 * Activity Object
 */
import { SupermindSettings } from '../modules/settings-v2/payments/supermind/supermind.types';
import { WireRewardsStruc } from '../modules/wire/interfaces/wire.interfaces';

export type BitBoolean = 0 | 1;

export interface MindsActivityObject {
  activity: Array<any>;
  pinned: Array<any>;
  allow_comments: boolean;
}

export interface MindsBlogEntity {
  guid: string;
  title: string;
  description: string;
  ownerObj: any;
  spam?: boolean;
  deleted?: boolean;
  paywall?: boolean;
  wire_threshold?: any;
  mature?: boolean;
  slug?: string;
  route?: string;
  header_bg?: string;
  mature_visibility?: boolean;
  monetized?: boolean;
  time_created?: number;
  time_published?: number;
  access_id?: number;
  license?: string;
  allow_comments?: boolean;
  custom_meta?: {
    title: string;
    description: string;
    author: string;
  };
  perma_url?: string;
  thumbnail?: string;
  editor_version?: string;
}

export interface Message {}

export interface KeyVal {
  key: string;
  value: any;
}

export interface Tag {
  tag: string;
  label: string;
  selected?: boolean;
}

export enum ChannelMode {
  PUBLIC = 0,
  MODERATED = 1,
  CLOSED = 2,
}

export interface MindsUser {
  type: 'user';
  guid: string;
  name: string;
  username: string;
  time_created: number;
  chat?: boolean;
  icontime: number;
  avatar_url?: {
    tiny: string;
    small: string;
    medium: string;
    large: string;
    master: string;
  };
  blocked?: boolean;
  blocked_by?: boolean;
  carousels?: any[] | boolean;
  city?: string;
  social_profiles?: KeyVal[];
  wire_rewards?: WireRewardsStruc;
  spam?: boolean;
  deleted?: boolean;
  banned?: any;
  pinned_posts?: Array<string>;
  show_boosts?: boolean;
  merchant?: any;
  briefdescription?: string;
  activity_count?: number;
  supporters_count?: number;
  subscribers_count?: number;
  subscriber?: boolean;
  subscriptions_count?: number;
  impressions?: number;
  subscribed?: boolean;
  rating?: number;
  eth_wallet?: string;
  btc_address?: string;
  is_admin?: boolean;
  is_mature?: boolean;
  mature_lock?: boolean;
  tags?: Array<string>;
  toaster_notifications?: boolean;
  pro?: boolean;
  pro_settings?: {
    logo_image: string;
    tag_list?: Tag[];
    background_image: string;
    title: string;
    headline: string;
    one_line_headline: string;
    footer_text: string;
    footer_links: { href: string; title: string }[];
    scheme: string;
    featured_content?: Array<string>;
    tile_ratio?: string;
    styles?: { [key: string]: string };
    domain: string;
    has_custom_logo?: boolean;
    has_custom_background?: boolean;
    splash?: boolean;
  };
  mode: ChannelMode;
  nsfw: Array<number>;
  plus?: boolean;
  disable_autoplay_videos?: boolean;
  dob?: string;
  public_dob?: boolean | BitBoolean;
  mature?: number | boolean;
  enabled?: string | boolean;
  not_found?: boolean;
  email?: string;
  seed?: boolean;
  require_login?: boolean;
  email_confirmed?: boolean;
  supermind_settings?: SupermindSettings;
  boosted?: boolean;
  boosted_guid?: string;
  urn?: string;
  canonical_url?: string; // for activity pub users
}

export interface MindsGroup {
  guid: string;
  type: string;
  name: string;
  banner: boolean;
  icontime?: string;
}
