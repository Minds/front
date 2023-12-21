import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { NetworksListComponent } from './list/list.component';
import { NetworksCreateRootUserModalService } from './create-root-user/create-root-user.modal.service';
import { NetworksCreateRootUserComponent } from './create-root-user/create-root-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NetworksCreateRootUserService } from './create-root-user/create-root-user.service';
import { AutoLoginService } from './auto-login.service';
import { loggedInRedirectGuard } from '../../common/guards/logged-in-redirect.guard';
import { PathMatch } from '../../common/types/angular.types';
import { ExperimentsModule } from '../experiments/experiments.module';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'checkout', // '/networks/checkout'
        canActivate: [loggedInRedirectGuard('/about/networks')],
        loadChildren: () =>
          import('./checkout/checkout.module').then(m => m.CheckoutModule),
      },
      {
        path: '', // '/networks'
        pathMatch: 'full' as PathMatch,
        component: NetworksListComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [NetworksListComponent, NetworksCreateRootUserComponent],
  imports: [
    RouterModule.forChild(routes),
    NgCommonModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ExperimentsModule,
  ],
  providers: [
    NetworksCreateRootUserModalService,
    NetworksCreateRootUserService,
    AutoLoginService,
  ],
})
export class NetworksModule {}
