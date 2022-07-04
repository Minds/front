import {
  NgModule,
  ComponentFactoryResolver,
  ComponentFactory,
} from '@angular/core';
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

const EXPORTS = [ChannelShopComponent, ChannelShopBriefComponent];

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
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public resolveComponents(): { [selector: string]: ComponentFactory<any> } {
    const factories = {};
    for (let component of EXPORTS) {
      const factory: ComponentFactory<any> = this.componentFactoryResolver.resolveComponentFactory(
        component
      );
      factories[factory.selector] = factory;
    }
    return factories;
  }
}
