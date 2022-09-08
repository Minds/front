import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnvironmentSelectorComponent } from './environment-selector/environment-selector.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '../../common/common.module';

const routes: Routes = [
  {
    path: 'devtools',
    children: [
      {
        path: '',
        component: EnvironmentSelectorComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NgCommonModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  declarations: [EnvironmentSelectorComponent],
})
export class DevToolsModule {}
