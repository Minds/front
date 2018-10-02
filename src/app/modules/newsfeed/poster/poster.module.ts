import { NgModule } from '@angular/core';

import { ModalPosterComponent } from './poster-modal.component';
import { PosterComponent } from './poster.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WireModule } from '../../wire/wire.module';
import { ThirdPartyNetworksModule } from '../../third-party-networks/third-party-networks.module';
import { CommonModule } from '../../../common/common.module';
import { RouterModule } from '@angular/router';
import { HashtagsModule } from '../../hashtags/hashtags.module';
import { TextInputAutocompleteModule } from 'angular-text-input-autocomplete';

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    RouterModule,
    CommonModule,
    WireModule,
    ThirdPartyNetworksModule,
    HashtagsModule,
    TextInputAutocompleteModule,
  ],
  declarations: [
    PosterComponent,
    ModalPosterComponent
  ],
  exports: [
    PosterComponent,
    ModalPosterComponent
  ],
  entryComponents: [
    PosterComponent,
    ModalPosterComponent
  ],
})
export class PosterModule {
}
