import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'm-wallet-token--101',
  templateUrl: '101.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletToken101Component {

  constructor(
  ) {

  }

  ngOnInit() {

  }

}
