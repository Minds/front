import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '../../../common/common.module';
import { MessengerModule } from '../../messenger/messenger.module';
import { NewsfeedModule } from '../../newsfeed/newsfeed.module';
import { ChannelComponent } from './channel.component';
import { ChannelHeaderComponent } from './header/header.component';
import { ChannelFeedComponent } from './feed/feed.component';
import { ChannelShopComponent } from './shop/shop.component';
import { ChannelShopBriefComponent } from './shop/brief.component';
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
import { ChannelEditModalService } from './edit/edit-modal.service';
import { HashtagsModule } from '../../hashtags/hashtags.module';
import { ChannelEditBioComponent } from './edit/bio.component';
import { ChannelEditInfoComponent } from './edit/info.component';
import { ChannelEditHashtagsComponent } from './edit/hashtags.component';
import { ChannelEditSocialLinksComponent } from './edit/social-links.component';
import { ChannelSocialLinksComponent } from './social-links/social-links.component';
import { ChannelLocationTypeaheadComponent } from './location-typeahead/location-typeahead.component';

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
  ChannelShopBriefComponent,
  ChannelAboutComponent,
  ChannelAboutBriefComponent,
  ChannelActionsComponent,
  ChannelActionsSubscribeComponent,
  ChannelActionsEditComponent,
  ChannelActionsMessageComponent,
  ChannelActionsWireComponent,
  ChannelActionsMenuButtonComponent,
  ChannelActionsMenuComponent,
  ChannelEditBioComponent,
  ChannelEditInfoComponent,
  ChannelEditHashtagsComponent,
  ChannelEditSocialLinksComponent,
  ChannelSocialLinksComponent,
  ChannelLocationTypeaheadComponent,
];

/**
 * Service providers
 */
const PROVIDERS = [ChannelEditModalService];

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
    HashtagsModule,
  ],
  declarations: [...INTERNAL_COMPONENTS, ...COMPONENTS],
  exports: COMPONENTS,
  entryComponents: COMPONENTS,
  providers: PROVIDERS,
})
export class ChannelsV2Module {}
