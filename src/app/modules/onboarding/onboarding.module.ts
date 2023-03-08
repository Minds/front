import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { TokenOnboardingModule } from '../wallet/tokens/onboarding/onboarding.module';
import { MessengerModule } from '../messenger/messenger.module';
import { ChannelOnboardingService } from './channel/onboarding.service';
import { GroupsTileComponent } from '../groups/tile/tile.component';
import { Client } from '../../services/api/client';
import { SuggestionsModule } from '../suggestions/suggestions.module';
import { Session } from '../../services/session';

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
    CommonModule,
    TokenOnboardingModule,
    MessengerModule,
    SuggestionsModule,
  ],
  declarations: [],
  providers: [
    {
      provide: ChannelOnboardingService,
      deps: [Client, Session],
      useFactory: ChannelOnboardingService._,
    },
  ],
  exports: [],
})
export class OnboardingModule {}
