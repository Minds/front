import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '../../common/common.module';
import { LegacyModule } from '../legacy/legacy.module';

import { SuggestionsSidebar } from './sidebar.component';

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule,
    LegacyModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    SuggestionsSidebar,
  ],
  exports: [
    SuggestionsSidebar,
  ],
  //entryComponents: [
  //  SuggestedSidebar,
  //]
})
export class SuggestionsModule {
}

