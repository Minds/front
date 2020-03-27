import { NgModule } from '@angular/core';
import { PageLayoutService } from './layout/page-layout.service';
import { FeaturesService } from '../services/features.service';
import { ConfigsService } from './services/configs.service';

@NgModule({
  providers: [ConfigsService, PageLayoutService, FeaturesService],
})
export class SharedModule {}
