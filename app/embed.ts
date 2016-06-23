import {Component} from '@angular/core';
import {CORE_DIRECTIVES, APP_BASE_HREF} from '@angular/common';
import {RouteConfig, Route, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, ROUTER_PRIMARY_COMPONENT} from '@angular/router-deprecated';

import { ArchiveView } from './src/plugins/archive/archive';
import { MindsVideo } from './src/components/video';

@Component({
  selector: 'minds-embed',
  templateUrl: './src/controllers/embed.html',
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, MindsVideo ]
})
@RouteConfig([
  { path: '/archive/view/:guid', component: ArchiveView, name: 'Archive-View'},
])

export class Embed {
  object: any = {};

  constructor() {
    this.object = window.Minds.MindsEmbed || { };
  }
}
