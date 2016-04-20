import { Component } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { Router, ROUTER_DIRECTIVES, RouteParams } from 'angular2/router';

import { Client } from '../../../services/api';
import { CARDS } from '../../../controllers/cards/cards';
import { Material } from '../../../directives/material';
import { BlogCard } from '../../../plugins/blog/card/card';

import { AttachmentService } from '../../../services/attachment';

@Component({
  selector: 'minds-channel-modules',
  inputs: ['type', '_owner: owner', '_container: container', 'limit'],
  host: {
    'class': 'mdl-card mdl-shadow--2dp',
    '[hidden]': 'items.length == 0'
  },
  template: `

    <div class="mdl-card__title">
      <h2 class="mdl-card__title-text" style="text-transform:capitalize">{{type}}s</h2>
    </div>

    <div class="mdl-card__supporting-text mdl-color-text--grey-600 minds-channel-media-sidebard" style="min-height:0;" *ngIf="type != 'blog'">
      <a *ngFor="#object of items"
      [routerLink]="['/Archive-View', {guid: object.guid}]"
      [ngClass]="{ 'm-mature-thumbnail': object.mature }"
      >
        <span class="m-thumb-image" [ngStyle]="{'background-image': 'url(' + object.thumbnail_src + ')'}"></span>
        <i class="material-icons">explicit</i>
      </a>
    </div>
    <div *ngIf="type == 'blog'" style="min-height:0;">
      <minds-card-blog [object]="blog" *ngFor="#blog of items" class="mdl-card" style="border-radius:0;">
        {{blog.title}}
      </minds-card-blog>
    </div>
    <div class="mdl-spinner mdl-js-spinner is-active minds-channel-sidebar-loader" [mdl] [hidden]="!inProgress"></div>

    <ng-content></ng-content>

  `,
  directives: [ ROUTER_DIRECTIVES, CORE_DIRECTIVES, CARDS, BlogCard, Material ],
  bindings: [ AttachmentService ]
})

export class ChannelModules {

  items : Array<any> = [];
  type : string = "all";
  owner : any;
  container : any;
  limit : number = 9;

  inProgress : boolean = false;

  constructor(public client: Client, public attachment: AttachmentService){
    //this.load();
  }

  set _owner(value : any){
    this.owner = value;
    this.load();
  }

  set _container(value : any){
    this.container = value;
    this.load();
  }

  load(){
    this.inProgress = true;

    let containerType = this.owner ? 'owner' : 'container',
      guid = this.owner ? this.owner.guid : this.container.guid;

    var endpoint = `api/v1/entities/${containerType}/all/${guid}`;
    switch(this.type){
      case 'blog':
        endpoint = `api/v1/blog/${containerType}/${guid}`;
        this.limit = 3;
        break;
      case 'video':
        endpoint = `api/v1/entities/${containerType}/video/${guid}`;
        this.limit = 6;
        break;
      case 'image':
        endpoint = `api/v1/entities/${containerType}/image/${guid}`;
        break;
    }

    this.client.get(endpoint, {limit:this.limit})
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
