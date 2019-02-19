import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LegacyModule } from '../legacy/legacy.module';

import { SuggestionsSidebar } from './channel/sidebar.component';
import { GroupSuggestionsSidebarComponent } from "./groups/sidebar.component";

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
    GroupSuggestionsSidebarComponent,
  ],
  exports: [
    SuggestionsSidebar,
    GroupSuggestionsSidebarComponent,
  ],
})
export class SuggestionsModule {
}

