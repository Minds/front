import { Component, Input } from '@angular/core';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';


@Component({
  selector: 'm-wire-console',
  templateUrl: 'console.component.html'
})

export class WireConsoleComponent {

  ready: boolean = true;
  stats: { sum, count, avg } = {
    sum: 0,
    count: 0,
    avg: 0
  };

  showOptions: boolean = false;

  constructor(private client: Client, private session: Session) { }

  ngOnInit() {
    this.getStats();
  }

  getStats() {
    this.client.get('api/v1/wire/sums/receiver/' + this.session.getLoggedInUser().guid + '/money', { advanced: true })
      .then(({ sum, count, avg }) => {
        this.stats = {
          sum: sum,
          count: count,
          avg: avg
        };
      });
  }

}
