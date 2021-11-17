import { NgModule } from '@angular/core';
import { CommonModule } from '../../common/common.module';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NsfwSettingsFormComponent } from './form/form.component';
import { NsfwSettingsService } from './nsfw-settings.service';
import { DiscoverySharedModule } from '../discovery/discovery-shared.module';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DiscoverySharedModule,
  ],
  declarations: [NsfwSettingsFormComponent],
  providers: [NsfwSettingsService],
})
export class NsfwSettingsModule {}
