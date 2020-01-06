import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'm-walletSettings--eth',
  templateUrl: './settings-eth.component.html',
})
export class WalletSettingsETHComponent implements OnInit {
  @Output() showTokenSettings: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  scrollToSettings() {
    const settingsEl = document.getElementById('tokenSettings');
    if (!settingsEl) {
      this.showTokenSettings.emit();
    }

    setTimeout(
      () =>
        document.getElementById('dashboardViewsTabs').scrollIntoView({
          behavior: 'smooth',
        }),
      0
    );
  }
}
