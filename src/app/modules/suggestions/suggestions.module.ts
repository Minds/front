import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '../../common/common.module';
import { AutocompleteSuggestionsService } from './services/autocomplete-suggestions.service';
import { PublisherRecommendationsComponent } from './publisher-recommendations/publisher-recommendations.component';
import { PublisherRecommendationsModalComponent } from './publisher-recommendations-modal/publisher-recommendations-modal.component';
import { ModalCloseButtonComponent } from '~/common/components/modal-close-button/modal-close-button.component';

@NgModule({
  imports: [
    CommonModule,
    NgCommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ModalCloseButtonComponent,
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
