import {
  ComponentFactory,
  ComponentFactoryResolver,
  NgModule,
} from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { OnboardingV3ModalComponent } from './modal/onboarding-modal.component';
import { OnboardingV3Service } from './onboarding-v3.service';
import { OnboardingV3TagsComponent } from './panel/tags/tags.component';
import { OnboardingV3TagsService } from './panel/tags/tags.service';
import { OnboardingV3PanelService } from './panel/onboarding-panel.service';
import { OnboardingV3WelcomeComponent } from './panel/welcome/welcome.component';
import { OnboardingV3ChannelComponent } from './panel/channel/channel.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChannelEditService } from '../channels/v2/edit/edit.service';
import { OnboardingV3VerifyUniquenessComponent } from './panel/verify-uniqueness/verify-uniqueness.component';
import { OnboardingV3VerifyPhoneComponent } from './panel/verify-uniqueness/verify-phone/verify-phone.component';
import { OnboardingV3VerifyPhoneService } from './panel/verify-uniqueness/verify-phone/verify-phone.service';

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
  OnboardingV3Service,
  OnboardingV3PanelService,
  OnboardingV3TagsService,
  ChannelEditService,
  OnboardingV3VerifyPhoneService,
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
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public resolveComponent(): ComponentFactory<OnboardingV3ModalComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(
      OnboardingV3ModalComponent
    );
  }
}
