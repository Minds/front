import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';


@Component({
  selector: 'm-wire-console',
  templateUrl: 'console.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WireConsoleComponent {

  ready: boolean = true;
  stats: { sum, count, avg } = {
    sum: 0,
    count: 0,
    avg: 0
  };

  showOptions: boolean = false;

  startDate: string;

  constructor(private client: Client, private session: Session, private cd: ChangeDetectorRef) {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    this.startDate = d.toISOString();
  }

  ngOnInit() {
    this.getStats();
  }

  getStats() {
    this.client.get('api/v1/wire/sums/receiver/' + this.session.getLoggedInUser().guid + '/money',
      {
        advanced: true,
        start: Date.parse(this.startDate) / 1000
      })
      .then(({ sum, count, avg }) => {
        this.stats = {
          sum: sum,
          count: count,
          avg: avg
        };
        this.detectChanges();
      });
  }

  onStartDateChange(newDate) {
    this.startDate = newDate;
    this.detectChanges();
    this.getStats();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
