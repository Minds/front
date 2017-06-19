import {MINDS_PIPES} from './pipes/pipes';

import {Hovercard} from './directives/hovercard';
import {AutoGrow} from './directives/autogrow';
import {TagsLinks} from './directives/tags';
import {ScrollLock} from './directives/scroll-lock';
import {Emoji} from './directives/emoji';

import {AnnouncementComponent} from './components/announcements/announcement.component';
import {Topbar} from './components/topbar/topbar';
import {SidebarNavigation} from './components/sidebar-navigation/sidebar-navigation';
import {
  BoostModal,
  Modal,
  SignupModal,
  RemindComposerModal,
  ShareModal,
  ReportModal,
  ConfirmModal,
  SignupOnActionModal,
  SignupOnScrollModal,
  TranslateModal
} from './components/modal/modal';
import {HovercardPopup} from './components/hovercard-popup/hovercard-popup';
import {MINDS_GRAPHS} from './components/graphs';
import {MindsBanner, MindsFatBanner} from './components/banner';
import {GraphSVG} from './components/graphs/svg';
import {GraphPoints} from './components/graphs/points';
import {Translate} from './components/translate/translate';
import {TopbarNavigation} from './components/topbar/topbar-navigation';
import {BUTTON_COMPONENTS} from './components/buttons';
import {BoostAds} from './components/ads/boost';
import {ThirdPartyNetworksFacebook} from './components/third-party-networks/facebook';
import {MindsVideo, VideoAds} from './components/video';
import {SocialIcons} from './components/social-icons/social-icons';
import {MindsAvatar} from './components/avatar';
import {Tutorial} from './components/tutorial/tutorial';
import {MindsTinymce} from './components/editors/tinymce';
import {FORM_COMPONENTS} from './components/forms/forms';
import {MindsRichEmbed} from './components/rich-embed/rich-embed';
import {Scheduler} from './components/scheduler/scheduler';
import {MindsCarousel} from './components/carousel';
import {InviteModal} from './components/modal/invite/invite';
import {AnalyticsImpressions} from './components/analytics/impressions';
import {GoogleAds} from './components/ads/google-ads';
import {RevContent} from './components/ads/revcontent';
import {Taboola} from './components/ads/taboola';
import {TagsInput} from './components/forms/tags-input/tags';
import {MindsEmoji} from './components/emoji/emoji';
import {MindsTooltip} from './components/tooltip/tooltip';
import {ThirdPartyNetworksSelector} from './components/third-party-networks/selector';
import {OnboardingCategoriesSelector} from './components/onboarding/categories-selector/categories-selector';
import {PDAds} from './components/ads/pd-ads';
import { PayWall } from './controllers/payments/paywall/paywall.component';
import { PaywallCancelButton } from './controllers/payments/paywall/paywall-cancel.component';
import {Textarea} from './components/editors/textarea.component';
import { TagcloudComponent } from './components/tagcloud/tagcloud.component';
import { CaptchaComponent } from './components/captcha/captcha.component';

import {CARDS} from './controllers/cards/cards';
import {SearchBar} from './controllers/search/bar';
import {Notification} from './controllers/notifications/notification';
import {AdminAnalytics} from './controllers/admin/analytics/analytics';
import {AdminBoosts} from './controllers/admin/boosts/boosts';
import {AdminPages} from './controllers/admin/pages/pages';
import {AdminReports} from './controllers/admin/reports/reports';
import {AdminMonetization} from './controllers/admin/monetization/monetization';
import {AdminPrograms} from './controllers/admin/programs/programs.component';
import {AdminPayouts} from './controllers/admin/payouts/payouts.component';
import {AdminFeatured} from './controllers/admin/featured/featured';
import {AdminTagcloud} from './controllers/admin/tagcloud/tagcloud.component';
import {BoostFullNetwork} from './controllers/boosts/boost/full-network/full-network';
import {BoostP2P} from './controllers/boosts/boost/p2p/p2p';

import {Comments} from './controllers/comments/comments';
import {ActivityPreview} from './controllers/cards/activity/preview';
import {Boost} from './controllers/boosts/boost/boost';
import {Remind} from './controllers/cards/remind/remind';
import {ChannelModules} from './controllers/channels/modules/modules';
import {ChannelSupporters} from './controllers/channels/supporters/supporters';
import {ChannelSubscribers} from './controllers/channels/subscribers/subscribers';
import {ChannelSubscriptions} from './controllers/channels/subscriptions/subscriptions';
import {ChannelSocialProfiles} from './controllers/channels/social-profiles/social-profiles';
import {Poster} from './controllers/newsfeed/poster/poster';
import {CommentsScrollDirective} from './controllers/comments/scroll';
import {NewsfeedBoostRotator} from './controllers/newsfeed/boost-rotator/boost-rotator';
import {SettingsGeneral} from './controllers/settings/general/general';
import {SettingsStatistics} from './controllers/settings/statistics/statistics';
import {SettingsDisableChannel} from './controllers/settings/disable/disable';
import {SettingsTwoFactor} from './controllers/settings/two-factor/two-factor';
import {SettingsSubscriptions} from './controllers/settings/subscriptions/subscriptions.component';
import {SearchBarSuggestions} from './controllers/search/suggestions/suggestions';
import { ComingSoon } from './controllers/home/comingsoon/comingsoon';

export const MINDS_DECLARATIONS: any[] = [
  MINDS_PIPES,

  // Directives
  Hovercard,
  AutoGrow,
  TagsLinks,
  ScrollLock,
  Emoji,

  // Components
  AnnouncementComponent,
  Topbar,
  SidebarNavigation,
  BoostModal,
  Modal,
  SignupModal,
  SignupOnScrollModal,
  HovercardPopup,
  MINDS_GRAPHS,
  MindsBanner,
  GraphSVG,
  GraphPoints,
  Translate,
  TopbarNavigation,
  BUTTON_COMPONENTS,
  BoostAds,
  ThirdPartyNetworksFacebook,
  MindsVideo,
  SocialIcons,
  MindsAvatar,
  Tutorial,
  MindsTinymce,
  FORM_COMPONENTS,
  MindsRichEmbed,
  RemindComposerModal,
  Scheduler,
  ShareModal,
  ReportModal,
  ConfirmModal,
  VideoAds,
  MindsFatBanner,
  MindsCarousel,
  InviteModal,
  AnalyticsImpressions,
  GoogleAds,
  RevContent,
  Taboola,
  TagsInput,
  SignupOnActionModal,
  MindsEmoji,
  MindsTooltip,
  ThirdPartyNetworksSelector,
  TranslateModal,
  OnboardingCategoriesSelector,
  PDAds,
  PayWall,
  PaywallCancelButton,
  Textarea,
  TagcloudComponent,
  CaptchaComponent,

  // Controllers; Controller-based directives
  CARDS,
  SearchBar,
  Notification,
  AdminAnalytics,
  AdminBoosts,
  AdminPages,
  AdminReports,
  AdminMonetization,
  AdminPrograms,
  AdminPayouts,
  AdminFeatured,
  AdminTagcloud,
  BoostFullNetwork,
  BoostP2P,

  Comments,
  ActivityPreview,
  Boost,
  Remind,
  ChannelSupporters,
  ChannelSubscribers,
  ChannelSubscriptions,
  ChannelModules,
  ChannelSocialProfiles,
  Poster,
  CommentsScrollDirective,
  NewsfeedBoostRotator,
  SettingsGeneral,
  SettingsStatistics,
  SettingsDisableChannel,
  SettingsTwoFactor,
  SettingsSubscriptions,
  SearchBarSuggestions,
  ComingSoon,
];
