import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BlogModule } from './blog.module';
import { BlogViewInfinite } from './view/infinite';

@NgModule({
  imports: [
    BlogModule,
    RouterModule.forChild([
      {
        path: ':slugid',
        component: BlogViewInfinite,
      },
    ]),
  ],
})
export class BlogSlugModule {}
