import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Client } from '../../../services/api/client';
import { MindsUser } from '../../../interfaces/entities';

export type Pledge = {
  user: MindsUser,
  wallet_address: string,
  timestamp: number,
  amount: number,
  phone_number_hash?: string,
  status: string,
};

@Component({
  selector: 'm-admin--pledges',
  templateUrl: 'pledges.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AdminPledgesComponent {
  pledges: Array<Pledge> = [];
  offset = '';

  inProgress: boolean = false;
  moreData: boolean = false;


  constructor(private client: Client, private cd: ChangeDetectorRef) {
    this.load(true);
  }

  async load(refresh: boolean = false) {
    if (refresh) {
      this.pledges = [];
      this.offset = '';
      this.moreData = true;
    }

    this.inProgress = true;


    try {
      const response: any = await this.client.get('api/v1/admin/pledges', { offset: this.offset });

      this.pledges.push(...response.pledges);

      if (response['load-next']) {
        this.offset = response['load-next'];
      } else {
        this.moreData = false;
      }
    } catch (e) {
      console.error(e);
    }

    this.inProgress = false;

    this.detectChanges();
  }

  async approve(i) {
    if (this.inProgress || !confirm('Are you sure you want to APPROVE this pledge?')) {
      return;
    }

    this.inProgress = true;
    this.detectChanges();

    try {
      const item = this.pledges[i];
      const response: any = await this.client.put(`api/v1/admin/pledges/${item.phone_number_hash}`);

      this.pledges[i] = response.pledge;
    } catch (e) {
      console.error(e);
    }

    this.inProgress = false;
    this.detectChanges();
  }

  async reject(i) {
    if (this.inProgress || !confirm('Are you sure you want to REJECT this pledge?')) {
      return;
    }

    this.inProgress = true;
    this.detectChanges();

    try {
      const item = this.pledges[i];
      const response: any = await this.client.delete(`api/v1/admin/pledges/${item.phone_number_hash}`);

      this.pledges[i] = response.pledge;
    } catch (e) {
      console.error(e);
    }

    this.inProgress = false;
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}