import { NgModule } from '@angular/core';
import { CommonModule } from '../../common/common.module';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ContentSettingsComponent } from './content-settings/content-settings.component';
import { CompassModule } from '../compass/compass.module';
import { ContentSettingsService } from './content-settings.service';
import { NsfwSettingsModule } from '../nsfw-settings/nsfw-settings.module';
import { TagSettingsModule } from '../tag-settings/tag-settings.module';
import { DiscoverySharedModule } from '../discovery/discovery-shared.module';

const COMPONENTS = [ContentSettingsComponent];

@NgModule({
  imports: [
    CommonModule,
    NgCommonModule,
    CompassModule,
    NsfwSettingsModule,
    TagSettingsModule,
    DiscoverySharedModule,
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [ContentSettingsService],
})
export class ContentSettingsModule {}
