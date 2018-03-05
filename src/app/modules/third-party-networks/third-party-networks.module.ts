import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';

import { CommonModule } from '../../common/common.module';

import { ThirdPartyNetworksSelector } from './selector';
import { ThirdPartyNetworksFacebook } from './facebook';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
  ],
  declarations: [
    ThirdPartyNetworksSelector,
    ThirdPartyNetworksFacebook
  ],
  exports: [
    ThirdPartyNetworksSelector,
    ThirdPartyNetworksFacebook
  ]
})
export class ThirdPartyNetworksModule {
}
