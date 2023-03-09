import {
  NgModule,
  ComponentFactoryResolver,
  ComponentFactory,
} from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UniswapModalComponent } from './uniswap-modal.component';
import { CommonModule } from '../../../../common/common.module';

@NgModule({
  imports: [NgCommonModule, CommonModule, FormsModule],
  declarations: [UniswapModalComponent],
  exports: [UniswapModalComponent],
})
export class UniswapModalModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public resolveComponent(): ComponentFactory<UniswapModalComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(
      UniswapModalComponent
    );
  }
}
