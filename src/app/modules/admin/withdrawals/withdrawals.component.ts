import { Component } from '@angular/core';
import { Client } from '../../../services/api';
import { ActivatedRoute } from '@angular/router';
import { FormToastService } from '../../../common/services/form-toast.service';

@Component({
  moduleId: module.id,
  selector: 'm-admin-withdrawals',
  templateUrl: 'withdrawals.component.html',
  styleUrls: ['./withdrawals.component.ng.scss'],
})
export class AdminWithdrawals {
  withdrawals: any[] = [];

  inProgress: boolean = false;
  moreData: boolean = true;
  offset: string = '';

  user: string = '';

  constructor(
    protected client: Client,
    protected route: ActivatedRoute,
    protected toasterService: FormToastService
  ) {}

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
      this.toasterService.error(
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
      this.toasterService.error(
        `There was an issue while rejecting withdrawal: ${(e && e.message) ||
          'Unknown server error'}`
      );
    }

    this.inProgress = false;
  }

  /**
   * Add a missing withdrawal
   * @param { string } txid - transaction id (txid).
   * @returns { Promise<void> }
   */
  async addMissingWithdrawal(txid: string): Promise<void> {
    this.inProgress = true;
    try {
      await this.client.post('api/v2/admin/rewards/withdrawals', {
        action: 'missing',
        txid: txid,
      });
      this.toasterService.success('Withdrawal resubmitted');
    } catch (e) {
      this.toasterService.error(e.message);
    }
    this.inProgress = false;
  }

  /**
   * Attempt to repair withdrawal
   * @param { any } request - request object.
   * @returns { Promise<void> }
   */
  async repairWithdrawal(request: any): Promise<void> {
    this.inProgress = true;
    try {
      await this.client.post('api/v2/admin/rewards/withdrawals', {
        action: 'repair',
        request_txid: request.tx,
        user_guid: request.user_guid,
        timestamp: request.timestamp,
      });
      this.toasterService.success('Withdrawal submitted for repair');
    } catch (e) {
      this.toasterService.error(e.message);
    }
    this.inProgress = false;
  }
}
