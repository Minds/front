import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { NetworksListComponent } from './list/list.component';
import { NetworksListService } from './list/list.service';
import { NetworksCreateAdminModalService } from './create-admin/create-admin.modal.service';
import { NetworksCreateAdminComponent } from './create-admin/create-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: NetworksListComponent,
  },
];

@NgModule({
  declarations: [NetworksListComponent, NetworksCreateAdminComponent],
  imports: [
    RouterModule.forChild(routes),
    NgCommonModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [NetworksListService, NetworksCreateAdminModalService],
})
export class NetworksModule {}
