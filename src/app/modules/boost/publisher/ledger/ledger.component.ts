import { Component, Input } from '@angular/core';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { BoostConsoleFilter } from '../../console/console.component';

@Component({
  selector: 'm-boost-publisher--ledger',
  templateUrl: 'ledger.component.html',
})
export class BoostPublisherLedgerComponent {
  _filter: BoostConsoleFilter;

  startDate: string;
  endDate: string;
  inProgress: boolean = false;
  rows: Array<any> = [];

  constructor(private client: Client, public session: Session) {}

  ngOnInit() {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    this.startDate = d.toISOString();

    d.setMonth(d.getMonth() + 1);
    this.endDate = d.toISOString();
  }

  loadList(refresh: boolean) {}

  onStartDateChange(newDate) {
    this.startDate = newDate;
    this.loadList(true);
  }

  onEndDateChange(newDate) {
    this.endDate = newDate;
    this.loadList(true);
  }
}
