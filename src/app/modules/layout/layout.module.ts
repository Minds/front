import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { TopbarWrapperComponent } from './topbar-wrapper/topbar.component';
import { PageComponent } from './page/page.component';
import { OnboardingV2Module } from '../onboarding-v2/onboarding.module';
import { CommonModule } from '../../common/common.module';
import { SearchModule } from '../search/search.module';
import { NotificationModule } from '../notifications/notification.module';
import { OnboardingModule } from '../onboarding/onboarding.module';
import { ModalsModule } from '../modals/modals.module';
import { ReportModule } from '../report/report.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { LegacyModule } from '../legacy/legacy.module';
import { MessengerModule } from '../messenger/messenger.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    NgCommonModule,
    SearchModule,
    NotificationModule,
    ModalsModule,
    OnboardingModule,
    OnboardingV2Module,
    ReportModule,
    BlockchainModule,
    LegacyModule,
    MessengerModule,
  ],
  exports: [TopbarWrapperComponent, PageComponent],
  declarations: [TopbarWrapperComponent, PageComponent],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LayoutModule {}
