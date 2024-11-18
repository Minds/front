import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Type } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { TopbarWrapperComponent } from './topbar-wrapper/topbar.component';
import { PageComponent } from './page/page.component';
import { OnboardingV2Module } from '../onboarding-v2/onboarding.module';
import { CommonModule } from '../../common/common.module';
import { SearchSharedModule } from '../search/search-shared.module';
import { NotificationModule } from '../notifications/notification.module';
import { ModalsModule } from '../modals/modals.module';
import { ReportModule } from '../report/report.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { MessengerModule } from '../messenger/messenger.module';
import { RouterModule } from '@angular/router';
import { ComposerModule } from '../composer/composer.module';
import { AppPromptModule } from '../app-prompt/app-prompt.module';
import { GlobalAudioPlayerComponent } from '../media/components/audio/components/global-audio-player/global-audio-player.component';

const STANDALONE_COMPONENTS: Type<unknown>[] = [GlobalAudioPlayerComponent];

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    NgCommonModule,
    SearchSharedModule,
    NotificationModule,
    ModalsModule,
    OnboardingV2Module,
    ReportModule,
    BlockchainModule,
    MessengerModule,
    ComposerModule,
    AppPromptModule,
    ...STANDALONE_COMPONENTS,
  ],
  exports: [TopbarWrapperComponent, PageComponent],
  declarations: [TopbarWrapperComponent, PageComponent],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LayoutModule {}
