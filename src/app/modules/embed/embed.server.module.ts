import { NgModule } from '@angular/core';
import {
  BrowserModule,
  BrowserTransferStateModule,
} from '@angular/platform-browser';
import {
  ServerModule,
  ServerTransferStateModule,
} from '@angular/platform-server';
import { SERVER_PROVIDERS } from '../../app.server.module';
import { EmbedComponent } from './embed.component';
import { EmbedModule } from './embed.module';

@NgModule({
  imports: [
    EmbedModule,
    BrowserModule.withServerTransition({ appId: 'm-app' }),
    BrowserTransferStateModule,
    ServerModule,
    ServerTransferStateModule,
  ],
  providers: SERVER_PROVIDERS,
  bootstrap: [EmbedComponent],
})
export class EmbedServerModule {}
