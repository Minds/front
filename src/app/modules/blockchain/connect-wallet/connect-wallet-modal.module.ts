import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConnectWalletModalComponent } from './connect-wallet-modal.component';
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
  declarations: [ConnectWalletModalComponent],
  exports: [ConnectWalletModalComponent],
})
export class ConnectWalletModalModule {
  public resolveComponent(): typeof ConnectWalletModalComponent {
    return ConnectWalletModalComponent;
  }
}
