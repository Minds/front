import { Component, Input, ViewChild } from '@angular/core';

import { Client } from '../../../services/api';

@Component({
  selector: 'm-group--members-module',
  host: {
    'class': 'm-group--members mdl-card mdl-shadow--2dp',
    '[hidden]': 'members.length == 0'
  },
  templateUrl: 'members.html'
})

export class GroupsMembersModuleComponent {
members: Array<any> = [];
  @ViewChild('el') el;

  group: any;
  limit: number = 21;
  @Input() linksTo: any;

  inProgress: boolean = false;

  constructor(public client: Client) {
  }

  @Input('group') set _group(value: any) {
    this.group = value;
    this.load();
    this.el.nativeElement.scrollIntoView();
  }

  load() {
    this.inProgress = true;

    this.client.get(`api/v1/groups/membership/${this.group.guid}`, { limit: this.limit })
      .then((response: any) => {
        if (!response.members) {
          return false;
        }

        this.members = response.members;
        this.inProgress = false;
      })
      .catch((e) => {
        this.inProgress = false;
      });
  }
}
