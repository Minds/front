import { NgModule } from '@angular/core';
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
  public resolveComponent(): typeof UniswapModalComponent {
    return UniswapModalComponent;
  }
}
