import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'm-admin--verify',
  templateUrl: 'verify.component.html',
})
export class AdminVerify {
  requests: any[] = [];

  inProgress: boolean = false;
  moreData: boolean = true;
  offset: string = '';

  constructor(public client: Client, private route: ActivatedRoute) {}

  ngOnInit() {
    this.load();
  }

  load() {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;

    this.client
      .get(`api/v1/admin/verify`, { limit: 24, offset: this.offset })
      .then((response: any) => {
        if (!response.requests) {
          this.inProgress = false;
          this.moreData = false;
          return;
        }

        this.requests.push(...response.requests);
        this.inProgress = false;

        if (response['load-next']) {
          this.offset = response['load-next'];
        } else {
          this.moreData = false;
        }
      })
      .catch(e => {
        this.inProgress = false;
      });
  }

  removeFromList(index) {
    this.requests.splice(index, 1);
  }

  verify(index) {
    this.inProgress = true;

    this.client
      .put(`api/v1/admin/verify/${this.requests[index].guid}`)
      .then(response => {
        this.removeFromList(index);
        this.inProgress = false;
      })
      .catch(e => {
        this.inProgress = false;
      });
  }

  reject(index) {
    if (!window.confirm('User will be REJECTED. There is no UNDO. Proceed?')) {
      return;
    }

    this.inProgress = true;

    this.client
      .delete(`api/v1/admin/verify/${this.requests[index].guid}`)
      .then(response => {
        this.removeFromList(index);
        this.inProgress = false;
      })
      .catch(e => {
        this.inProgress = false;
      });
  }
}
