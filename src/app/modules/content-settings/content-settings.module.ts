import { NgModule } from '@angular/core';
import { CommonModule } from '../../common/common.module';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ContentSettingsModalComponent } from './modal/modal.component';
import { CompassModule } from '../compass/compass.module';
import { ContentSettingsService } from './content-settings.service';
import { NsfwSettingsModule } from '../nsfw-settings/nsfw-settings.module';
import { TagSettingsModule } from '../tag-settings/tag-settings.module';

const COMPONENTS = [ContentSettingsModalComponent];

@NgModule({
  imports: [
    CommonModule,
    NgCommonModule,
    CompassModule,
    NsfwSettingsModule,
    TagSettingsModule,
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [ContentSettingsService],
})
export class ContentSettingsModule {}
