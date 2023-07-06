import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '../../common/common.module';
import { AutocompleteSuggestionsService } from './services/autocomplete-suggestions.service';
import { PublisherRecommendationsComponent } from './publisher-recommendations/publisher-recommendations.component';
import { PublisherRecommendationsModalComponent } from './publisher-recommendations-modal/publisher-recommendations-modal.component';

@NgModule({
  imports: [
    CommonModule,
    NgCommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    PublisherRecommendationsComponent,
    PublisherRecommendationsModalComponent,
  ],
  exports: [
    PublisherRecommendationsComponent,
    PublisherRecommendationsModalComponent,
  ],
  providers: [AutocompleteSuggestionsService],
})
export class SuggestionsModule {}
