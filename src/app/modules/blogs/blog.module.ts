import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { ModalsModule } from '../modals/modals.module';
import { AdsModule } from '../ads/ads.module';
import { PostMenuModule } from '../../common/components/post-menu/post-menu.module';

import { BlogCard } from './card/card';
import { BlogView } from './view/view';
import { BlogViewInfinite } from './view/infinite';
import { WireModule } from '../wire/wire.module';
import { CommentsModule } from '../comments/comments.module';
import { HashtagsModule } from '../hashtags/hashtags.module';
import { CanDeactivateGuardService } from '../../services/can-deactivate-guard';
import { BlogEditorComponent } from './v2/edit/ckeditor/editor.component';
import { CaptchaModule } from '../captcha/captcha.module';
import { BlogEditorV2Component } from './v2/edit/editor-base.component';
import { BlogV2Module } from './v2/blog-v2.module';
import { CodeHighlightModule } from '../code-highlight/code-highlight.module';
import { ActivityV2Module } from '../newsfeed/activity/activity.module';

const routes: Routes = [
  { path: '', redirectTo: '/discovery/overview', pathMatch: 'full' },
  { path: 'view/:guid/:title', component: BlogViewInfinite },
  { path: 'view/:guid', component: BlogViewInfinite },
  {
    path: 'edit/:guid',
    component: BlogEditorV2Component,
    canDeactivate: [CanDeactivateGuardService],
    data: {
      title: 'Edit Blog',
    },
  },
  {
    path: 'v2/edit/:guid',
    redirectTo: 'edit/:guid',
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    ModalsModule,
    AdsModule,
    CommentsModule,
    PostMenuModule,
    WireModule,
    HashtagsModule,
    ModalsModule,
    CaptchaModule,
    BlogV2Module,
    CodeHighlightModule,
    ActivityV2Module,
  ],
  declarations: [BlogView, BlogCard, BlogViewInfinite],
  exports: [BlogEditorComponent, BlogView, BlogCard],
})
export class BlogModule {}
