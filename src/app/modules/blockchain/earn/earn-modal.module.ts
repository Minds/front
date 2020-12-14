import {
  NgModule,
  ComponentFactoryResolver,
  ComponentFactory,
} from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EarnModalComponent } from './earn-modal.component';
import { CommonModule } from '../../../common/common.module';
import { ModalsModule } from '../../modals/modals.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    FormsModule,
    ModalsModule,
    RouterModule,
  ],
  declarations: [EarnModalComponent],
  exports: [EarnModalComponent],
})
export class EarnModalModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public resolveComponent(): ComponentFactory<EarnModalComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(
      EarnModalComponent
    );
  }
}
