import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { ModalsModule } from '../modals/modals.module';

import { PaymentsNewCard } from './new-card/new-card.component';
import { PaymentsSelectCard } from './select-card/select-card.component';
import { BTCService } from './btc/btc.service';
import { BTCComponent } from './btc/btc.component';
import { BTCSettingsComponent } from './btc/settings.component';
import { NewCardModalComponent } from './new-card-modal/new-card-modal.component';

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ModalsModule,
  ],
  declarations: [
    PaymentsNewCard,
    PaymentsSelectCard,
    BTCComponent,
    BTCSettingsComponent,
    NewCardModalComponent,
  ],
  exports: [PaymentsNewCard, PaymentsSelectCard, NewCardModalComponent],
  providers: [BTCService],
})
export class PaymentsModule {}
