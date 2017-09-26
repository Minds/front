import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'm-wire-console--supporter',
  templateUrl: 'supporter.component.html',
  providers: [
    CurrencyPipe
  ]
})
export class WireConsoleSupporterComponent {

  @Input() guid: string;
  @Input() supporter;

  @Input() reverse: boolean = false;

  @Input() method: string = 'money';

  sum: number = 0;
  inProgress: boolean = false;

  constructor(
    private client: Client,
    private currencyPipe: CurrencyPipe,
    private cd: ChangeDetectorRef,
    private session: Session,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.load();
  }

  load() {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;

    let endpoint = this.reverse ?
      `api/v1/wire/sums/sender/${this.session.getLoggedInUser().guid}/${this.method}/${this.guid}` :
      `api/v1/wire/sums/sender/${this.guid}/${this.method}/${this.session.getLoggedInUser().guid}`;

    this.client.get(endpoint, {})
      .then(({ sum }) => {
        this.inProgress = false;

        this.sum = sum;

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
