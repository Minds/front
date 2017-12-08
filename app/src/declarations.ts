import {AnnouncementComponent} from './components/announcements/announcement.component';
import {Topbar} from './components/topbar/topbar';
import {SidebarNavigation} from './components/sidebar-navigation/sidebar-navigation';
import {HovercardPopup} from './components/hovercard-popup/hovercard-popup';
import {MINDS_GRAPHS} from './components/graphs';
import {GraphSVG} from './components/graphs/svg';
import {GraphPoints} from './components/graphs/points';
import {TopbarNavigation} from './components/topbar/topbar-navigation';
import {FORM_COMPONENTS} from './components/forms/forms';
import {MindsCarousel} from './components/carousel';
import {AnalyticsImpressions} from './components/analytics/impressions';
import {MindsTooltip} from './components/tooltip/tooltip';
import { TagcloudComponent } from './components/tagcloud/tagcloud.component';

import {AdminAnalytics} from './controllers/admin/analytics/analytics';
import {AdminBoosts} from './controllers/admin/boosts/boosts';
import {AdminPages} from './controllers/admin/pages/pages';
import {AdminReports} from './controllers/admin/reports/reports';
import {AdminMonetization} from './controllers/admin/monetization/monetization';
import {AdminPrograms} from './controllers/admin/programs/programs.component';
import {AdminPayouts} from './controllers/admin/payouts/payouts.component';
import {AdminFeatured} from './controllers/admin/featured/featured';
import {AdminTagcloud} from './controllers/admin/tagcloud/tagcloud.component';
import {AdminVerify} from './controllers/admin/verify/verify.component';
import {ChannelSupporters} from './controllers/channels/supporters/supporters';
import {ChannelSubscribers} from './controllers/channels/subscribers/subscribers';
import {ChannelSubscriptions} from './controllers/channels/subscriptions/subscriptions';
import {ChannelSocialProfiles} from './controllers/channels/social-profiles/social-profiles';
import {NewsfeedBoostRotator} from './controllers/newsfeed/boost-rotator/boost-rotator';
import {SettingsGeneral} from './controllers/settings/general/general';
import {SettingsStatistics} from './controllers/settings/statistics/statistics';
import {SettingsDisableChannel} from './controllers/settings/disable/disable';
import {SettingsTwoFactor} from './controllers/settings/two-factor/two-factor';
import {SettingsSubscriptions} from './controllers/settings/subscriptions/subscriptions.component';
import { ComingSoon } from './controllers/home/comingsoon/comingsoon';
import {MediaTheatre} from './controllers/media/view/views/theatre';
import {MediaGrid} from './controllers/media/view/views/grid';
import {ThumbnailSelector} from './controllers/media/components/thumbnail-selector';
import { MediaViewRecommended } from './controllers/media/view/recommended/recommended.component';
import { RejectionReasonModalComponent } from './controllers/admin/boosts/modal/rejection-reason-modal.component';

export const MINDS_DECLARATIONS: any[] = [
  // Components
  AnnouncementComponent,
  Topbar,
  SidebarNavigation,
  HovercardPopup,
  MINDS_GRAPHS,
  GraphSVG,
  GraphPoints,
  TopbarNavigation,
  FORM_COMPONENTS,
  MindsCarousel,
  AnalyticsImpressions,
  MindsTooltip,
  TagcloudComponent,

  // Controllers; Controller-based directives
  AdminAnalytics,
  RejectionReasonModalComponent,
  AdminBoosts,
  AdminPages,
  AdminReports,
  AdminMonetization,
  AdminPrograms,
  AdminPayouts,
  AdminFeatured,
  AdminTagcloud,
  AdminVerify,
  ChannelSupporters,
  ChannelSubscribers,
  ChannelSubscriptions,
  ChannelSocialProfiles,
  NewsfeedBoostRotator,
  SettingsGeneral,
  SettingsStatistics,
  SettingsDisableChannel,
  SettingsTwoFactor,
  SettingsSubscriptions,
  ComingSoon,
  MediaTheatre,
  MediaGrid,
  ThumbnailSelector,
  MediaViewRecommended
];
