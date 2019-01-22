import { Component, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { Client } from '../../../../services/api';

@Component({
  selector: 'm-group--member-previews',
  templateUrl: 'member-previews.component.html'
})

export class GroupMemberPreviews {

  @Input() group;
  members: Array<any> = [];
  count: Number = 0;  
  inProgress: boolean = false;
  minds = window.Minds;

  constructor(private client: Client) {

  }

  ngOnInit() {
    this.load();
  }

  async load() {
    this.inProgress = true;

    try {
      let response: any = await this.client.get(`api/v1/groups/membership/${this.group.guid}`, { limit: 12 });

      if (!response.members) {
        return false;
      }

      this.members = response.members;

      if (response.total - this.members.length > 0) {
        this.count = response.total - this.members.length;
      }
      this.inProgress = false;
    } catch {
        this.inProgress = false;
    }
  }

}
