import { NgModule, enableProdMode, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { Minds } from './app.component';
import { Embed } from './embed.component';

import { MindsAppRoutes, MindsAppRoutingProviders, MINDS_APP_ROUTING_DECLARATIONS } from './src/router/app';
import { MindsEmbedRoutes, MindsEmbedRoutingProviders, MINDS_EMBED_ROUTING_DECLARATIONS } from './src/router/embed';

import { MINDS_DECLARATIONS } from './src/declarations';
import { MINDS_PLUGIN_DECLARATIONS } from './src/plugin-declarations';
import { MINDS_PROVIDERS } from './src/services/providers';
import { MINDS_PLUGIN_PROVIDERS } from './src/plugin-providers';

// if ('<%= ENV %>' === 'prod') { enableProdMode(); }

let dynamicLoader: any = {
  bootstrapComponent: Minds,
  routing: MindsAppRoutes,
  routingProviders: MindsAppRoutingProviders,
  routingDeclarations: MINDS_APP_ROUTING_DECLARATIONS,
};

if (window.Minds.MindsContext === 'embed') {
  dynamicLoader = {
    bootstrapComponent: Embed,
    routing: MindsEmbedRoutes,
    routingProviders: MindsEmbedRoutingProviders,
    routingDeclarations: MINDS_EMBED_ROUTING_DECLARATIONS,
  };
}

@NgModule({
  bootstrap: [
    dynamicLoader.bootstrapComponent
  ],
  declarations: [
    Minds,
    Embed,
    dynamicLoader.routingDeclarations,
    MINDS_DECLARATIONS,
    MINDS_PLUGIN_DECLARATIONS,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(dynamicLoader.routing),
  ],
  providers: [
    MINDS_PROVIDERS,
    MINDS_PLUGIN_PROVIDERS,
    dynamicLoader.routingProviders,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class MindsModule {
}
