import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PathMatch } from '../../common/types/angular.types';

const routes: Routes = [
  {
    path: 'gift-cards',
    children: [
      {
        path: '', // '/gift-cards'
        pathMatch: 'full' as PathMatch,
        redirectTo: '/',
      },
      {
        path: 'claim', // '/gift-cards/claim'
        loadChildren: () =>
          import('./claim/claim.module').then(m => m.GiftCardClaimModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class GiftCardModule {}
