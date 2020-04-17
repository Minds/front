import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '../../../common/common.module';
import { ChannelComponent } from './channel.component';
import { ChannelHeaderComponent } from './header/header.component';
import { ChannelFeedComponent } from './feed/feed.component';
import { ChannelShopComponent } from './shop/shop.component';
import { ChannelAboutComponent } from './about/about.component';
import { ChannelAboutBriefComponent } from './about/brief.component';
import { ChannelEditComponent } from './edit/edit.component';
import { ChannelActionsComponent } from './actions/actions.component';
import { ChannelActionsSubscribeComponent } from './actions/subscribe.component';
import { ChannelActionsEditComponent } from './actions/edit.component';
import { ChannelActionsMessageComponent } from './actions/message.component';
import { ChannelActionsWireComponent } from './actions/wire.component';
import { ChannelActionsMenuButtonComponent } from './actions/menu-button.component';
import { ChannelActionsMenuComponent } from './actions/menu.component';
import { MessengerModule } from '../../messenger/messenger.module';
import { NewsfeedModule } from '../../newsfeed/newsfeed.module';

/**
 * Generally available components
 */
const COMPONENTS = [ChannelComponent, ChannelEditComponent];

/**
 * Internal components
 */
const INTERNAL_COMPONENTS = [
  ChannelHeaderComponent,
  ChannelFeedComponent,
  ChannelShopComponent,
  ChannelAboutComponent,
  ChannelAboutBriefComponent,
  ChannelActionsComponent,
  ChannelActionsSubscribeComponent,
  ChannelActionsEditComponent,
  ChannelActionsMessageComponent,
  ChannelActionsWireComponent,
  ChannelActionsMenuButtonComponent,
  ChannelActionsMenuComponent,
];

/**
 * Service providers
 */
const PROVIDERS = [];

/**
 * Module definition
 */
@NgModule({
  imports: [
    NgCommonModule,
    RouterModule,
    FormsModule,
    CommonModule,
    NewsfeedModule,
    MessengerModule,
  ],
  declarations: [...INTERNAL_COMPONENTS, ...COMPONENTS],
  exports: COMPONENTS,
  entryComponents: COMPONENTS,
  providers: PROVIDERS,
})
export class ChannelsV2Module {}
