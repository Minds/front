import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { CommentCard } from './components/cards/comment/comment';
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
import { ThumbsDownButton } from './components/buttons/thumbs-down';
import { ThumbsUpButton } from './components/buttons/thumbs-up';
import { UserDropdownButton } from './components/buttons/user-dropdown';

import { MindsBanner } from './components/banner/banner';
import { MindsFatBanner } from './components/banner/fat';

import { TagsInput } from './components/forms/tags-input/tags';
import { ActivityPreview } from './components/cards/activity/preview';
import { SocialIcons } from './components/social-icons/social-icons';
import { Comments } from './controllers/comments/comments';
import { CommentsScrollDirective } from './controllers/comments/scroll';
import { Poster } from './controllers/newsfeed/poster/poster';
import { PostMenuModule } from '../../common/components/post-menu/post-menu.module';

import { CarouselComponent } from './components/carousel.component';
import { ModalPosterComponent } from './controllers/newsfeed/poster/poster-modal.component';

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
    PostMenuModule
  ],
  declarations: [
    Activity,
    ActivityPreview,
    CommentCard,
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
    ThumbsDownButton,
    ThumbsUpButton,
    UserDropdownButton,

    MindsBanner,
    MindsFatBanner,

    TagsInput,
    SocialIcons,
    Comments,
    CommentsScrollDirective,

    Poster,
    ModalPosterComponent,
    CarouselComponent,
  ],
  exports: [
    Activity,
    ActivityPreview,
    CommentCard,
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
    ThumbsDownButton,
    ThumbsUpButton,
    UserDropdownButton,

    MindsBanner,
    MindsFatBanner,

    TagsInput,
    SocialIcons,
    Comments,
    CommentsScrollDirective,

    Poster,
    ModalPosterComponent,
    CarouselComponent,
  ],
  entryComponents: [
    Activity,
    ActivityPreview,
    CommentCard,
    AlbumCard,
    ImageCard,
    VideoCard,
    Remind,
    UserCard,
    Poster,
    ModalPosterComponent,
    BoostButton,
  ]
})
export class LegacyModule {
}
