import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OnboardingV5ModalComponent } from './modal/onboarding-v5-modal.component';
import { OnboardingV5Component } from './components/onboarding-v5.component';
import { OnboardingV5StepperComponent } from './components/stepper/stepper.component';
import { FeatureCarouselComponent } from '../../common/components/feature-carousel/feature-carousel.component';
import { OnboardingV5VerifyEmailContentComponent } from './components/steps/verify-email/verify-email.component';
import { OnboardingV5TagSelectorContentComponent } from './components/steps/tag-selector/tag-selector.component';
import { OnboardingV5FooterComponent } from './components/footer/footer.component';
import { OnboardingV5RadioSurveyContentComponent } from './components/steps/radio-survey/radio-survey.component';
import { SuggestionsModule } from '../suggestions/suggestions.module';
import { OnboardingV5ChannelRecommendationsContentComponent } from './components/steps/channel-recommendations/channel-recommendations.component';
import { OnboardingV5CompletedSplashComponent } from './components/completed-splash/completed-splash.component';

/**
 * Lazy loaded module.
 */
@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SuggestionsModule,
  ],
  declarations: [
    OnboardingV5Component,
    OnboardingV5ModalComponent,
    OnboardingV5StepperComponent,
    FeatureCarouselComponent,
    OnboardingV5FooterComponent,
    OnboardingV5VerifyEmailContentComponent,
    OnboardingV5TagSelectorContentComponent,
    OnboardingV5RadioSurveyContentComponent,
    OnboardingV5ChannelRecommendationsContentComponent,
    OnboardingV5CompletedSplashComponent,
  ],
})
export class OnboardingV5LazyModule {
  public resolveComponent(): typeof OnboardingV5ModalComponent {
    return OnboardingV5ModalComponent;
  }
}
