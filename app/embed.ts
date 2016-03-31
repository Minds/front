import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {RouteConfig, Route, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, ROUTER_PRIMARY_COMPONENT, APP_BASE_HREF} from 'angular2/router';

import { ArchiveView } from './src/plugins/archive/archive';
import { MindsVideo } from './src/components/video';

@Component({
  selector: 'minds-embed',
  templateUrl: './src/controllers/embed.html',
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, MindsVideo ]
})
@RouteConfig([
  { path: '/archive/view/:guid', component: ArchiveView, as: 'Archive-View'},
])

export class Embed {
  object: any = {};

  constructor() {
    this.object = window.Minds.MindsEmbed || { };
  }
}
