import {
  NgModule,
  ComponentFactoryResolver,
  ComponentFactory,
} from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '../../../common/common.module';
import { ModalsModule } from '../../modals/modals.module';
import { RouterModule } from '@angular/router';
import { SupermindOnboardingModalComponent } from './onboarding-modal.component';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    FormsModule,
    ModalsModule,
    RouterModule,
  ],
  declarations: [SupermindOnboardingModalComponent],
  exports: [SupermindOnboardingModalComponent],
})
export class SupermindOnboardingModalModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public resolveComponent(): ComponentFactory<
    SupermindOnboardingModalComponent
  > {
    return this.componentFactoryResolver.resolveComponentFactory(
      SupermindOnboardingModalComponent
    );
  }
}
