import { Routes } from '@angular/router';
import { SupermindConsoleComponent } from './console/console.component';
import { MindsOnlyRedirectGuard } from '~/common/guards/minds-only-redirect.guard';
import { loggedOutExplainerScreenGuard } from '../explainer-screens/guards/logged-out-explainer-screen.guard';
import { PathMatch } from '~/common/types/angular.types';
import { SupermindConsoleExploreFeedComponent } from './console/explore-feed/explore-feed.component';
import { SupermindConsoleListComponent } from './console/list/list.component';

export const supermindRoutes: Routes = [
  {
    path: 'supermind',
    component: SupermindConsoleComponent,
    canActivate: [MindsOnlyRedirectGuard, loggedOutExplainerScreenGuard()],
    children: [
      { path: '', redirectTo: 'explore', pathMatch: 'full' as PathMatch },
      { path: 'explore', component: SupermindConsoleExploreFeedComponent },
      { path: ':listType', component: SupermindConsoleListComponent },
    ],
  },
];
