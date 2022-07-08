import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '../../../common/common.module';
import { RouterModule } from '@angular/router';
import { PaymentsModule } from '../../payments/payments.module';
import { WireService } from '../wire.service';
import { WireCreatorComponent } from './creator/wire-creator.component';
import { WireCreatorOwnerBlock } from './creator/owner-block/owner-block.component';
import { WireCreatorFormComponent } from './creator/form/form.component';
import { WireCreatorToolbarComponent } from './creator/toolbar/toolbar.component';
import { WireCreatorShopComponent } from './creator/shop/shop.component';
import { WireCreatorUpgradeBlockComponent } from './creator/upgrade-block/upgrade-block.component';
import { WireCreatorSupportTierConfirmationComponent } from './creator/support-tier-confirmation/support-tier-confirmation.component';
import { WireCreatorCurrencyToggleComponent } from './creator/currency-toggle/currency-toggle.component';

const COMPONENTS = [WireCreatorComponent];

const INTERNAL_COMPONENTS = [
  WireCreatorOwnerBlock,
  WireCreatorFormComponent,
  WireCreatorToolbarComponent,
  WireCreatorShopComponent,
  WireCreatorUpgradeBlockComponent,
  WireCreatorSupportTierConfirmationComponent,
  WireCreatorCurrencyToggleComponent,
];

const PROVIDERS = [
  WireService, // V1, used by V2
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    FormsModule,
    RouterModule,
    PaymentsModule,
  ],
  declarations: [...INTERNAL_COMPONENTS, ...COMPONENTS],
  exports: COMPONENTS,
  providers: PROVIDERS,
})
export class WireV2Module {}
