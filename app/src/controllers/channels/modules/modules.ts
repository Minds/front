import { Component, View, CORE_DIRECTIVES, FORM_DIRECTIVES, Inject } from 'angular2/angular2';
import { Router, ROUTER_DIRECTIVES, RouteParams } from 'angular2/router';

import { Client } from '../../../services/api';
import { CARDS } from '../../../controllers/cards/cards';
import { Material } from '../../../directives/material';

@Component({
  selector: 'minds-channel-modules',
  inputs: ['type', '_owner: owner'],
  host: {
    'class': 'mdl-card mdl-shadow--2dp',
    '[hidden]': 'items.length == 0'
  },
  providers: [ Client ]
})
@View({
  template: `

    <div class="mdl-card__title">
      <h2 class="mdl-card__title-text" style="text-transform:capitalize">{{type}}s</h2>
    </div>

    <div class="mdl-card__supporting-text mdl-color-text--grey-600 minds-channel-media-sidebard" style="min-height:0;" *ng-if="type != 'blog'">
      <a *ng-for="#object of items" [router-link]="['/Archive-View', {guid: object.guid}]" [ng-style]="{'background-image': 'url(' + object.thumbnail_src + ')'}" >
      </a>
    </div>
    <div *ng-if="type == 'blog'" class="mdl-card__supporting-text minds-channel-blog-sidebar-blogs"  style="min-height:0;">
      <a *ng-for="#blog of items" class="mdl-color-text--grey-600" [router-link]="['/Blog-View', {guid: blog.guid}]" >
        {{blog.title}}
      </a>
    </div>
    <div class="mdl-spinner mdl-js-spinner is-active minds-channel-sidebar-loader" [mdl] [hidden]="!inProgress"></div>

    <ng-content></ng-content>

  `,
  directives: [ ROUTER_DIRECTIVES, CORE_DIRECTIVES, CARDS, Material ]
})

export class ChannelModules {

  items : Array<any> = [];
  type : string = "all";
  owner : any;

  inProgress : boolean = false;

  constructor(public client: Client){
    //this.load();
  }

  set _owner(value : any){
    this.owner = value;
    this.load();
  }

  load(){
    this.inProgress = true;

    var endpoint = 'api/v1/entities/owner/all/'+ this.owner.guid;
    switch(this.type){
      case 'blog':
        endpoint = 'api/v1/blog/owner/'+ this.owner.guid;
        break;
      case 'video':
        endpoint = 'api/v1/entities/owner/video/'+ this.owner.guid;
        break;
      case 'image':
        endpoint = 'api/v1/entities/owner/image/'+ this.owner.guid;
        break;
    }

    this.client.get(endpoint, {limit:9})
      .then((response : any) => {
        if(!(response.entities || response.blogs))
          return false;

        if(this.type == 'blog')
          this.items = response.blogs;
        else
          this.items = response.entities;
        this.inProgress = false;
      })
      .catch(function(e){
        this.inProgress = false;
      });
  }

}
