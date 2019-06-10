import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { ServerTransferStateModule } from '@angular/platform-server';

import { MindsModule } from './app.module';
import { Minds } from './app.component';

@NgModule({
  imports: [
    MindsModule,
    ServerModule,
    ModuleMapLoaderModule,
    ServerTransferStateModule,
  ],
  bootstrap: [Minds],
})
export class AppServerModule {}
