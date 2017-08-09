import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Client } from "../../../services/api";

@Component({
  moduleId: module.id,
  selector: 'm-wire-console--ledger',
  templateUrl: 'ledger.component.html',
  providers: [
    CurrencyPipe
  ]
})
export class WireConsoleLedgerComponent {

  @Input() type : string = 'charge';

  wires: any[] = [];
  inProgress: boolean = false;

  offset: string = '';
  moreData: boolean = false;

  constructor(private client: Client, private currencyPipe: CurrencyPipe, private cd : ChangeDetectorRef, private route: ActivatedRoute) {
    route.url.subscribe(url => {
      this.type = url[0].path;
    });
  }

  ngOnInit() {
    this.loadList(true);
  }

  loadList(refresh = false): Promise<any> {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;

    if (refresh) {
      this.offset = '';
      this.moreData = true;
    }

    return this.client.get(`api/v1/wire/supporters`, {
        offset: this.offset,
        limit: 12,
        type: this.type
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

}
