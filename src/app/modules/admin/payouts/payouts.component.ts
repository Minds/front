import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'minds-admin-payouts',
  templateUrl: 'payouts.component.html',
})
export class AdminPayouts {
  payouts: any[] = [];

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
      .get(`api/v1/admin/monetization/payouts/queue`, {
        limit: 50,
        offset: this.offset,
      })
      .then((response: any) => {
        if (!response.payouts) {
          this.inProgress = false;
          this.moreData = false;
          return;
        }

        this.payouts.push(...response.payouts);
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
    this.payouts.splice(index, 1);
  }

  review(index: number | null) {
    this.reviewing = index;
  }

  pay(index) {
    if (!window.confirm('Payment has no UNDO. Proceed?')) {
      return;
    }

    this.inProgress = true;
    this.reviewing = null;

    this.client
      .post(`api/v1/admin/monetization/payouts/${this.payouts[index].guid}`)
      .then(response => {
        this.removeFromList(index);
        this.inProgress = false;
      })
      .catch(e => {
        this.inProgress = false;
      });
  }
}
