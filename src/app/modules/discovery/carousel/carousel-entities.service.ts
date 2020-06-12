/**
 * Carousel entities service for the handling of
 * group membership and channel subscription.
 * @author Ben Hayward
 */
import { Component, ViewChild, OnDestroy, Injectable } from '@angular/core';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { ConfigsService } from '../../../common/services/configs.service';
import { GroupsService } from '../../groups/groups.service';
import { map, catchError } from 'rxjs/operators';
import { Client } from '../../../services/api';

export interface DisplayableEntity {
  guid: string;
  type: string;
  name: string;
  username?: string;
  icontime?: string;
  subscribed?: boolean;
  'is:member'?: boolean;
}

@Injectable()
export class CarouselEntitiesService implements OnDestroy {
  // // Channels TODO: Replace with live data via input on carousel component and setEntities.
  // public entities$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([
  //   {"guid":"1117477017890066434","owner_guid":"1117477017890066434","timestamp":null,"urn":"urn:user:1117477017890066434","entity":{"guid":"1117477017890066434","type":"user","subtype":false,"time_created":"1591803282","time_updated":false,"container_guid":"0","owner_guid":"0","site_guid":false,"access_id":"2","tags":[],"nsfw":[],"nsfw_lock":[],"allow_comments":false,"name":"testacc","username":"testacc","language":"en","icontime":"1591803282","legacy_guid":false,"featured_id":false,"banned":"no","ban_reason":false,"website":false,"briefdescription":"","gender":false,"city":false,"merchant":false,"boostProPlus":false,"fb":false,"mature":0,"monetized":false,"signup_method":false,"social_profiles":[],"feature_flags":false,"programs":[],"plus":false,"hashtags":false,"verified":false,"founder":false,"disabled_boost":false,"boost_autorotate":true,"categories":[],"wire_rewards":null,"pinned_posts":[],"is_mature":false,"mature_lock":false,"last_accepted_tos":1,"opted_in_hashtags":0,"last_avatar_upload":"0","canary":false,"theme":false,"toaster_notifications":true,"mode":0,"btc_address":"","surge_token":"","hide_share_buttons":false,"dismissed_widgets":["discovery-disclaimer-2020"],"urn":"urn:user:1117477017890066434","subscribed":false,"subscriber":false,"subscribers_count":0,"subscriptions_count":2,"impressions":275,"boost_rating":1,"pro":false,"pro_published":false,"rewards":false,"p2p_media_enabled":false,"is_admin":false,"onchain_booster":0,"email_confirmed":true,"eth_wallet":"","rating":1,"disable_autoplay_videos":false,"yt_channels":[]}},{"guid":"1117476547628896261","owner_guid":"1117476547628896261","timestamp":null,"urn":"urn:user:1117476547628896261","entity":{"guid":"1117476547628896261","type":"user","subtype":false,"time_created":"1591803170","time_updated":false,"container_guid":"0","owner_guid":"0","site_guid":false,"access_id":"2","tags":[],"nsfw":[],"nsfw_lock":[],"allow_comments":false,"name":"nemofin","username":"nemofin","language":"en","icontime":"1591803170","legacy_guid":false,"featured_id":false,"banned":"no","ban_reason":false,"website":false,"briefdescription":"","gender":false,"city":false,"merchant":false,"boostProPlus":false,"fb":false,"mature":0,"monetized":false,"signup_method":false,"social_profiles":[],"feature_flags":false,"programs":[],"plus":false,"hashtags":false,"verified":false,"founder":false,"disabled_boost":false,"boost_autorotate":true,"categories":[],"wire_rewards":null,"pinned_posts":[],"is_mature":false,"mature_lock":false,"last_accepted_tos":1,"opted_in_hashtags":0,"last_avatar_upload":"0","canary":false,"theme":false,"toaster_notifications":true,"mode":0,"btc_address":"","surge_token":"","hide_share_buttons":false,"dismissed_widgets":["discovery-disclaimer-2020"],"urn":"urn:user:1117476547628896261","subscribed":false,"subscriber":false,"subscribers_count":0,"subscriptions_count":2,"impressions":21,"boost_rating":1,"pro":false,"pro_published":false,"rewards":false,"p2p_media_enabled":false,"is_admin":false,"onchain_booster":0,"email_confirmed":true,"eth_wallet":"","rating":1,"disable_autoplay_videos":false,"yt_channels":[]}},{"guid":"1117161919476666375","owner_guid":"1117161919476666375","timestamp":null,"urn":"urn:user:1117161919476666375","entity":{"guid":"1117161919476666375","type":"user","subtype":false,"time_created":"1591728157","time_updated":false,"container_guid":"0","owner_guid":"0","site_guid":false,"access_id":"2","tags":[],"nsfw":[],"nsfw_lock":[],"allow_comments":false,"name":"minds","username":"minds","language":"en","icontime":"1591728157","legacy_guid":false,"featured_id":false,"banned":"no","ban_reason":false,"website":false,"briefdescription":"","gender":false,"city":false,"merchant":false,"boostProPlus":false,"fb":false,"mature":0,"monetized":false,"signup_method":false,"social_profiles":[],"feature_flags":false,"programs":[],"plus":false,"hashtags":false,"verified":false,"founder":false,"disabled_boost":false,"boost_autorotate":true,"categories":[],"wire_rewards":null,"pinned_posts":[],"is_mature":false,"mature_lock":false,"last_accepted_tos":1,"opted_in_hashtags":0,"last_avatar_upload":"0","canary":false,"theme":"dark","toaster_notifications":true,"mode":0,"btc_address":"","surge_token":"","hide_share_buttons":false,"dismissed_widgets":["discovery-disclaimer-2020"],"urn":"urn:user:1117161919476666375","subscribed":false,"subscriber":false,"subscriptions_count":1,"impressions":526,"boost_rating":1,"pro":false,"pro_published":false,"rewards":false,"p2p_media_enabled":false,"is_admin":true,"onchain_booster":0,"email_confirmed":true,"eth_wallet":"","rating":1,"disable_autoplay_videos":false,"yt_channels":[]}},
  //   {"guid":"1117477017890066434","owner_guid":"1117477017890066434","timestamp":null,"urn":"urn:user:1117477017890066434","entity":{"guid":"1117477017890066434","type":"user","subtype":false,"time_created":"1591803282","time_updated":false,"container_guid":"0","owner_guid":"0","site_guid":false,"access_id":"2","tags":[],"nsfw":[],"nsfw_lock":[],"allow_comments":false,"name":"testacc","username":"testacc","language":"en","icontime":"1591803282","legacy_guid":false,"featured_id":false,"banned":"no","ban_reason":false,"website":false,"briefdescription":"","gender":false,"city":false,"merchant":false,"boostProPlus":false,"fb":false,"mature":0,"monetized":false,"signup_method":false,"social_profiles":[],"feature_flags":false,"programs":[],"plus":false,"hashtags":false,"verified":false,"founder":false,"disabled_boost":false,"boost_autorotate":true,"categories":[],"wire_rewards":null,"pinned_posts":[],"is_mature":false,"mature_lock":false,"last_accepted_tos":1,"opted_in_hashtags":0,"last_avatar_upload":"0","canary":false,"theme":false,"toaster_notifications":true,"mode":0,"btc_address":"","surge_token":"","hide_share_buttons":false,"dismissed_widgets":["discovery-disclaimer-2020"],"urn":"urn:user:1117477017890066434","subscribed":false,"subscriber":false,"subscribers_count":0,"subscriptions_count":2,"impressions":275,"boost_rating":1,"pro":false,"pro_published":false,"rewards":false,"p2p_media_enabled":false,"is_admin":false,"onchain_booster":0,"email_confirmed":true,"eth_wallet":"","rating":1,"disable_autoplay_videos":false,"yt_channels":[]}},{"guid":"1117476547628896261","owner_guid":"1117476547628896261","timestamp":null,"urn":"urn:user:1117476547628896261","entity":{"guid":"1117476547628896261","type":"user","subtype":false,"time_created":"1591803170","time_updated":false,"container_guid":"0","owner_guid":"0","site_guid":false,"access_id":"2","tags":[],"nsfw":[],"nsfw_lock":[],"allow_comments":false,"name":"nemofin","username":"nemofin","language":"en","icontime":"1591803170","legacy_guid":false,"featured_id":false,"banned":"no","ban_reason":false,"website":false,"briefdescription":"","gender":false,"city":false,"merchant":false,"boostProPlus":false,"fb":false,"mature":0,"monetized":false,"signup_method":false,"social_profiles":[],"feature_flags":false,"programs":[],"plus":false,"hashtags":false,"verified":false,"founder":false,"disabled_boost":false,"boost_autorotate":true,"categories":[],"wire_rewards":null,"pinned_posts":[],"is_mature":false,"mature_lock":false,"last_accepted_tos":1,"opted_in_hashtags":0,"last_avatar_upload":"0","canary":false,"theme":false,"toaster_notifications":true,"mode":0,"btc_address":"","surge_token":"","hide_share_buttons":false,"dismissed_widgets":["discovery-disclaimer-2020"],"urn":"urn:user:1117476547628896261","subscribed":false,"subscriber":false,"subscribers_count":0,"subscriptions_count":2,"impressions":21,"boost_rating":1,"pro":false,"pro_published":false,"rewards":false,"p2p_media_enabled":false,"is_admin":false,"onchain_booster":0,"email_confirmed":true,"eth_wallet":"","rating":1,"disable_autoplay_videos":false,"yt_channels":[]}},{"guid":"1117161919476666375","owner_guid":"1117161919476666375","timestamp":null,"urn":"urn:user:1117161919476666375","entity":{"guid":"1117161919476666375","type":"user","subtype":false,"time_created":"1591728157","time_updated":false,"container_guid":"0","owner_guid":"0","site_guid":false,"access_id":"2","tags":[],"nsfw":[],"nsfw_lock":[],"allow_comments":false,"name":"minds","username":"minds","language":"en","icontime":"1591728157","legacy_guid":false,"featured_id":false,"banned":"no","ban_reason":false,"website":false,"briefdescription":"","gender":false,"city":false,"merchant":false,"boostProPlus":false,"fb":false,"mature":0,"monetized":false,"signup_method":false,"social_profiles":[],"feature_flags":false,"programs":[],"plus":false,"hashtags":false,"verified":false,"founder":false,"disabled_boost":false,"boost_autorotate":true,"categories":[],"wire_rewards":null,"pinned_posts":[],"is_mature":false,"mature_lock":false,"last_accepted_tos":1,"opted_in_hashtags":0,"last_avatar_upload":"0","canary":false,"theme":"dark","toaster_notifications":true,"mode":0,"btc_address":"","surge_token":"","hide_share_buttons":false,"dismissed_widgets":["discovery-disclaimer-2020"],"urn":"urn:user:1117161919476666375","subscribed":false,"subscriber":false,"subscriptions_count":1,"impressions":526,"boost_rating":1,"pro":false,"pro_published":false,"rewards":false,"p2p_media_enabled":false,"is_admin":true,"onchain_booster":0,"email_confirmed":true,"eth_wallet":"","rating":1,"disable_autoplay_videos":false,"yt_channels":[]}},
  //   {"guid":"1117477017890066434","owner_guid":"1117477017890066434","timestamp":null,"urn":"urn:user:1117477017890066434","entity":{"guid":"1117477017890066434","type":"user","subtype":false,"time_created":"1591803282","time_updated":false,"container_guid":"0","owner_guid":"0","site_guid":false,"access_id":"2","tags":[],"nsfw":[],"nsfw_lock":[],"allow_comments":false,"name":"testacc","username":"testacc","language":"en","icontime":"1591803282","legacy_guid":false,"featured_id":false,"banned":"no","ban_reason":false,"website":false,"briefdescription":"","gender":false,"city":false,"merchant":false,"boostProPlus":false,"fb":false,"mature":0,"monetized":false,"signup_method":false,"social_profiles":[],"feature_flags":false,"programs":[],"plus":false,"hashtags":false,"verified":false,"founder":false,"disabled_boost":false,"boost_autorotate":true,"categories":[],"wire_rewards":null,"pinned_posts":[],"is_mature":false,"mature_lock":false,"last_accepted_tos":1,"opted_in_hashtags":0,"last_avatar_upload":"0","canary":false,"theme":false,"toaster_notifications":true,"mode":0,"btc_address":"","surge_token":"","hide_share_buttons":false,"dismissed_widgets":["discovery-disclaimer-2020"],"urn":"urn:user:1117477017890066434","subscribed":false,"subscriber":false,"subscribers_count":0,"subscriptions_count":2,"impressions":275,"boost_rating":1,"pro":false,"pro_published":false,"rewards":false,"p2p_media_enabled":false,"is_admin":false,"onchain_booster":0,"email_confirmed":true,"eth_wallet":"","rating":1,"disable_autoplay_videos":false,"yt_channels":[]}},{"guid":"1117476547628896261","owner_guid":"1117476547628896261","timestamp":null,"urn":"urn:user:1117476547628896261","entity":{"guid":"1117476547628896261","type":"user","subtype":false,"time_created":"1591803170","time_updated":false,"container_guid":"0","owner_guid":"0","site_guid":false,"access_id":"2","tags":[],"nsfw":[],"nsfw_lock":[],"allow_comments":false,"name":"nemofin","username":"nemofin","language":"en","icontime":"1591803170","legacy_guid":false,"featured_id":false,"banned":"no","ban_reason":false,"website":false,"briefdescription":"","gender":false,"city":false,"merchant":false,"boostProPlus":false,"fb":false,"mature":0,"monetized":false,"signup_method":false,"social_profiles":[],"feature_flags":false,"programs":[],"plus":false,"hashtags":false,"verified":false,"founder":false,"disabled_boost":false,"boost_autorotate":true,"categories":[],"wire_rewards":null,"pinned_posts":[],"is_mature":false,"mature_lock":false,"last_accepted_tos":1,"opted_in_hashtags":0,"last_avatar_upload":"0","canary":false,"theme":false,"toaster_notifications":true,"mode":0,"btc_address":"","surge_token":"","hide_share_buttons":false,"dismissed_widgets":["discovery-disclaimer-2020"],"urn":"urn:user:1117476547628896261","subscribed":false,"subscriber":false,"subscribers_count":0,"subscriptions_count":2,"impressions":21,"boost_rating":1,"pro":false,"pro_published":false,"rewards":false,"p2p_media_enabled":false,"is_admin":false,"onchain_booster":0,"email_confirmed":true,"eth_wallet":"","rating":1,"disable_autoplay_videos":false,"yt_channels":[]}},{"guid":"1117161919476666375","owner_guid":"1117161919476666375","timestamp":null,"urn":"urn:user:1117161919476666375","entity":{"guid":"1117161919476666375","type":"user","subtype":false,"time_created":"1591728157","time_updated":false,"container_guid":"0","owner_guid":"0","site_guid":false,"access_id":"2","tags":[],"nsfw":[],"nsfw_lock":[],"allow_comments":false,"name":"minds","username":"minds","language":"en","icontime":"1591728157","legacy_guid":false,"featured_id":false,"banned":"no","ban_reason":false,"website":false,"briefdescription":"","gender":false,"city":false,"merchant":false,"boostProPlus":false,"fb":false,"mature":0,"monetized":false,"signup_method":false,"social_profiles":[],"feature_flags":false,"programs":[],"plus":false,"hashtags":false,"verified":false,"founder":false,"disabled_boost":false,"boost_autorotate":true,"categories":[],"wire_rewards":null,"pinned_posts":[],"is_mature":false,"mature_lock":false,"last_accepted_tos":1,"opted_in_hashtags":0,"last_avatar_upload":"0","canary":false,"theme":"dark","toaster_notifications":true,"mode":0,"btc_address":"","surge_token":"","hide_share_buttons":false,"dismissed_widgets":["discovery-disclaimer-2020"],"urn":"urn:user:1117161919476666375","subscribed":false,"subscriber":false,"subscriptions_count":1,"impressions":526,"boost_rating":1,"pro":false,"pro_published":false,"rewards":false,"p2p_media_enabled":false,"is_admin":true,"onchain_booster":0,"email_confirmed":true,"eth_wallet":"","rating":1,"disable_autoplay_videos":false,"yt_channels":[]}},
  //   {"guid":"1117477017890066434","owner_guid":"1117477017890066434","timestamp":null,"urn":"urn:user:1117477017890066434","entity":{"guid":"1117477017890066434","type":"user","subtype":false,"time_created":"1591803282","time_updated":false,"container_guid":"0","owner_guid":"0","site_guid":false,"access_id":"2","tags":[],"nsfw":[],"nsfw_lock":[],"allow_comments":false,"name":"testacc","username":"testacc","language":"en","icontime":"1591803282","legacy_guid":false,"featured_id":false,"banned":"no","ban_reason":false,"website":false,"briefdescription":"","gender":false,"city":false,"merchant":false,"boostProPlus":false,"fb":false,"mature":0,"monetized":false,"signup_method":false,"social_profiles":[],"feature_flags":false,"programs":[],"plus":false,"hashtags":false,"verified":false,"founder":false,"disabled_boost":false,"boost_autorotate":true,"categories":[],"wire_rewards":null,"pinned_posts":[],"is_mature":false,"mature_lock":false,"last_accepted_tos":1,"opted_in_hashtags":0,"last_avatar_upload":"0","canary":false,"theme":false,"toaster_notifications":true,"mode":0,"btc_address":"","surge_token":"","hide_share_buttons":false,"dismissed_widgets":["discovery-disclaimer-2020"],"urn":"urn:user:1117477017890066434","subscribed":false,"subscriber":false,"subscribers_count":0,"subscriptions_count":2,"impressions":275,"boost_rating":1,"pro":false,"pro_published":false,"rewards":false,"p2p_media_enabled":false,"is_admin":false,"onchain_booster":0,"email_confirmed":true,"eth_wallet":"","rating":1,"disable_autoplay_videos":false,"yt_channels":[]}},{"guid":"1117476547628896261","owner_guid":"1117476547628896261","timestamp":null,"urn":"urn:user:1117476547628896261","entity":{"guid":"1117476547628896261","type":"user","subtype":false,"time_created":"1591803170","time_updated":false,"container_guid":"0","owner_guid":"0","site_guid":false,"access_id":"2","tags":[],"nsfw":[],"nsfw_lock":[],"allow_comments":false,"name":"nemofin","username":"nemofin","language":"en","icontime":"1591803170","legacy_guid":false,"featured_id":false,"banned":"no","ban_reason":false,"website":false,"briefdescription":"","gender":false,"city":false,"merchant":false,"boostProPlus":false,"fb":false,"mature":0,"monetized":false,"signup_method":false,"social_profiles":[],"feature_flags":false,"programs":[],"plus":false,"hashtags":false,"verified":false,"founder":false,"disabled_boost":false,"boost_autorotate":true,"categories":[],"wire_rewards":null,"pinned_posts":[],"is_mature":false,"mature_lock":false,"last_accepted_tos":1,"opted_in_hashtags":0,"last_avatar_upload":"0","canary":false,"theme":false,"toaster_notifications":true,"mode":0,"btc_address":"","surge_token":"","hide_share_buttons":false,"dismissed_widgets":["discovery-disclaimer-2020"],"urn":"urn:user:1117476547628896261","subscribed":false,"subscriber":false,"subscribers_count":0,"subscriptions_count":2,"impressions":21,"boost_rating":1,"pro":false,"pro_published":false,"rewards":false,"p2p_media_enabled":false,"is_admin":false,"onchain_booster":0,"email_confirmed":true,"eth_wallet":"","rating":1,"disable_autoplay_videos":false,"yt_channels":[]}},{"guid":"1117161919476666375","owner_guid":"1117161919476666375","timestamp":null,"urn":"urn:user:1117161919476666375","entity":{"guid":"1117161919476666375","type":"user","subtype":false,"time_created":"1591728157","time_updated":false,"container_guid":"0","owner_guid":"0","site_guid":false,"access_id":"2","tags":[],"nsfw":[],"nsfw_lock":[],"allow_comments":false,"name":"minds","username":"minds","language":"en","icontime":"1591728157","legacy_guid":false,"featured_id":false,"banned":"no","ban_reason":false,"website":false,"briefdescription":"","gender":false,"city":false,"merchant":false,"boostProPlus":false,"fb":false,"mature":0,"monetized":false,"signup_method":false,"social_profiles":[],"feature_flags":false,"programs":[],"plus":false,"hashtags":false,"verified":false,"founder":false,"disabled_boost":false,"boost_autorotate":true,"categories":[],"wire_rewards":null,"pinned_posts":[],"is_mature":false,"mature_lock":false,"last_accepted_tos":1,"opted_in_hashtags":0,"last_avatar_upload":"0","canary":false,"theme":"dark","toaster_notifications":true,"mode":0,"btc_address":"","surge_token":"","hide_share_buttons":false,"dismissed_widgets":["discovery-disclaimer-2020"],"urn":"urn:user:1117161919476666375","subscribed":false,"subscriber":false,"subscriptions_count":1,"impressions":526,"boost_rating":1,"pro":false,"pro_published":false,"rewards":false,"p2p_media_enabled":false,"is_admin":true,"onchain_booster":0,"email_confirmed":true,"eth_wallet":"","rating":1,"disable_autoplay_videos":false,"yt_channels":[]}},
  //   {"guid":"1117477017890066434","owner_guid":"1117477017890066434","timestamp":null,"urn":"urn:user:1117477017890066434","entity":{"guid":"1117477017890066434","type":"user","subtype":false,"time_created":"1591803282","time_updated":false,"container_guid":"0","owner_guid":"0","site_guid":false,"access_id":"2","tags":[],"nsfw":[],"nsfw_lock":[],"allow_comments":false,"name":"testacc","username":"testacc","language":"en","icontime":"1591803282","legacy_guid":false,"featured_id":false,"banned":"no","ban_reason":false,"website":false,"briefdescription":"","gender":false,"city":false,"merchant":false,"boostProPlus":false,"fb":false,"mature":0,"monetized":false,"signup_method":false,"social_profiles":[],"feature_flags":false,"programs":[],"plus":false,"hashtags":false,"verified":false,"founder":false,"disabled_boost":false,"boost_autorotate":true,"categories":[],"wire_rewards":null,"pinned_posts":[],"is_mature":false,"mature_lock":false,"last_accepted_tos":1,"opted_in_hashtags":0,"last_avatar_upload":"0","canary":false,"theme":false,"toaster_notifications":true,"mode":0,"btc_address":"","surge_token":"","hide_share_buttons":false,"dismissed_widgets":["discovery-disclaimer-2020"],"urn":"urn:user:1117477017890066434","subscribed":false,"subscriber":false,"subscribers_count":0,"subscriptions_count":2,"impressions":275,"boost_rating":1,"pro":false,"pro_published":false,"rewards":false,"p2p_media_enabled":false,"is_admin":false,"onchain_booster":0,"email_confirmed":true,"eth_wallet":"","rating":1,"disable_autoplay_videos":false,"yt_channels":[]}},{"guid":"1117476547628896261","owner_guid":"1117476547628896261","timestamp":null,"urn":"urn:user:1117476547628896261","entity":{"guid":"1117476547628896261","type":"user","subtype":false,"time_created":"1591803170","time_updated":false,"container_guid":"0","owner_guid":"0","site_guid":false,"access_id":"2","tags":[],"nsfw":[],"nsfw_lock":[],"allow_comments":false,"name":"nemofin","username":"nemofin","language":"en","icontime":"1591803170","legacy_guid":false,"featured_id":false,"banned":"no","ban_reason":false,"website":false,"briefdescription":"","gender":false,"city":false,"merchant":false,"boostProPlus":false,"fb":false,"mature":0,"monetized":false,"signup_method":false,"social_profiles":[],"feature_flags":false,"programs":[],"plus":false,"hashtags":false,"verified":false,"founder":false,"disabled_boost":false,"boost_autorotate":true,"categories":[],"wire_rewards":null,"pinned_posts":[],"is_mature":false,"mature_lock":false,"last_accepted_tos":1,"opted_in_hashtags":0,"last_avatar_upload":"0","canary":false,"theme":false,"toaster_notifications":true,"mode":0,"btc_address":"","surge_token":"","hide_share_buttons":false,"dismissed_widgets":["discovery-disclaimer-2020"],"urn":"urn:user:1117476547628896261","subscribed":false,"subscriber":false,"subscribers_count":0,"subscriptions_count":2,"impressions":21,"boost_rating":1,"pro":false,"pro_published":false,"rewards":false,"p2p_media_enabled":false,"is_admin":false,"onchain_booster":0,"email_confirmed":true,"eth_wallet":"","rating":1,"disable_autoplay_videos":false,"yt_channels":[]}},{"guid":"1117161919476666375","owner_guid":"1117161919476666375","timestamp":null,"urn":"urn:user:1117161919476666375","entity":{"guid":"1117161919476666375","type":"user","subtype":false,"time_created":"1591728157","time_updated":false,"container_guid":"0","owner_guid":"0","site_guid":false,"access_id":"2","tags":[],"nsfw":[],"nsfw_lock":[],"allow_comments":false,"name":"minds","username":"minds","language":"en","icontime":"1591728157","legacy_guid":false,"featured_id":false,"banned":"no","ban_reason":false,"website":false,"briefdescription":"","gender":false,"city":false,"merchant":false,"boostProPlus":false,"fb":false,"mature":0,"monetized":false,"signup_method":false,"social_profiles":[],"feature_flags":false,"programs":[],"plus":false,"hashtags":false,"verified":false,"founder":false,"disabled_boost":false,"boost_autorotate":true,"categories":[],"wire_rewards":null,"pinned_posts":[],"is_mature":false,"mature_lock":false,"last_accepted_tos":1,"opted_in_hashtags":0,"last_avatar_upload":"0","canary":false,"theme":"dark","toaster_notifications":true,"mode":0,"btc_address":"","surge_token":"","hide_share_buttons":false,"dismissed_widgets":["discovery-disclaimer-2020"],"urn":"urn:user:1117161919476666375","subscribed":false,"subscriber":false,"subscriptions_count":1,"impressions":526,"boost_rating":1,"pro":false,"pro_published":false,"rewards":false,"p2p_media_enabled":false,"is_admin":true,"onchain_booster":0,"email_confirmed":true,"eth_wallet":"","rating":1,"disable_autoplay_videos":false,"yt_channels":[]}}],
  // );

  // Groups TODO: Replace with live data via input on carousel component and setEntities.
  public entities$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([
    {
      guid: '1117950459127009290',
      owner_guid: '758091093068750862',
      timestamp: null,
      urn: 'urn:group:796111780160774144',
      entity: {
        guid: '1117950459127009290',
        type: 'group',
        name: 'Constitutional Conservative',
        brief_description:
          'interested in truth, conservative politics, the constitution, expose the deep state, reveal the truth.',
        icon_time: 1515183840,
        banner: '',
        banner_position: 0,
        membership: 2,
        moderated: 0,
        default_view: 0,
        featured: 0,
        featured_id: null,
        tags: [],
        boost_rejection_reason: -1,
        mature: false,
        rating: 1,
        videoChatDisabled: 0,
        conversationDisabled: 0,
        pinned_posts: [],
        owner_guid: 758091093068750800,
        'members:count': 896,
        'requests:count': 0,
        icontime: 1515183840,
        briefdescription:
          'interested in truth, conservative politics, the constitution, expose the deep state, reveal the truth.',
        nsfw: [],
        nsfw_lock: [],
        'is:owner': false,
        'is:moderator': false,
        'is:member': false,
        'is:creator': false,
        'is:awaiting': false,
        urn: 'urn:group:796111780160774144',
        'comments:count': 4,
      },
    },
    {
      guid: '595338464468148242',
      owner_guid: '551693450815217672',
      timestamp: null,
      urn: 'urn:group:595338464468148242',
      entity: {
        guid: '595338464468148242',
        type: 'group',
        name: '#Painting #Illustrations #Comics #SciFi ',
        brief_description:
          "Viewer discretion is advised\nA place to share Art's pics but don't forget to mention the author when you know his name. \n\nIf it's not a painting, choose a more appropriate group!\n\nmoderator : @LaRevolutionEstEnMarche\nI delete publications not related to the topics of this group.\nNo Porn - No Kek.\nPlease avoid poor quality images, blurry, and pixelized \nThanks",
        icon_time: 1561774771,
        banner: 1561774113,
        banner_position: -34,
        membership: 2,
        moderated: 0,
        default_view: 0,
        featured: 0,
        featured_id: null,
        tags: [
          'Cartoons',
          'Comics',
          'Illustrations',
          'SciFi',
          'painting',
          'DigitalArt',
        ],
        boost_rejection_reason: 7,
        mature: false,
        rating: 1,
        videoChatDisabled: 0,
        conversationDisabled: 0,
        pinned_posts: [
          '1084111681982377984',
          '1106341798747602944',
          '1108719215186624512',
        ],
        owner_guid: 551693450815217660,
        'members:count': 1021,
        'requests:count': 0,
        icontime: 1561774771,
        briefdescription:
          "Viewer discretion is advised\nA place to share Art's pics but don't forget to mention the author when you know his name. \n\nIf it's not a painting, choose a more appropriate group!\n\nmoderator : @LaRevolutionEstEnMarche\nI delete publications not related to the topics of this group.\nNo Porn - No Kek.\nPlease avoid poor quality images, blurry, and pixelized \nThanks",
        nsfw: [],
        nsfw_lock: [],
        'is:owner': false,
        'is:moderator': false,
        'is:member': false,
        'is:creator': false,
        'is:awaiting': false,
        urn: 'urn:group:595338464468148242',
        'comments:count': 29,
      },
    },
    {
      guid: '799442120227852288',
      owner_guid: '799361686887735299',
      timestamp: null,
      urn: 'urn:group:799442120227852288',
      entity: {
        guid: '1117950459127009290',
        type: 'group',
        name: 'Science',
        brief_description:
          "Interact with peers with similar interests in science, regardless of political and other differences.\nPLEASE read and adhere to the simple rules:  https://www.minds.com/newsfeed/799442995502710784\n\nNot a rule, but a request:  Make your posts interesting.  Don't just copy and paste a clinical summary.  Give a title and state something exciting about what you're posting.",
        icon_time: 1515977856,
        banner: 1515977858,
        banner_position: 0,
        membership: 2,
        moderated: 0,
        default_view: 0,
        featured: 0,
        featured_id: null,
        tags: [
          'science',
          'space',
          'physics',
          'artificial',
          'intelligence',
          'atomic',
          'quantum',
          'particle',
        ],
        boost_rejection_reason: -1,
        mature: false,
        rating: 1,
        videoChatDisabled: 0,
        conversationDisabled: 0,
        pinned_posts: [],
        owner_guid: 799361686887735300,
        'members:count': 308,
        'requests:count': 0,
        icontime: 1515977856,
        briefdescription:
          "Interact with peers with similar interests in science, regardless of political and other differences.\nPLEASE read and adhere to the simple rules:  https://www.minds.com/newsfeed/799442995502710784\n\nNot a rule, but a request:  Make your posts interesting.  Don't just copy and paste a clinical summary.  Give a title and state something exciting about what you're posting.",
        nsfw: [],
        nsfw_lock: [],
        'is:owner': false,
        'is:moderator': false,
        'is:member': false,
        'is:creator': false,
        'is:awaiting': false,
        urn: 'urn:group:799442120227852288',
        'comments:count': 6,
      },
    },
    {
      guid: '715569732048134144',
      owner_guid: '712447926529433608',
      timestamp: null,
      urn: 'urn:group:715569732048134144',
      entity: {
        guid: '715569732048134144',
        type: 'group',
        name: 'LoveHasWon Spiritual Intuitive Healing',
        brief_description:
          'Welcome to LoveHasWon Spiritual Healing & Awakening! The Awakening Session accelerates your Awakening as we guide you on your path towards Divine Intelligence and share in the energies of expansion. In addition we help you remember your part of the Divine',
        icon_time: 1495981394,
        banner: 1495981119,
        banner_position: -29,
        membership: 2,
        moderated: 0,
        default_view: 0,
        featured: 0,
        featured_id: null,
        tags: [
          'SpiritualHealing',
          'Spirituality',
          'Consciousness',
          'Ascension',
          'Healing',
          'LifeCoaching',
          'NaturalHealing',
          'EnergyHealing',
          'Wellness',
          'AlternativeMedicine',
        ],
        boost_rejection_reason: -1,
        mature: false,
        rating: 1,
        videoChatDisabled: 0,
        conversationDisabled: 0,
        pinned_posts: [],
        owner_guid: 712447926529433600,
        'members:count': 28,
        'requests:count': 0,
        icontime: 1495981394,
        briefdescription:
          'Welcome to LoveHasWon Spiritual Healing & Awakening! The Awakening Session accelerates your Awakening as we guide you on your path towards Divine Intelligence and share in the energies of expansion. In addition we help you remember your part of the Divine',
        nsfw: [],
        nsfw_lock: [],
        'is:owner': false,
        'is:moderator': false,
        'is:member': false,
        'is:creator': false,
        'is:awaiting': false,
        urn: 'urn:group:715569732048134144',
        'comments:count': 4,
      },
    },
    {
      guid: '1117950459127009290',
      owner_guid: '712447926529433608',
      timestamp: null,
      urn: 'urn:group:715566058341146624',
      entity: {
        guid: '1117950459127009290',
        type: 'group',
        name: 'LoveHasWon',
        brief_description:
          'Providing Esoteric Information of Spirituality, Ascension, Meditation, Astrology, Natural Healing. Nutrition and Services in Spiritual Intuitive Healing & Life Coaching. Visit our site: http://www.lovehaswon.org/\n\nTo Schedule a Spiritual Intuitive Healing',
        icon_time: 1495980244,
        banner: 1495980245,
        banner_position: -43,
        membership: 2,
        moderated: 0,
        default_view: 0,
        featured: 0,
        featured_id: null,
        tags: [
          'Spirituality',
          'Ascension',
          'Meditation',
          'Consciousness',
          'Astrology',
          'Healing',
          'Nutrition',
          'Love',
          'Unity',
          'Heart',
          'MotherEarth',
          'LifeCoaching',
          'AlternativeMedicine',
          'Health',
          'AlkalineWater',
          'AngelMessages',
        ],
        boost_rejection_reason: -1,
        mature: false,
        rating: 1,
        videoChatDisabled: 0,
        conversationDisabled: 0,
        pinned_posts: [],
        owner_guid: 712447926529433600,
        'members:count': 31,
        'requests:count': 0,
        icontime: 1495980244,
        briefdescription:
          'Providing Esoteric Information of Spirituality, Ascension, Meditation, Astrology, Natural Healing. Nutrition and Services in Spiritual Intuitive Healing & Life Coaching. Visit our site: http://www.lovehaswon.org/\n\nTo Schedule a Spiritual Intuitive Healing',
        nsfw: [],
        nsfw_lock: [],
        'is:owner': false,
        'is:moderator': false,
        'is:member': false,
        'is:creator': false,
        'is:awaiting': false,
        urn: 'urn:group:715566058341146624',
        'comments:count': 4,
      },
    },
  ]);

  private buttonClickSubscription: Subscription;

  constructor(
    private configs: ConfigsService,
    private groupsService: GroupsService,
    private client: Client
  ) {}

  ngOnDestroy(): void {
    this.destroySubscriptions();
  }

  /**
   * Set the observable array.
   * @param { BehaviorSubject<DisplayableEntity[]> } value$ - the observable to be set.
   */
  public setEntities(value$: BehaviorSubject<DisplayableEntity[]>): void {
    this.entities$ = value$;
  }

  /**
   * Join a group
   * @param { DisplayableEntity } - Group entity to join.
   * @returns { Promise<void> } - Awaitable.
   */
  public async joinGroup(entity: DisplayableEntity): Promise<void> {
    this.groupsService.join(entity);
    this.triggerToggle(entity);
  }

  /**
   * Leave a group
   * @param { DisplayableEntity } - Group entity to leave.
   * @returns { Promise<void> } - Awaitable.
   */
  public async leaveGroup(entity: DisplayableEntity) {
    this.groupsService.leave(entity);
    this.triggerToggle(entity);
  }

  /**
   * Subscribes to a channel and toggles state change in this.entities$.
   * @param { DisplayableEntity } - Channel entity to subscribe to.
   * @returns { Promise<void> } - Awaitable.
   */
  public async subscribeToChannel(entity: DisplayableEntity) {
    this.subscribe(entity);
    this.triggerToggle(entity);
  }

  /**
   * Unsubscribes to a channel and toggles state change in this.entities$.
   * @param { DisplayableEntity } - Channel entity to unsubscribe to.
   * @returns { Promise<void> } - Awaitable.
   */
  public async unsubscribeFromChannel(entity: DisplayableEntity) {
    this.unsubscribe(entity);
    this.triggerToggle(entity);
  }

  /**
   * Unsubscribes to a channel and toggles state change in this.entities$.
   * @param { DisplayableEntity } - Channel entity to unsubscribe to.
   * @returns { Promise<void> } - Awaitable.
   */
  private async triggerToggle(entity: DisplayableEntity): Promise<void> {
    try {
      this.buttonClickSubscription = this.entities$
        .pipe(
          map(entities => {
            return entities.map(item => {
              if (item.entity.type === 'group' && item.guid === entity.guid) {
                item.entity['is:member'] = !item.entity['is:member'];
              } else if (
                item.entity.type === 'user' &&
                item.guid === entity.guid
              ) {
                item.entity.subscribed = !item.entity.subscribed;
              }
              return entities;
            });
          }),
          catchError(e => {
            console.error(e);
            return of(this.entities$); // Reset.
          })
        )
        .subscribe(); //trigger
      this.destroySubscriptions();
    } catch (e) {
      this.destroySubscriptions();
      return;
    }
  }

  /**
   * Subscribes to a channel entity.
   * @param { DisplayableEntity } - Channel entity to be subscribed to.
   * @returns { Promise<void> } - Awaitable.
   */
  async subscribe(entity: DisplayableEntity): Promise<void> {
    try {
      const response = (await this.client.post(
        'api/v1/subscribe/' + entity.guid
      )) as any;

      if (!response || response.error) {
        throw new Error(response.error || 'Invalid server response');
      }
    } catch (e) {
      // console.log(e)
    }
  }

  /**
   * Unsubscribes to a channel entity.
   * @param { DisplayableEntity } - Channel entity to be unsubscribed from.
   * @returns { Promise<void> } - Awaitable.
   */
  async unsubscribe(entity: DisplayableEntity): Promise<void> {
    try {
      const response = (await this.client.delete(
        'api/v1/subscribe/' + entity.guid
      )) as any;

      if (!response || response.error) {
        throw new Error(response.error || 'Invalid server response');
      }
    } catch (e) {
      // console.log(e)
    }
  }

  /**
   * Teardown all subscriptions.
   * @returns { void }
   */
  private destroySubscriptions(): void {
    if (this.buttonClickSubscription) {
      this.buttonClickSubscription.unsubscribe();
    }
  }
}
