import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';

import { CommonModule } from '../../../../common/common.module';
import { ChannelShopComponent } from './shop.component';
import { ChannelShopBriefComponent } from './brief.component';
import { ChannelShopMembershipsComponent } from './memberships/memberships.component';
import { ChannelShopMembershipsEditComponent } from './memberships/edit.component';
import { ChannelShopMembershipsSupportTierComponent } from './memberships/support-tier.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChannelShopMembershipsMembersComponent } from './memberships/members-modal/members-modal.component';

@NgModule({
  imports: [NgCommonModule, RouterModule, FormsModule, CommonModule],
  declarations: [
    ChannelShopMembershipsComponent,
    ChannelShopMembershipsEditComponent,
    ChannelShopMembershipsSupportTierComponent,
    ChannelShopComponent,
    ChannelShopBriefComponent,
    ChannelShopMembershipsMembersComponent,
  ],
})
export class ChannelsShopModule {
  public resolveComponents(): {
    [key in string]: ChannelShopComponent | ChannelShopBriefComponent;
  } {
    return {
      [(ChannelShopComponent as any).ɵcmp.selectors[0][0]]:
        ChannelShopComponent,
      [(ChannelShopBriefComponent as any).ɵcmp.selectors[0][0]]:
        ChannelShopBriefComponent,
    };
  }
}
