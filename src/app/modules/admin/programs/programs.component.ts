import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'minds-admin-programs',
  templateUrl: 'programs.component.html',
})
export class AdminPrograms {
  applications: any[] = [];

  inProgress: boolean = false;
  moreData: boolean = true;
  offset: string = '';
  reviewing: number | null = null;

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
      .get(`api/v1/admin/programs/queue`, { limit: 50, offset: this.offset })
      .then((response: any) => {
        if (!response.applications) {
          this.inProgress = false;
          this.moreData = false;
          return;
        }

        this.applications.push(...response.applications);
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
    this.applications.splice(index, 1);
  }

  review(index: number | null) {
    this.reviewing = index;
  }

  accept(index) {
    if (!window.confirm('User will be ACCEPTED. There is no UNDO. Proceed?')) {
      return;
    }

    this.inProgress = true;
    this.reviewing = null;

    this.client
      .put(`api/v1/admin/programs/${this.applications[index].guid}`)
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
    this.reviewing = null;

    this.client
      .delete(`api/v1/admin/programs/${this.applications[index].guid}`)
      .then(response => {
        this.removeFromList(index);
        this.inProgress = false;
      })
      .catch(e => {
        this.inProgress = false;
      });
  }
}
