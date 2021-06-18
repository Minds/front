import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SearchBarSuggestionsComponent } from './suggestions/suggestions.component';
import { SearchBarComponent } from './bar.component';

const searchRoutes: Routes = [{ path: 'search', redirectTo: 'discovery' }];

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(searchRoutes),
    CommonModule,
  ],
  declarations: [SearchBarSuggestionsComponent, SearchBarComponent],
  providers: [],
  exports: [SearchBarSuggestionsComponent, SearchBarComponent],
})
export class SearchModule {}
