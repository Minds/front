import { Component } from '@angular/core';

import { Client } from '../../../services/api';
import { AttachmentService } from '../../../services/attachment';

@Component({
  selector: 'minds-channel-modules',
  inputs: ['type', '_owner: owner', '_container: container', 'limit', 'linksTo'],
  host: {
    'class': 'mdl-card mdl-shadow--2dp',
    '[hidden]': 'items.length == 0'
  },
  template: `

    <div class="mdl-card__title" [routerLink]="linksTo">
      <h2 class="mdl-card__title-text" style="text-transform:capitalize">{{type}}s</h2>
    </div>

    <div class="mdl-card__supporting-text mdl-color-text--grey-600 minds-channel-media-sidebard" style="min-height:0;" *ngIf="type != 'blog'">
      <a *ngFor="let object of items"
      [routerLink]="['/media', object.guid]"
      [ngClass]="{ 'm-mature-module-thumbnail': attachment.shouldBeBlurred(object) }"
      >
        <span class="m-thumb-image" [ngStyle]="{'background-image': 'url(' + object.thumbnail_src + ')'}"></span>
        <i class="material-icons">explicit</i>
      </a>
    </div>
    <div *ngIf="type == 'blog'" style="min-height:0;">
      <minds-card [object]="blog" *ngFor="let blog of items" class="mdl-card" style="border-radius:0;"></minds-card>
    </div>
    <div class="mdl-spinner mdl-js-spinner is-active minds-channel-sidebar-loader" [mdl] [hidden]="!inProgress"></div>

    <ng-content></ng-content>

  `
})

export class ChannelModulesComponent {

  items : Array<any> = [];
  type : string = "all";
  owner : any;
  container : any;
  limit : number = 9;
  linksTo: any;

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
