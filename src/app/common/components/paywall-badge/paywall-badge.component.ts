import { Component, Input, OnInit } from '@angular/core';
import { PaywallType } from '../../../modules/wire/lock-screen/wire-lock-screen.component';

@Component({
  selector: 'm-paywallBadge',
  templateUrl: './paywall-badge.component.html',
})
export class PaywallBadgeComponent implements OnInit {
  @Input() entity: any;

  hasPaywall: boolean = false;
  paywallType: PaywallType = 'custom';
  init: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (!this.entity) {
      return;
    }

    if (this.entity.remind_object) {
      this.entity = this.entity.remind_object;
    }

    this.hasPaywall = !!this.entity.paywall || this.entity.paywall_unlocked;

    if (this.hasPaywall) {
      // TODO determine the paywall type here
    }

    this.init = true;
  }
}
