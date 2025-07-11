import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  FormsModule as NgFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { ModalsModule } from '../modals/modals.module';
import { MindsFormsModule } from '../forms/forms.module';
import { WireModule } from '../wire/wire.module';
import { PostMenuModule } from '../../common/components/post-menu/post-menu.module';
import { VideoModule } from './components/video/video.module';

import { CommentsModule } from '../comments/comments.module';
import { HashtagsModule } from '../hashtags/hashtags.module';
// import { BlogModule } from '../blogs/blog.module';
import { TranslateModule } from '../translate/translate.module';

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule,
    NgFormsModule,
    ReactiveFormsModule,
    CommonModule,
    CommentsModule,
    ModalsModule,
    MindsFormsModule,
    WireModule,
    PostMenuModule,
    VideoModule,
    HashtagsModule,
    //BlogModule,
    TranslateModule,
  ],
})
export class MediaModule {}
