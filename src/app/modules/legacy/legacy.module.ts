import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { TranslateModule } from '../translate/translate.module';
import { VideoModule } from '../media/components/video/video.module';
import { ModalsModule } from '../modals/modals.module';
import { PaymentsModule } from '../payments/payments.module';
import { BoostModule } from '../boost/boost.module';
import { ThirdPartyNetworksModule } from '../third-party-networks/third-party-networks.module';
import { WireModule } from '../wire/wire.module';

import { Activity } from './components/cards/activity/activity';
import { AlbumCard } from './components/cards/object/album/album';
import { ImageCard } from './components/cards/object/image/image';
import { VideoCard } from './components/cards/object/video/video';
import { Remind } from './components/cards/remind/remind';
import { UserCard } from './components/cards/user/user';

import { BoostButton } from './components/buttons/boost';
import { CommentButton } from './components/buttons/comment';
import { FeatureButton } from './components/buttons/feature';
import { MonetizeButton } from './components/buttons/monetize';
import { RemindButton } from './components/buttons/remind';
import { SubscribeButton } from './components/buttons/subscribe';
import { UserDropdownButton } from './components/buttons/user-dropdown';

import { MindsBanner } from './components/banner/banner';
import { MindsFatBanner } from './components/banner/fat';

import { ActivityPreview } from './components/cards/activity/preview';
import { SocialIcons } from './components/social-icons/social-icons';
import { PostMenuModule } from '../../common/components/post-menu/post-menu.module';

import { HovercardPopup } from './components/hovercard-popup/hovercard-popup';
import { CarouselComponent } from './components/carousel.component';
import { CommentsModule } from '../comments/comments.module';
import { TextInputAutocompleteModule } from 'angular-text-input-autocomplete';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild([]),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    VideoModule,
    PaymentsModule,
    ModalsModule,
    BoostModule,
    ThirdPartyNetworksModule,
    WireModule,
    PostMenuModule,
    CommentsModule,
    TextInputAutocompleteModule,
  ],
  declarations: [
    Activity,
    ActivityPreview,
    AlbumCard,
    ImageCard,
    VideoCard,
    Remind,
    UserCard,
    HovercardPopup,
    BoostButton,
    CommentButton,
    FeatureButton,
    MonetizeButton,
    RemindButton,
    SubscribeButton,
    UserDropdownButton,

    MindsBanner,
    MindsFatBanner,

    SocialIcons,

    CarouselComponent,
  ],
  exports: [
    Activity,
    ActivityPreview,
    AlbumCard,
    ImageCard,
    VideoCard,
    Remind,
    UserCard,

    BoostButton,
    CommentButton,
    FeatureButton,
    MonetizeButton,
    RemindButton,
    SubscribeButton,
    UserDropdownButton,

    MindsBanner,
    MindsFatBanner,

    SocialIcons,
    HovercardPopup,
    CarouselComponent,
  ],
  entryComponents: [
    Activity,
    ActivityPreview,
    AlbumCard,
    ImageCard,
    VideoCard,
    Remind,
    UserCard,
    BoostButton,
  ]
})
export class LegacyModule {
}
