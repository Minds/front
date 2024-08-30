import { SuggestionsModule } from './../../suggestions/suggestions.module';
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
import { ChannelAboutComponent } from './about/about.component';
import { ChannelNostrComponent } from './about/nostr/nostr.component';
import { ChannelAboutBriefComponent } from './about/brief.component';
import { ChannelEditComponent } from './edit/edit.component';
import { ChannelActionsComponent } from './actions/actions.component';
import { ChannelActionsSubscribeComponent } from './actions/subscribe.component';
import { ChannelActionsEditComponent } from './actions/edit.component';
import { ChannelActionsMessageComponent } from './actions/message.component';
import { ChannelActionsWireComponent } from './actions/wire.component';
import { ChannelActionsMenuComponent } from './actions/menu.component';
import { ChannelEditModalService } from './edit/edit-modal.service';
import { HashtagsModule } from '../../hashtags/hashtags.module';
import { ChannelEditBioComponent } from './edit/bio.component';
import { ChannelEditInfoComponent } from './edit/info.component';
import { ChannelEditSocialLinksComponent } from './edit/social-links.component';
import { ChannelSocialLinksComponent } from './social-links/social-links.component';
import { ChannelLocationTypeaheadComponent } from './location-typeahead/location-typeahead.component';
import { ChannelContentComponent } from './content/content.component';
import { ChannelListComponent } from './list/list.component';
import { ChannelListConnectionsComponent } from './list/connections.component';
import { ChannelAboutExtraInfoComponent } from './about/extra-info.component';
import { ChannelListGroupsComponent } from './list/groups.component';
import { ModalsModule } from '../../modals/modals.module';
import { DiscoverySharedModule } from '../../discovery/discovery-shared.module';
import { ChannelActionsBoostComponent } from './actions/boost.component';
import { ChannelShopLazyComponent } from './shop/shop-lazy.component';
import { ComposerModule } from '../../composer/composer.module';
import { ChannelAdminConfirmationComponent } from './actions/admin-confirmation/admin-confirmation.component';
import { ExperimentsModule } from '../../experiments/experiments.module';
import { ContentSettingsModule } from '../../content-settings/content-settings.module';
import { MutualSubscriptionsComponent } from './mutual-subscriptions/mutual-subscriptions.component';
import { ChannelActionsSupermindButtonComponent } from './actions/supermind/supermind-button.component';
import { SupermindSharedModule } from '../../supermind/supermind-shared.module';
import { ChannelAddLinksTriggerComponent } from './about/add-links-trigger/add-links-trigger.component';
import { ChannelActionsPostSubscriptionsComponent } from './actions/post-subscriptions.component';

/**
 * Generally available components
 */
const COMPONENTS = [
  ChannelComponent,
  ChannelEditComponent,
  ChannelActionsMenuComponent, // Used in Pro footer
];

/**
 * Internal components
 */
const INTERNAL_COMPONENTS = [
  ChannelHeaderComponent,
  ChannelFeedComponent,
  ChannelAboutComponent,
  ChannelNostrComponent,
  ChannelAboutBriefComponent,
  ChannelAboutExtraInfoComponent,
  ChannelActionsComponent,
  ChannelActionsSubscribeComponent,
  ChannelActionsEditComponent,
  ChannelActionsMessageComponent,
  ChannelActionsWireComponent,
  ChannelActionsBoostComponent,
  ChannelActionsPostSubscriptionsComponent,
  ChannelAdminConfirmationComponent,
  ChannelEditBioComponent,
  ChannelEditInfoComponent,
  ChannelEditSocialLinksComponent,
  ChannelSocialLinksComponent,
  ChannelLocationTypeaheadComponent,
  ChannelContentComponent,
  ChannelListComponent,
  ChannelListConnectionsComponent,
  ChannelListGroupsComponent,
  ChannelShopLazyComponent,
  ChannelAddLinksTriggerComponent,

  //
  MutualSubscriptionsComponent,
  ChannelActionsSupermindButtonComponent,
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
    ModalsModule,
    DiscoverySharedModule,
    ComposerModule,
    ExperimentsModule,
    SuggestionsModule,
    SupermindSharedModule,
  ],
  declarations: [...INTERNAL_COMPONENTS, ...COMPONENTS],
  exports: COMPONENTS,
  providers: PROVIDERS,
})
export class ChannelsV2Module {}
