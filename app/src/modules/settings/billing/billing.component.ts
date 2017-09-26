import { Component } from '@angular/core';

import { Client } from '../../../common/api/client.service';


@Component({
  selector: 'm-settings--billing',
  templateUrl: 'billing.component.html'
})

export class SettingsBillingComponent {

  constructor(private client: Client) {

  }

}
