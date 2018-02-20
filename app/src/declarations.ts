import {HovercardPopup} from './components/hovercard-popup/hovercard-popup';
import {MINDS_GRAPHS} from './components/graphs';
import {GraphSVG} from './components/graphs/svg';
import {GraphPoints} from './components/graphs/points';
import {FORM_COMPONENTS} from './components/forms/forms';
import {AnalyticsImpressions} from './components/analytics/impressions';
import {MindsTooltip} from './components/tooltip/tooltip';

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
import { RejectionReasonModalComponent } from './controllers/admin/boosts/modal/rejection-reason-modal.component';

export const MINDS_DECLARATIONS: any[] = [
  // Components
  HovercardPopup,
  MINDS_GRAPHS,
  GraphSVG,
  GraphPoints,
  FORM_COMPONENTS,
  AnalyticsImpressions,
  MindsTooltip,

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
];
