import { NgModule } from '@angular/core';
import { CommonModule } from '../../common/common.module';
import { CommonModule as NgCommonModule } from '@angular/common';
import { TagSettingsComponent } from './tag-settings/tag-settings.component';
import { TagSettingsService } from './tag-settings.service';
import { HashtagsModule } from '../hashtags/hashtags.module';

@NgModule({
  declarations: [TagSettingsComponent],
  exports: [TagSettingsComponent],
  imports: [CommonModule, NgCommonModule, HashtagsModule],
  providers: [TagSettingsService],
})
export class TagSettingsModule {}
