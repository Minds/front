import { Component, OnInit, ViewChild } from '@angular/core';
import { Client } from '../../../../../services/api/client';
import { AnalyticsCardComponent } from '../card/card.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'm-analyticsusersegments__card',
  templateUrl: 'segments.component.html',
})
export class UserSegmentsCardComponent implements OnInit {
  @ViewChild('card', { static: true }) card: AnalyticsCardComponent;

  subscription: Subscription;

  resurrected: number = 0;
  new: number = 0;
  curious: number = 0;
  core: number = 0;
  cold: number = 0;
  casual: number = 0;
  currents: { name: string; value: number }[];

  constructor(private client: Client) {}

  ngOnInit() {
    this.getAvgData();

    this.subscription = this.card.selectedOptionChange.subscribe(() => {
      this.getAvgData();
    });
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  private async getAvgData() {
    try {
      const response: any = await this.client.get(
        'api/v2/analytics/usersegments',
        {
          key: 'avg',
          timespan: this.card.selectedOption,
        }
      );

      this.resurrected = response.data['resurrected'];
      this.new = response.data['new'];
      this.curious = response.data['curious'];
      this.core = response.data['core'];
      this.cold = response.data['cold'];
      this.casual = response.data['casual'];
    } catch (e) {
      console.error(e);
    }
  }
}
