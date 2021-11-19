import { NgModule } from '@angular/core';
// import { CommonModule as NgCommonModule } from '@angular/common';
// import {
//   FormsModule as NgFormsModule,
// } from '@angular/forms';

import { CommonModule } from '../../../common/common.module';
// import { MindsFeedComponent } from './feed/minds-feed.component';
// import { ActivityModule } from '../newsfeed/activity/activity.module';
// import { MindsFeedContainerComponent } from './minds-feed-container.component';
import { DiscoveryDisclaimerComponent } from './disclaimer.component';

@NgModule({
  imports: [
    // NgCommonModule,
    // NgFormsModule,
    CommonModule,
    // ActivityModule,
  ],
  declarations: [DiscoveryDisclaimerComponent],
  exports: [DiscoveryDisclaimerComponent],
})
export class DiscoveryDisclaimerModule {}
