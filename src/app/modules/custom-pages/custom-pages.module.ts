import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '../../common/common.module';

import { PathMatch } from '../../common/types/angular.types';
import { CustomPageComponent } from './custom-page/custom-page.component';
import { TenantOnlyRedirectGuard } from '../../common/guards/tenant-only-redirect.guard';
import { MarkdownModule } from 'ngx-markdown';
import { CustomPageType } from './custom-pages.types';

const routes: Routes = [
  {
    path: '',
    canActivate: [TenantOnlyRedirectGuard],
    children: [
      {
        path: '',
        redirectTo: '/pages/privacy-policy',
        pathMatch: 'full' as PathMatch,
      },
      {
        path: 'privacy-policy',
        component: CustomPageComponent,
        data: { pageType: CustomPageType.PRIVACY_POLICY },
      },
      {
        path: 'terms-of-service',
        component: CustomPageComponent,
        data: { pageType: CustomPageType.TERMS_OF_SERVICE },
      },
      {
        path: 'community-guidelines',
        component: CustomPageComponent,
        data: { pageType: CustomPageType.COMMUNITY_GUIDELINES },
      },
    ],
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule,
    CommonModule,
    RouterModule.forChild(routes),
    MarkdownModule.forChild(),
  ],
  declarations: [CustomPageComponent],
})
export class CustomPagesModule {}
