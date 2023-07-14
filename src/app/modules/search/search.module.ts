import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SearchBarSuggestionsComponent } from './suggestions/suggestions.component';
import { SearchBarComponent } from './bar.component';
import { SearchComponent } from './search.component';
import { DiscoverySharedModule } from '../discovery/discovery-shared.module';
import { SuggestionsModule } from '../suggestions/suggestions.module';

const searchRoutes: Routes = [
  {
    path: 'search',
    component: SearchComponent,
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(searchRoutes),
    CommonModule,
    DiscoverySharedModule,
    SuggestionsModule,
  ],
  declarations: [
    SearchBarSuggestionsComponent,
    SearchBarComponent,
    SearchComponent,
  ],
  providers: [],
  exports: [SearchBarSuggestionsComponent, SearchBarComponent],
})
export class SearchModule {}
