import { CommonModule as NgCommonModule } from '@angular/common';
import {
  ComponentFactory,
  ComponentFactoryResolver,
  NgModule,
} from '@angular/core';
import { CommonModule } from '../../../common/common.module';
import { Web3ModalComponent } from './web3-modal.component';

@NgModule({
  imports: [NgCommonModule, CommonModule],
  declarations: [Web3ModalComponent],
  exports: [Web3ModalComponent],
})
export class Web3ModalModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public resolveComponent(): ComponentFactory<Web3ModalComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(
      Web3ModalComponent
    );
  }
}
