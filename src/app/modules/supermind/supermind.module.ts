import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupermindConsoleComponent } from './console/console.component';
import { SupermindConsoleListComponent } from './console/list/list.component';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { SupermindConsoleListItemComponent } from './console/list/list-item/list-item.component';

const routes: Routes = [
  {
    path: 'supermind',
    component: SupermindConsoleComponent,
    children: [{ path: ':listType', component: SupermindConsoleListComponent }],
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
  ],
  declarations: [
    SupermindConsoleListComponent,
    SupermindConsoleComponent,
    SupermindConsoleListItemComponent,
  ],
})
export class SupermindModule {}
