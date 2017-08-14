import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';


@Component({
  selector: 'm-wire-channel--overview',
  templateUrl: 'overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WireChannelOverviewComponent {

  ready: boolean = true;
  stats: { sum, count, avg, sent? } = {
    sum: 0,
    count: 0,
    avg: 0,
    sent: 0
  };

  @Input() channel: any;

  constructor(private client: Client, private session: Session, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.getStats();
  }

  getStats() {
    this.client.get('api/v1/wire/sums/receiver/' + this.channel.guid + '/money', { advanced: true })
      .then(({ sum, count, avg }) => {
        this.stats = {
          sum: sum,
          count: count,
          avg: avg
        };
        this.detectChanges();
      });
    this.client.get('api/v1/wire/rewards/' + this.channel.guid)
      .then(({ sums }) => {
        this.stats.sent = sums.points;
        this.detectChanges();
      });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
