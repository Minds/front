import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { TokenOnboardingModule } from '../wallet/tokens/onboarding/onboarding.module';
import { MessengerModule } from '../messenger/messenger.module';
import { OnboardingCardComponent } from './card/card.component';
import { OnboardingFeedComponent } from './feed.component';
import { OnboardingService } from './onboarding.service';
import { OnboardingModalComponent } from './modal.component';


@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
    CommonModule,
    TokenOnboardingModule,
    MessengerModule,
  ],
  declarations: [
    OnboardingCardComponent,
    OnboardingFeedComponent,
    OnboardingModalComponent,
  ],
  providers: [
    OnboardingService,
  ],
  exports: [
    OnboardingCardComponent,
    OnboardingFeedComponent,
  ],
  entryComponents: [
    OnboardingModalComponent,
  ],
})
export class OnboardingModule {
}
