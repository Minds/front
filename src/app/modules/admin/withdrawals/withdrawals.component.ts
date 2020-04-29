import { Component } from '@angular/core';
import { Client } from '../../../services/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'm-admin-withdrawals',
  templateUrl: 'withdrawals.component.html',
})
export class AdminWithdrawals {
  withdrawals: any[] = [];

  inProgress: boolean = false;
  moreData: boolean = true;
  offset: string = '';

  user: string = '';

  constructor(protected client: Client, protected route: ActivatedRoute) {}

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

    const params = {
      limit: 50,
      offset: this.offset,
    };

    if (this.user) {
      params['user'] = this.user;
    } else {
      params['status'] = 'pending_approval';
    }

    this.client
      .get(`api/v2/admin/rewards/withdrawals`, params)
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

  async approve(withdrawal) {
    if (!confirm("Do you want to approve this withdrawal? There's no UNDO.")) {
      return;
    }

    this.inProgress = true;

    try {
      const endpoint = `api/v2/admin/rewards/withdrawals/${[
        withdrawal.user_guid,
        withdrawal.timestamp,
        withdrawal.tx,
      ].join('/')}`;

      await this.client.put(endpoint);

      withdrawal.status = 'approved';
    } catch (e) {
      alert(
        `There was an issue while approving withdrawal: ${(e && e.message) ||
          'Unknown server error'}`
      );
    }

    this.inProgress = false;
  }

  async reject(withdrawal) {
    if (!confirm("Do you want to reject this withdrawal? There's no UNDO.")) {
      return;
    }

    this.inProgress = true;

    try {
      const endpoint = `api/v2/admin/rewards/withdrawals/${[
        withdrawal.user_guid,
        withdrawal.timestamp,
        withdrawal.tx,
      ].join('/')}`;

      await this.client.delete(endpoint);

      withdrawal.status = 'rejected';
    } catch (e) {
      alert(
        `There was an issue while rejecting withdrawal: ${(e && e.message) ||
          'Unknown server error'}`
      );
    }

    this.inProgress = false;
  }
}
