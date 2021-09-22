import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedirectGuard } from '../../services/redirect-guard';

const REDIRECT_URL = 'https://jobs.lever.co/minds/';

const routes: Routes = [
  {
    path: 'jobs',
    canActivate: [RedirectGuard],
    component: RedirectGuard,
    data: {
      externalUrl: REDIRECT_URL,
    },
  },
  {
    path: 'careers',
    canActivate: [RedirectGuard],
    component: RedirectGuard,
    data: {
      externalUrl: REDIRECT_URL,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class JobsMarketingModule {}
