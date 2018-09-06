import {AdminAnalytics} from './controllers/admin/analytics/analytics';
import {AdminReportsDownload} from './controllers/admin/reports-download/reports-download';
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
import { AdminInteractions } from './controllers/admin/interactions/interactions.component';
import { InteractionsTableComponent } from './controllers/admin/interactions/table/table.component';
import { AdminPurchasesComponent } from './controllers/admin/purchases/purchases.component';
import { AdminWithdrawals } from './controllers/admin/withdrawals/withdrawals.component';

export const MINDS_DECLARATIONS: any[] = [
  // Components
  InteractionsTableComponent,

  // Controllers; Controller-based directives
  AdminAnalytics,
  AdminInteractions,
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
  AdminPurchasesComponent,
  AdminWithdrawals,
  AdminReportsDownload,
];
