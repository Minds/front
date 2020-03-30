import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { DiscoveryTagsService } from './tags/tags.service';
import { DiscoverySidebarTagsComponent } from './tags/sidebar-tags.component';
import { DiscoveryTagSettingsComponent } from './tags/settings.component';

@NgModule({
  imports: [NgCommonModule, CommonModule, RouterModule],
  declarations: [DiscoverySidebarTagsComponent, DiscoveryTagSettingsComponent],
  exports: [DiscoverySidebarTagsComponent, DiscoveryTagSettingsComponent],
  providers: [DiscoveryTagsService],
  entryComponents: [
    DiscoveryTagSettingsComponent,
    DiscoveryTagSettingsComponent,
  ],
})
export class DiscoverySharedModule {}
