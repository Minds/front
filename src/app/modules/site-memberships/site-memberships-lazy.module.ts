import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { RouterModule, Routes } from '@angular/router';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { markedOptionsFactory } from '../../helpers/marked-options-factory';
import { SiteMembershipsPageComponent } from './components/memberships-page/site-memberships-page.component';
import { StarCardComponent } from '../../common/standalone/star-card/star-card.component';
import { SiteMembershipCardComponent } from './components/membership-card/site-membership-card.component';
import { SiteMembershipsRouteGuard } from './guards/site-memberships-route.guard';
import { SiteMembershipPageComponent } from './components/site-membership-page/site-membership-page.component';
import { JoinManageSiteMembershipButtonComponent } from './components/join-manage-membership-button/join-manage-membership-button.component';

const routes: Routes = [
  {
    path: 'join/:membershipGuid',
    component: SiteMembershipPageComponent,
    canActivate: [SiteMembershipsRouteGuard],
  },
  {
    path: '', // '/memberships
    component: SiteMembershipsPageComponent,
    canActivate: [SiteMembershipsRouteGuard],
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild(routes),
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptionsFactory({
          anchorTargets: '_blank',
        }),
      },
    }),
    StarCardComponent,
    SiteMembershipCardComponent,
  ],
  declarations: [
    SiteMembershipsPageComponent,
    SiteMembershipPageComponent,
    JoinManageSiteMembershipButtonComponent,
  ],
  exports: [SiteMembershipCardComponent],
})
export class SiteMembershipsLazyModule {}
