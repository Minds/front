import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { SERVER_PROVIDERS } from '../../app.server.module';
import { EmbedComponent } from './embed.component';
import { EmbedModule } from './embed.module';

@NgModule({
  imports: [EmbedModule, ServerModule],
  providers: SERVER_PROVIDERS,
  bootstrap: [EmbedComponent],
})
export class EmbedServerModule {}
