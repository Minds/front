import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OnboardingCardComponent } from './card/card.component';
import { OnboardingFeedComponent } from './feed.component';
import { OnboardingService } from './onboarding.service';


@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
    CommonModule
  ],
  declarations: [
    OnboardingCardComponent,
    OnboardingFeedComponent
  ],
  providers: [
    OnboardingService
  ],
  exports: [
    OnboardingCardComponent,
    OnboardingFeedComponent
  ]
})
export class OnboardingModule {
}
