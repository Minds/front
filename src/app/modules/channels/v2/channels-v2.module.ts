import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '../../../common/common.module';
import { ChannelComponent } from './channel.component';
import { ChannelHeadingComponent } from './heading/heading.component';
import { ChannelFeedComponent } from './feed/feed.component';
import { ChannelShopComponent } from './shop/shop.component';
import { ChannelAboutComponent } from './about/about.component';
import { ChannelEditComponent } from './edit/edit.component';
import { RouterModule } from '@angular/router';

/**
 * Generally available components
 */
const COMPONENTS = [ChannelComponent, ChannelEditComponent];

/**
 * Internal components
 */
const INTERNAL_COMPONENTS = [
  ChannelHeadingComponent,
  ChannelFeedComponent,
  ChannelShopComponent,
  ChannelAboutComponent,
];

/**
 * Service providers
 */
const PROVIDERS = [];

/**
 * Module definition
 */
@NgModule({
  imports: [NgCommonModule, FormsModule, CommonModule, RouterModule],
  declarations: [...INTERNAL_COMPONENTS, ...COMPONENTS],
  exports: COMPONENTS,
  entryComponents: COMPONENTS,
  providers: PROVIDERS,
})
export class ChannelsV2Module {}
