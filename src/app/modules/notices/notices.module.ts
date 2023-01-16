import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { FeedNoticeComponent } from './template/feed-notice.component';
import { BuildYourAlgorithmNoticeComponent } from './panels/build-your-algorithm/build-your-algorithm-notice.component';
import { VerifyEmailNoticeComponent } from './panels/verify-email/verify-email-notice.component';
import { FeedNoticeOutletComponent } from './outlet/feed-notice-outlet.component';
import { EnablePushNotificationsNoticeComponent } from './panels/enable-push-notifications/enable-push-notifications-notice.component';
import { UpdateTagsNoticeComponent } from './panels/update-tags/update-tags-notice.component';
import { SetupChannelNoticeComponent } from './panels/setup-channel/setup-channel-notice.component';
import { VerifyUniquenessNoticeComponent } from './panels/verify-uniqueness/verify-uniqueness-notice.component';
import { ConnectWalletNoticeComponent } from './panels/connect-wallet/connect-wallet-notice.component';
import { SupermindPendingNoticeComponent } from './panels/supermind-pending/supermind-pending-notice.component';
import { BoostChannelNoticeComponent } from './panels/boost-channel/boost-channel-notice.component';

@NgModule({
  imports: [CommonModule, NgCommonModule],
  declarations: [
    FeedNoticeComponent,
    FeedNoticeOutletComponent,
    VerifyEmailNoticeComponent,
    SetupChannelNoticeComponent,
    VerifyUniquenessNoticeComponent,
    ConnectWalletNoticeComponent,
    BuildYourAlgorithmNoticeComponent,
    EnablePushNotificationsNoticeComponent,
    UpdateTagsNoticeComponent,
    SupermindPendingNoticeComponent,
    BoostChannelNoticeComponent,
  ],
  exports: [FeedNoticeOutletComponent],
})
export class NoticesModule {}
