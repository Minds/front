import { Component } from '@angular/core';

import { Client } from '../../../services/api';
import { AttachmentService } from '../../../services/attachment';

@Component({
  selector: 'm-channel--modules',
  inputs: ['type', '_owner: owner', '_container: container', 'limit', 'linksTo'],
  host: {
    'class': 'mdl-card m-border',
    '[hidden]': 'items.length == 0'
  },
  templateUrl: 'modules.component.html'
})

export class ChannelModulesComponent {

  items: Array<any> = [];
  type: string = 'all';
  owner: any;
  container: any;
  limit: number = 9;
  linksTo: any;

  inProgress: boolean = false;

  constructor(public client: Client, public attachment: AttachmentService) {
    //this.load();
  }

  set _owner(value: any) {
    this.owner = value;
    this.load();
  }

  set _container(value: any) {
    this.container = value;
    this.load();
  }

  load() {
    this.inProgress = true;

    let containerType = this.owner ? 'owner' : 'container',
      guid = this.owner ? this.owner.guid : this.container.guid;

    var endpoint = `api/v1/entities/${containerType}/all/${guid}`;
    switch (this.type) {
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

    this.client.get(endpoint, { limit: this.limit })
      .then((response: any) => {
        let items = response.entities || response.blogs;
        if (!(items))
          return false;
        this.items = items;
        this.inProgress = false;
      })
      .catch(function (e) {
        this.inProgress = false;
      });
  }

}
