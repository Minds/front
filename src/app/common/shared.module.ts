import { NgModule } from '@angular/core';
import { PageLayoutService } from './layout/page-layout.service';
import { FeaturesService } from '../services/features.service';
import { ConfigsService } from './services/configs.service';
import { AuthModalService } from '../modules/auth/modal/auth-modal.service';

@NgModule({
  providers: [
    ConfigsService,
    PageLayoutService,
    FeaturesService,
    AuthModalService,
  ],
})
export class SharedModule {}
