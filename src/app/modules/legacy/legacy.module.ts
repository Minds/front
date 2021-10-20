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
import { WireModule } from '../wire/wire.module';
import { CodeHighlightModule } from '../code-highlight/code-highlight.module';

import { UserCard } from './components/cards/user/user';

import { BoostButton } from './components/buttons/boost';
import { CommentButton } from './components/buttons/comment';
import { SubscribeButton } from './components/buttons/subscribe';
import { UserDropdownButton } from './components/buttons/user-dropdown';

import { MindsBanner } from './components/banner/banner';
import { MindsFatBanner } from './components/banner/fat';

import { SocialIcons } from './components/social-icons/social-icons';
import { PostMenuModule } from '../../common/components/post-menu/post-menu.module';

import { CarouselComponent } from './components/carousel.component';
import { CommentsModule } from '../comments/comments.module';
import { TextInputAutocompleteModule } from '../../common/components/autocomplete';
import { CommentComponentV2 } from '../comments/comment/comment.component';

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
    WireModule,
    PostMenuModule,
    CommentsModule,
    TextInputAutocompleteModule,
    CodeHighlightModule,
  ],
  declarations: [
    UserCard,
    BoostButton,
    CommentButton,
    SubscribeButton,
    UserDropdownButton,

    MindsBanner,
    MindsFatBanner,

    SocialIcons,

    CarouselComponent,
  ],
  exports: [
    UserCard,

    BoostButton,
    CommentButton,
    SubscribeButton,
    UserDropdownButton,

    MindsBanner,
    MindsFatBanner,

    SocialIcons,
    CarouselComponent,
  ],
})
export class LegacyModule {}
