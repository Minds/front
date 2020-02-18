import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import { AnalyticsModuleLazyRoutes } from './modules/analytics/analytics.lazy';
import { AdminModuleLazyRoutes } from './modules/admin/admin.lazy';
import { Pages } from './controllers/pages/pages';
import { ChannelContainerComponent } from './modules/channel-container/channel-container.component';
import { CanDeactivateGuardService } from './services/can-deactivate-guard';

const routes: Routes = [
  { path: 'about', redirectTo: 'p/about' },
  { path: 'p/:page', component: Pages },
  AnalyticsModuleLazyRoutes,
  AdminModuleLazyRoutes,
  // TODO: Find a way to move channel routes onto its own Module. They take priority and groups/blogs cannot be accessed
  { path: ':username', redirectTo: ':username/', pathMatch: 'full' },
  {
    path: ':username/:filter',
    component: ChannelContainerComponent,
    canDeactivate: [CanDeactivateGuardService],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
})
export class AppRoutingModule {}
