import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'minds-admin-monetization',
  templateUrl: 'monetization.html',
})
export class AdminMonetization {
  entities: any[] = [];

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
      .get(`api/v1/admin/paywall/review`, { limit: 12, offset: this.offset })
      .then((response: any) => {
        if (!response.entities) {
          this.inProgress = false;
          this.moreData = false;
          return;
        }

        this.entities.push(...response.entities);

        if (response['load-next']) {
          this.offset = response['load-next'];
        } else {
          this.moreData = false;
        }

        this.inProgress = false;
      })
      .catch(e => {
        this.inProgress = false;
      });
  }

  removeFromList(index) {
    this.entities.splice(index, 1);
  }

  deMonetize(entity: any, index: number) {
    this.client
      .post(`api/v1/admin/paywall/${entity.guid}/demonetize`, {})
      .then((response: any) => {
        if (response.status !== 'success') {
          alert(
            'There was a problem demonetizing this content. Please try again.'
          );
          return;
        }
        this.removeFromList(index);
      })
      .catch(e => {
        alert(
          'There was a problem demonetizing this content. Please try again.'
        );
      });
  }
}
