import {
  NgModule,
  ComponentFactoryResolver,
  ComponentFactory,
} from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { MindsFormsModule } from '../../forms/forms.module';
import { ResetPasswordModalComponent } from './reset-password-modal.component';
import { ResetPasswordModalRequestFormComponent } from './forms/request/request.component';
import { ResetPasswordModalResetFormComponent } from './forms/reset/reset.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    MindsFormsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ResetPasswordModalComponent,
    ResetPasswordModalRequestFormComponent,
    ResetPasswordModalResetFormComponent,
  ],
  exports: [ResetPasswordModalComponent],
})
export class ResetPasswordModalModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public resolveComponent(): ComponentFactory<ResetPasswordModalComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(
      ResetPasswordModalComponent
    );
  }
}
