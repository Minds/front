import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SearchComponent } from './search.component';
import { DiscoverySharedModule } from '../discovery/discovery-shared.module';
import { SuggestionsModule } from '../suggestions/suggestions.module';
import { PathMatch } from '../../common/types/angular.types';
import { SearchSharedModule } from './search-shared.module';

const searchRoutes: Routes = [
  {
    path: 'search',
    component: SearchComponent,
    pathMatch: 'full' as PathMatch,
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule.forChild(searchRoutes),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DiscoverySharedModule,
    SuggestionsModule,
    SearchSharedModule,
  ],
  declarations: [SearchComponent],
  providers: [],
  exports: [],
})
export class SearchModule {}
