import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SearchHybridListComponent } from './list/hybrid.component';
import { SearchSimpleListComponent } from './list/simple.component';
import { SearchBarSuggestionsComponent } from './suggestions/suggestions.component';
import { SearchBarComponent } from './bar.component';
import { SearchComponent } from './search.component';

const searchRoutes: Routes = [
  { path: 'search', component: SearchComponent }
];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(searchRoutes),
    CommonModule
  ],
  declarations: [
    SearchHybridListComponent,
    SearchSimpleListComponent,
    SearchBarSuggestionsComponent,
    SearchBarComponent,
    SearchComponent
  ],
  providers: [
  ],
  exports: [
    SearchHybridListComponent,
    SearchSimpleListComponent,
    SearchBarSuggestionsComponent,
    SearchBarComponent,
  ],
  entryComponents: [
    SearchComponent
  ]
})
export class SearchModule {
}