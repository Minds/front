import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { FeedNoticeComponent } from './feed-notice.component';
import { BuildYourAlgorithmNoticeComponent } from './build-your-algorithm/build-your-algorithm-notice.component';
import { VerifyEmailNoticeComponent } from './verify-email/verify-email-notice.component';
import { FeedNoticeOutletComponent } from './feed-notice-outlet.component';
import { EnablePushNotificationsNoticeComponent } from './enable-push-notifications/enable-push-notifications-notice.component';

@NgModule({
  imports: [CommonModule, NgCommonModule],
  declarations: [
    FeedNoticeComponent,
    FeedNoticeOutletComponent,
    BuildYourAlgorithmNoticeComponent,
    VerifyEmailNoticeComponent,
    EnablePushNotificationsNoticeComponent,
  ],
  exports: [FeedNoticeOutletComponent],
})
export class NoticesModule {}
