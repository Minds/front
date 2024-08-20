import { NgModule } from '@angular/core';
import {
  CommonModule as NgCommonModule,
  NgOptimizedImage,
} from '@angular/common';
import { CommonModule } from '../../../../../common/common.module';
import { CommentsModule } from '../../../../comments/comments.module';
import { ActivityModule } from '../../../../newsfeed/activity/activity.module';
import { RouterModule, Routes } from '@angular/router';
import { NetworkAdminConsoleMobileComponent } from './components/base/mobile.component';
import { NetworkAdminConsoleMobileAssetsComponent } from './components/assets/assets.component';
import { NetworkAdminConsoleImageInputComponent } from '../../components/image-uploader/image-input.component';
import { NetworkAdminConsoleRadioBoxComponent } from '../../components/radio-box/radio-box.component';
import { NetworkAdminConsoleMobileSplashConfigComponent } from './components/splash-config/splash-config.component';
import { FormsModule } from '@angular/forms';
import { NetworkAdminConsoleMobilePreviewBuilderComponent } from './components/preview-builder/preview-builder.component';
import { NetworkAdminConsoleMobileEditAppearanceComponent } from './components/edit-appearance/edit-appearance.component';
import { NetworkAdminConsoleMobileReleaseComponent } from './components/release/release.component';
import { NetworkAdminConsoleMobileAppTrackingMessageComponent } from './components/app-tracking-message/app-tracking-message.component';
import { NetworkAdminConsoleSharedModule } from '../../network-admin-console-shared.module';

const routes: Routes = [
  { path: '', component: NetworkAdminConsoleMobileComponent },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    NgOptimizedImage,
    FormsModule,
    ActivityModule,
    CommentsModule,
    RouterModule.forChild(routes),
    NetworkAdminConsoleImageInputComponent,
    NetworkAdminConsoleRadioBoxComponent,
    NetworkAdminConsoleSharedModule,
  ],
  declarations: [
    NetworkAdminConsoleMobileComponent,
    NetworkAdminConsoleMobileAssetsComponent,
    NetworkAdminConsoleMobileSplashConfigComponent,
    NetworkAdminConsoleMobilePreviewBuilderComponent,
    NetworkAdminConsoleMobileEditAppearanceComponent,
    NetworkAdminConsoleMobileReleaseComponent,
    NetworkAdminConsoleMobileAppTrackingMessageComponent,
  ],
})
export class NetworkAdminMobileLazyModule {}
