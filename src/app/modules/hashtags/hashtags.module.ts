import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { FormsModule } from '@angular/forms';
import { TopbarHashtagsService } from './service/topbar.service';
import { TextInputAutocompleteModule } from '../../common/components/autocomplete';
import { TypeaheadInputComponent } from './typeahead-input/typeahead-input.component';
import { TrendingService } from './service/trending.service';
import { SuggestedService } from './service/suggested.service';
import { MruService } from './service/mru.service';
import { HashtagDefaultsService } from './service/defaults.service';
import { TrendingComponent } from './trending/trending.component';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    FormsModule,
    TextInputAutocompleteModule,
  ],
  declarations: [TrendingComponent, TypeaheadInputComponent],
  exports: [TrendingComponent, TypeaheadInputComponent],
  providers: [
    TopbarHashtagsService,
    TrendingService,
    HashtagDefaultsService,
    SuggestedService,
    MruService,
  ],
})
export class HashtagsModule {}
