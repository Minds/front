import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'm-wire-console--ledger',
  templateUrl: 'ledger.component.html',
  providers: [
    CurrencyPipe
  ]
})
export class WireConsoleLedgerComponent {

  @Input() type: string;
  @Input() method: string;
  wires: any[] = [];
  inProgress: boolean = false;

  offset: string = '';
  moreData: boolean = false;
  startDate: string;

  constructor(private client: Client, private currencyPipe: CurrencyPipe, private cd: ChangeDetectorRef) {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    this.startDate = d.toISOString();
  }

  ngOnInit() {
    if (!this.type) {
      this.type = 'sent';

      if (window.Minds.user.merchant && window.Minds.user.merchant.exclusive) {
        this.type = 'received';
      }
    }

    if (!this.method) {
      this.method = 'points';

      if (window.Minds.user.merchant) {
        this.method = 'money';
      } else if (window.Minds.user.eth_wallet) {
          this.method = 'tokens';
      }
    }

    this.loadList(true);
  }

  setType(type: string) {
    this.type = type;
    this.loadList(true);
  }

  setMethod(method: string) {
    this.method = method;
    this.loadList(true);
  }

  loadList(refresh = false): Promise<any> {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;

    if (refresh) {
      this.wires = [];
      this.offset = '';
      this.moreData = true;
    }

    return this.client.get(`api/v1/wire/supporters`, {
      offset: this.offset,
      limit: 12,
      type: this.type,
      method: this.method,
      start: Date.parse(this.startDate) / 1000
    })
      .then(({ wires, 'load-next': loadNext }) => {
        this.inProgress = false;

        if (wires) {
          this.wires.push(...wires);
        }

        if (loadNext) {
          this.offset = loadNext;
        } else {
          this.moreData = false;
        }

        this.cd.markForCheck();
        this.cd.detectChanges();
      })
      .catch(e => {
        this.inProgress = false;
        this.cd.markForCheck();
        this.cd.detectChanges();
        //this.error = e.message || 'Server error';
      });
  }

  expand(i: number) {
    this.wires[ i ].expanded = !this.wires[ i ].expanded;
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  onStartDateChange(newDate) {
    this.startDate = newDate;

    this.inProgress = false;
    this.cd.markForCheck();
    this.cd.detectChanges();

    this.loadList(true);
  }

  canSelectMethod() {
    return !!window.Minds.user.merchant;
  }

}
