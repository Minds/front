import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '../../common/common.module';

import { PathMatch } from '../../common/types/angular.types';
import { CustomPageComponent } from './custom-page/custom-page.component';
import { TenantOnlyRedirectGuard } from '../../common/guards/tenant-only-redirect.guard';

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
        data: { pageType: 'privacyPolicy' },
      },
      {
        path: 'terms-of-service',
        component: CustomPageComponent,
        data: { pageType: 'termsOfService' },
      },
      {
        path: 'community-guidelines',
        data: { pageType: 'communityGuidelines' },
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
  ],
  declarations: [CustomPageComponent],
})
export class CustomPagesModule {}
