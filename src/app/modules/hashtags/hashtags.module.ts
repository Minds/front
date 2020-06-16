import { NgModule } from '@angular/core';
import { HashtagsSelectorComponent } from './selector/selector.component';
import { HashtagsSelectorModalComponent } from './hashtag-selector-modal/hashtags-selector.component';
import { TagsInput } from './tags-input/tags.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { FormsModule } from '@angular/forms';
import { TopbarHashtagsComponent } from './topbar/topbar.component';
import { TopbarHashtagsService } from './service/topbar.service';
import { HashtagsTopbarSelectorComponent } from './topbar-selector/topbar-selector.component';
import { SidebarSelectorComponent } from './sidebar-selector/sidebar-selector.component';
import { SidebarSelectorItemComponent } from './sidebar-selector/item.component';
import { TextInputAutocompleteModule } from '../../common/components/autocomplete';
import { HashtagsDefaultComponent } from './defaults/defaults.component';
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
  declarations: [
    HashtagsSelectorComponent,
    HashtagsSelectorModalComponent,
    TagsInput,
    TopbarHashtagsComponent,
    HashtagsTopbarSelectorComponent,
    SidebarSelectorComponent,
    SidebarSelectorItemComponent,
    TrendingComponent,
    HashtagsDefaultComponent,
    TypeaheadInputComponent,
  ],
  exports: [
    HashtagsSelectorComponent,
    HashtagsSelectorModalComponent,
    TagsInput,
    TopbarHashtagsComponent,
    HashtagsTopbarSelectorComponent,
    SidebarSelectorComponent,
    TrendingComponent,
    HashtagsDefaultComponent,
    TypeaheadInputComponent,
  ],
  providers: [
    TopbarHashtagsService,
    TrendingService,
    HashtagDefaultsService,
    SuggestedService,
    MruService,
  ],
})
export class HashtagsModule {}
