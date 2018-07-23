import { Component } from '@angular/core';
import { Client } from '../../../services/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'minds-admin-withdrawals',
  templateUrl: 'withdrawals.component.html',
})
export class AdminWithdrawals {

  withdrawals: any[] = [];

  inProgress: boolean = false;
  moreData: boolean = true;
  offset: string = '';

  user: string = '';

  constructor(
    protected client: Client,
    protected route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.user = params['user'] || '';

      this.load(true);
    });

    this.load();
  }

  load(refresh: boolean = false) {
    if (this.inProgress && !refresh) {
      return;
    }

    if (refresh) {
      this.withdrawals = [];
      this.offset = '';
      this.moreData = true;
    }

    if (!this.moreData) {
      return false;
    }

    this.inProgress = true;

    this.client.get(`api/v2/admin/rewards/withdrawals`, {
      limit: 50,
      offset: this.offset,
      user: this.user
    })
      .then((response: any) => {
        if (!response.withdrawals) {
          this.inProgress = false;
          this.moreData = false;
          return;
        }

        this.withdrawals.push(...response.withdrawals);
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
}
