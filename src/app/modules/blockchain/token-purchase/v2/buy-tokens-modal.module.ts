import {
  NgModule,
  ComponentFactoryResolver,
  ComponentFactory,
} from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../../common/common.module';
import { BuyTokensModalComponent } from './buy-tokens-modal.component';
import { FormsModule } from '@angular/forms';
import { TransakService } from './transak.service';
import { OrderReceivedModalService } from './order-received/order-received-modal.service';
import { OrderReceivedModalComponent } from './order-received/order-received-modal.component';
import { ModalsModule } from '../../../modals/modals.module';
import { WalletSharedModule } from '../../../wallet/wallet-shared.module';
import { TransakGlobalStyleComponent } from './transak-global-style.component';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    FormsModule,
    ModalsModule,
    WalletSharedModule,
  ],
  declarations: [
    BuyTokensModalComponent,
    OrderReceivedModalComponent,
    TransakGlobalStyleComponent,
  ],
  exports: [BuyTokensModalComponent, OrderReceivedModalComponent],
  providers: [TransakService, OrderReceivedModalService],
})
export class BuyTokensModalModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public resolveBuyTokensComponent(): ComponentFactory<
    BuyTokensModalComponent
  > {
    return this.componentFactoryResolver.resolveComponentFactory(
      BuyTokensModalComponent
    );
  }

  public resolveOrderReceivedComponent(): ComponentFactory<
    OrderReceivedModalComponent
  > {
    return this.componentFactoryResolver.resolveComponentFactory(
      OrderReceivedModalComponent
    );
  }
}
