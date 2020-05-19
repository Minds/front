import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { DiscoveryTagsService } from './tags/tags.service';
import { DiscoverySidebarTagsComponent } from './tags/sidebar-tags.component';
import { DiscoveryTagSettingsComponent } from './tags/settings.component';
import { DiscoveryFeedsSettingsComponent } from './feeds/settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DiscoverySidebarTagsComponent,
    DiscoveryTagSettingsComponent,
    DiscoveryFeedsSettingsComponent,
  ],
  exports: [DiscoverySidebarTagsComponent, DiscoveryTagSettingsComponent],
  providers: [DiscoveryTagsService],
})
export class DiscoverySharedModule {}
