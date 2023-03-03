import {
  NgModule,
  ComponentFactoryResolver,
  ComponentFactory,
} from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../../common/common.module';
import { BuyTokensModalComponent } from './buy-tokens-modal.component';
import { FormsModule } from '@angular/forms';
import { OrderReceivedModalService } from './order-received/order-received-modal.service';
import { OrderReceivedModalComponent } from './order-received/order-received-modal.component';
import { ModalsModule } from '../../../modals/modals.module';
import { WalletSharedModule } from '../../../wallet/wallet-shared.module';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    FormsModule,
    ModalsModule,
    WalletSharedModule,
  ],
  declarations: [BuyTokensModalComponent, OrderReceivedModalComponent],
  exports: [BuyTokensModalComponent, OrderReceivedModalComponent],
  providers: [OrderReceivedModalService],
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
