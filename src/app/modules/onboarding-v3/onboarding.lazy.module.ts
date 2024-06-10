import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { OnboardingV3ModalComponent } from './modal/onboarding-modal.component';
import { OnboardingV3TagsComponent } from './panel/tags/tags.component';
import { OnboardingV3TagsService } from './panel/tags/tags.service';
import { OnboardingV3PanelService } from './panel/onboarding-panel.service';
import { OnboardingV3WelcomeComponent } from './panel/welcome/welcome.component';
import { OnboardingV3ChannelComponent } from './panel/channel/channel.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OnboardingV3VerifyUniquenessComponent } from './panel/verify-uniqueness/verify-uniqueness.component';
import { OnboardingV3VerifyPhoneComponent } from './panel/verify-uniqueness/verify-phone/verify-phone.component';
import { OnboardingV3VerifyPhoneService } from './panel/verify-uniqueness/verify-phone/verify-phone.service';
import { OnboardingV3ModalProgressService } from './modal/onboarding-modal-progress.service';

const COMPONENTS = [
  OnboardingV3ModalComponent,
  OnboardingV3TagsComponent,
  OnboardingV3WelcomeComponent,
  OnboardingV3ChannelComponent,
  OnboardingV3VerifyUniquenessComponent,
  OnboardingV3VerifyPhoneComponent,
  // OnboardingV3BankComponent,
];

const PROVIDERS = [
  OnboardingV3PanelService,
  OnboardingV3TagsService,
  OnboardingV3VerifyPhoneService,
  OnboardingV3ModalProgressService,
];

const MODULES = [NgCommonModule, CommonModule, ReactiveFormsModule];

/**
 * Lazy loaded module
 */
@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [...PROVIDERS],
})
export class OnboardingV3ProgressLazyModule {
  public resolveComponent(): typeof OnboardingV3ModalComponent {
    return OnboardingV3ModalComponent;
  }
}
