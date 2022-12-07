import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupermindConsoleComponent } from './console/console.component';
import { SupermindConsoleListComponent } from './console/list/list.component';
import { SupermindConsoleListItemComponent } from './console/list/list-item/list-item.component';
import { SupermindConsoleFilterBarComponent } from './console/list/filter-bar/filter-bar.component';
import { SupermindConsoleStateLabelComponent } from './console/list/list-item/state-label/state-label.component';
import { SupermindConsoleActionButtonsComponent } from './console/list/list-item/action-bar/action-buttons.component';

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
  ],
  declarations: [
    SupermindConsoleListComponent,
    SupermindConsoleComponent,
    SupermindConsoleListItemComponent,
    SupermindConsoleFilterBarComponent,
    SupermindConsoleStateLabelComponent,
    SupermindConsoleActionButtonsComponent,
  ],
})
export class SupermindModule {}
