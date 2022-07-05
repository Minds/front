import {
  NgModule,
  ComponentFactoryResolver,
  ComponentFactory,
} from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { AuthModalComponent } from './auth-modal.component';
import { MindsFormsModule } from '../../forms/forms.module';

@NgModule({
  imports: [NgCommonModule, CommonModule, MindsFormsModule],
  declarations: [AuthModalComponent],
  exports: [AuthModalComponent],
})
export class AuthModalModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public resolveComponent(): ComponentFactory<AuthModalComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(
      AuthModalComponent
    );
  }
}
