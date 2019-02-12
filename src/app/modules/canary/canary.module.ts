import { NgModule } from '@angular/core';

import { CanaryPageComponent } from './page.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'canary',
    component: CanaryPageComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NgCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    CanaryPageComponent
  ],
  exports: [
    CanaryPageComponent
  ],
  entryComponents: [
    CanaryPageComponent,
  ]
})

export class CanaryModule {
}
