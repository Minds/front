import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '../../common/common.module';
import { AutocompleteSuggestionsService } from './services/autocomplete-suggestions.service';
import { ChannelRecommendationComponent } from './channel-recommendation/channel-recommendation.component';
import { ChannelRecommendationModalComponent } from './channel-recommendation-modal/channel-recommendation-modal.component';

@NgModule({
  imports: [
    CommonModule,
    NgCommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ChannelRecommendationComponent,
    ChannelRecommendationModalComponent,
  ],
  exports: [
    ChannelRecommendationComponent,
    ChannelRecommendationModalComponent,
  ],
  providers: [AutocompleteSuggestionsService],
})
export class SuggestionsModule {}
