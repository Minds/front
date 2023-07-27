import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';

import { CommonModule } from '../../common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SuggestionsModule } from '../suggestions/suggestions.module';
import { SearchBarSuggestionsComponent } from './suggestions/suggestions.component';
import { SearchBarComponent } from './bar.component';

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SuggestionsModule,
  ],
  declarations: [SearchBarComponent, SearchBarSuggestionsComponent],
  providers: [],
  exports: [SearchBarSuggestionsComponent, SearchBarComponent],
})
export class SearchSharedModule {}
