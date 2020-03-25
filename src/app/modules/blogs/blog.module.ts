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
  ],
  declarations: [
    BlogView,
    BlogCard,
    BlogViewInfinite,
    BlogEdit,
    BlogListComponent,
    BlogTileComponent,
  ],
  exports: [
    BlogView,
    BlogCard,
    BlogViewInfinite,
    BlogEdit,
    BlogListComponent,
    BlogTileComponent,
  ],
  entryComponents: [BlogCard],
})
export class BlogModule {}
