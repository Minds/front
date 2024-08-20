import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../../../common/common.module';
import { RouterModule, Routes } from '@angular/router';
import { NetworkAdminMonetizationComponent } from './components/monetization/monetization.component';
import { NetworkAdminStripeCredentialsComponent } from './components/stripe-credentials/stripe-credentials.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NetworkAdminMonetizationTabsComponent } from './components/tabs/tabs.component';
import { NetworkAdminMonetizationMembershipsComponent } from './components/memberships/memberships.component';
import { PathMatch } from '../../../../../common/types/angular.types';
import { NetworkAdminMonetizationMembershipAccordianComponent } from './components/memberships/accordian/accordian.component';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { markedOptionsFactory } from '../../../../../helpers/marked-options-factory';
import { NetworkAdminMonetizationGroupsListComponent } from './components/memberships/groups-list/groups-list.component';
import { NetworkAdminMonetizationMembershipFormComponent } from './components/memberships/form/form.component';
import { CanDeactivateGuardService } from '../../../../../services/can-deactivate-guard';
import { NetworkAdminConsoleSharedModule } from '../../network-admin-console-shared.module';
import { NetworkAdminBoostConfigurationComponent } from './components/boost-settings/boost-configuration.component';

/**
 * Routes for the network admin monetization console.
 * @type { Routes }
 */
const routes: Routes = [
  {
    path: 'memberships/new',
    component: NetworkAdminMonetizationMembershipFormComponent,
    canDeactivate: [CanDeactivateGuardService],
  },
  {
    path: 'memberships/edit/:guid',
    component: NetworkAdminMonetizationMembershipFormComponent,
    canDeactivate: [CanDeactivateGuardService],
    data: { editMode: true },
  },
  {
    path: '',
    component: NetworkAdminMonetizationComponent,
    children: [
      { path: '', redirectTo: 'memberships', pathMatch: 'full' as PathMatch },
      {
        path: 'memberships',
        component: NetworkAdminMonetizationMembershipsComponent,
      },
      {
        path: 'boost',
        component: NetworkAdminBoostConfigurationComponent
      },
    ],
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NetworkAdminConsoleSharedModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptionsFactory({
          anchorTargets: '_blank',
        }),
      },
    }),
    RouterModule.forChild(routes),
    NetworkAdminBoostConfigurationComponent,
  ],
  declarations: [
    NetworkAdminMonetizationComponent,
    NetworkAdminStripeCredentialsComponent,
    NetworkAdminMonetizationTabsComponent,
    NetworkAdminMonetizationMembershipsComponent,
    NetworkAdminMonetizationMembershipAccordianComponent,
    NetworkAdminMonetizationGroupsListComponent,
    NetworkAdminMonetizationMembershipFormComponent,
  ],
})
export class NetworkAdminMonetizationLazyModule {}
