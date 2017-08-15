import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { WireService } from '../../wire.service';


@Component({
  selector: 'm-wire-channel--overview',
  templateUrl: 'overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WireChannelOverviewComponent implements OnInit, OnDestroy {

  ready: boolean = true;
  stats: { sum, count, avg, sent? } = {
    sum: 0,
    count: 0,
    avg: 0,
    sent: 0
  };
  sentSubscription;

  @Input() channel: any;

  constructor(private wireService: WireService, private client: Client, private session: Session, private cd: ChangeDetectorRef) {
    this.sentSubscription = this.wireService.wireSent.subscribe((wire) => {
      this.getStats();
    });
  }

  ngOnInit() {
    this.getStats();
  }

  ngOnDestroy() {
    if (this.sentSubscription) 
      this.sentSubscription.unsubscribe();
  }

  getStats() {
    this.client.get('api/v1/wire/sums/receiver/' + this.channel.guid + '/money', { advanced: true })
      .then(({ sum, count, avg }) => {
        this.stats = {
          sum: sum,
          count: count,
          avg: avg,
          sent: this.stats.sent
        };
        this.detectChanges();
      });
    this.client.get('api/v1/wire/rewards/' + this.channel.guid)
      .then(({ sums }) => {
        this.stats.sent = sums.money;
        this.detectChanges();
      });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
