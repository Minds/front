import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { RouterModule, Routes } from '@angular/router';
import { AuxComponent } from './aux-pages.component';
import { MarketingModule } from '../marketing/marketing.module';
import { MarkdownModule } from 'ngx-markdown';
import { PathMatch } from '../../common/types/angular.types';

const AUX_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'privacy',
    pathMatch: 'full' as PathMatch,
  },
  {
    path: ':path',
    component: AuxComponent,
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild(AUX_ROUTES),
    MarketingModule,
    MarkdownModule.forRoot(),
  ],
  declarations: [AuxComponent],
})
export class AuxModule {}
