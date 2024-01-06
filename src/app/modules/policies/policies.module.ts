import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '../../common/common.module';

import { PathMatch } from '../../common/types/angular.types';
import { CustomPolicyPageComponent } from './custom-policy-page/custom-policy-page.component';
import { TenantOnlyRedirectGuard } from '../../common/guards/tenant-only-redirect.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [TenantOnlyRedirectGuard],
    children: [
      {
        path: '',
        redirectTo: '/policies/privacy',
        pathMatch: 'full' as PathMatch,
      },
      {
        path: 'privacy',
        component: CustomPolicyPageComponent,
        data: { policyId: 'privacy' },
      },
      {
        path: 'terms-of-service',
        component: CustomPolicyPageComponent,
        data: { policyId: 'termsOfService' },
      },
      {
        path: 'community-guidelines',
        component: CustomPolicyPageComponent,
        data: { policyId: 'communityGuidelines' },
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
  declarations: [CustomPolicyPageComponent],
  // exports: [], ojm
  // providers: [],
})
export class PoliciesModule {}
