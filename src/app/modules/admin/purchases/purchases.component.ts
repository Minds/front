import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { Client } from '../../../services/api/client';
import { MindsUser } from '../../../interfaces/entities';

export type Purchase = {
  user: MindsUser;
  tx: string;
  wallet_address: string;
  timestamp: number;
  requested_amount: number;
  issued_amount: number;
  phone_number_hash?: string;
  status: string;
};

@Component({
  selector: 'm-admin--purchases',
  templateUrl: 'purchases.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPurchasesComponent {
  purchases: Array<Purchase> = [];
  offset = '';

  inProgress: boolean = false;
  moreData: boolean = false;

  constructor(private client: Client, private cd: ChangeDetectorRef) {
    this.load(true);
  }

  async load(refresh: boolean = false) {
    if (refresh) {
      this.purchases = [];
      this.offset = '';
      this.moreData = true;
    }

    this.inProgress = true;

    try {
      const response: any = await this.client.get('api/v1/admin/purchases', {
        offset: this.offset,
      });

      this.purchases.push(...response.purchases);

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

  async issue(i) {
    if (
      this.inProgress ||
      !confirm('Are you sure you want to APPROVE this pledge?')
    ) {
      return;
    }

    this.inProgress = true;
    this.detectChanges();

    try {
      const item = this.purchases[i];
      const response: any = await this.client.put(
        `api/v1/admin/purchases/${item.phone_number_hash}/${item.tx}`
      );

      this.purchases[i] = response.purchase;
    } catch (e) {
      console.error(e);
    }

    this.inProgress = false;
    this.detectChanges();
  }

  async reject(i) {
    if (
      this.inProgress ||
      !confirm('Are you sure you want to REJECT this pledge?')
    ) {
      return;
    }

    this.inProgress = true;
    this.detectChanges();

    try {
      const item = this.purchases[i];
      const response: any = await this.client.delete(
        `api/v1/admin/purchases/${item.phone_number_hash}/{item.tx}`
      );

      this.purchases[i] = response.purchase;
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
