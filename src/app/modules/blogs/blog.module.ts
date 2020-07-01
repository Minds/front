import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { ModalsModule } from '../modals/modals.module';
import { AdsModule } from '../ads/ads.module';
import { LegacyModule } from '../legacy/legacy.module';
import { PostMenuModule } from '../../common/components/post-menu/post-menu.module';

import {
  BlogListComponent,
  BlogEdit,
  BlogViewInfinite,
} from './list.component';
import { BlogCard } from './card/card';
import { BlogView } from './view/view';
import { BlogTileComponent } from './tile/tile.component';
import { WireModule } from '../wire/wire.module';
import { CommentsModule } from '../comments/comments.module';
import { HashtagsModule } from '../hashtags/hashtags.module';
import { CanDeactivateGuardService } from '../../services/can-deactivate-guard';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { BlogEditorComponent } from './v2/edit/ckeditor/editor.component';
import { CodeHighlightModule } from '../code-highlight/code-highlight.module';
import { CaptchaModule } from '../captcha/captcha.module';
import { BlogEditorV2Component } from './v2/edit/editor-base.component';
import { BlogsEditService } from './v2/edit/blog-edit.service';
import { BlogEditorDropdownComponent } from './v2/edit/dropdown/dropdown.component';
import { BlogEditorMetaComponent } from './v2/edit/bottom-bar/meta/meta.component';
import { BlogEditorBottomBarComponent } from './v2/edit/bottom-bar/bottom-bar.component';
import { BlogEditorTagsComponent } from './v2/edit/bottom-bar/tags/tags.component';
import { BlogViewV2Component } from './v2/view/view.component';
import { BlogsViewService } from './v2/view/blog-view.service';
import { BlogViewDropdownComponent } from './v2/view/dropdown/dropdown.component';

const routes: Routes = [
  { path: 'blog/view/:guid/:title', component: BlogViewInfinite },
  { path: 'blog/view/:guid', component: BlogViewInfinite },
  {
    path: 'blog/edit/:guid',
    component: BlogEdit,
    canDeactivate: [CanDeactivateGuardService],
    data: {
      title: 'Edit Blog',
    },
  },
  { path: 'blog/:filter', component: BlogListComponent },
  { path: 'blog', redirectTo: '/blog/top', pathMatch: 'full' },
  { path: ':username/blog/:slugid', component: BlogViewInfinite },
  {
    path: 'blog/v2/edit/:guid',
    component: BlogEditorV2Component,
    canDeactivate: [CanDeactivateGuardService],
    data: {
      title: 'Edit Blog',
    },
  },
  { path: 'blog/v2/view/:guid/:title', component: BlogViewV2Component },
  { path: 'blog/v2/view/:guid', component: BlogViewV2Component },
  { path: ':username/blog/v2/:slugid', component: BlogViewV2Component },
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
    LegacyModule,
    PostMenuModule,
    WireModule,
    HashtagsModule,
    ModalsModule,
    CKEditorModule,
    CodeHighlightModule,
    CaptchaModule,
  ],
  declarations: [
    BlogView,
    BlogCard,
    BlogViewInfinite,
    BlogEdit,
    BlogListComponent,
    BlogTileComponent,
    BlogEditorComponent,
    BlogEditorV2Component,
    BlogEditorDropdownComponent,
    BlogEditorMetaComponent,
    BlogEditorBottomBarComponent,
    BlogEditorTagsComponent,
    BlogViewV2Component,
    BlogViewDropdownComponent,
  ],
  exports: [
    BlogView,
    BlogCard,
    BlogViewInfinite,
    BlogEdit,
    BlogListComponent,
    BlogTileComponent,
    BlogEditorComponent,
    BlogViewV2Component,
  ],
  providers: [BlogsEditService, BlogsViewService],
})
export class BlogModule {}
