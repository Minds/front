import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupermindConsoleComponent } from './console/console.component';
import { SupermindConsoleListComponent } from './console/list/list.component';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { SupermindConsoleListItemComponent } from './console/list/list-item/list-item.component';
import { SupermindConsoleFilterBarComponent } from './console/list/filter-bar/filter-bar.component';
import { SupermindConsoleStateLabelComponent } from './console/list/list-item/state-label/state-label.component';
import { SupermindConsoleActionButtonsComponent } from './console/list/list-item/action-bar/action-buttons.component';
import { PathMatch } from '../../common/types/angular.types';
import { SupermindConsoleExploreFeedComponent } from './console/explore-feed/explore-feed.component';
import { NoticesModule } from '../notices/notices.module';
import { loggedOutExplainerScreenGuard } from '../explainer-screens/guards/logged-out-explainer-screen.guard';
import { TenantRedirectGuard } from '../../common/guards/tenant-redirect.guard';

const routes: Routes = [
  {
    path: 'supermind',
    component: SupermindConsoleComponent,
    canActivate: [TenantRedirectGuard, loggedOutExplainerScreenGuard()],
    children: [
      { path: '', redirectTo: 'explore', pathMatch: 'full' as PathMatch },
      { path: 'explore', component: SupermindConsoleExploreFeedComponent },
      { path: ':listType', component: SupermindConsoleListComponent },
    ],
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CommonModule,
    ActivityModule,
    NoticesModule,
  ],
  declarations: [
    SupermindConsoleListComponent,
    SupermindConsoleComponent,
    SupermindConsoleListItemComponent,
    SupermindConsoleFilterBarComponent,
    SupermindConsoleStateLabelComponent,
    SupermindConsoleActionButtonsComponent,
    SupermindConsoleExploreFeedComponent,
  ],
})
export class SupermindModule {}
