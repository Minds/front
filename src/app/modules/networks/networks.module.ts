import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { NetworksListComponent } from './list/list.component';
import { NetworksCreateRootUserModalService } from './create-root-user/create-root-user.modal.service';
import { NetworksCreateRootUserComponent } from './create-root-user/create-root-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NetworksCreateRootUserService } from './create-root-user/create-root-user.service';

const routes: Routes = [
  {
    path: '',
    component: NetworksListComponent,
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
  ],
  providers: [
    NetworksCreateRootUserModalService,
    NetworksCreateRootUserService,
  ],
})
export class NetworksModule {}
