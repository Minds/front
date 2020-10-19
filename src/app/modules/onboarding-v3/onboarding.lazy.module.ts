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
import { OnboardingV3PanelService } from './panel/onboarding-panel.service';

/**
 * Module definition
 */
@NgModule({
  imports: [NgCommonModule, CommonModule],
  declarations: [OnboardingV3ModalComponent, OnboardingV3TagsComponent],
  exports: [OnboardingV3ModalComponent, OnboardingV3TagsComponent],
  providers: [OnboardingV3Service, OnboardingV3PanelService],
})
export class OnboardingV3ProgressLazyModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public resolveComponent(): ComponentFactory<OnboardingV3ModalComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(
      OnboardingV3ModalComponent
    );
  }
}
