import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../common/api/client.service';

@Component({
  selector: 'm-plus--marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class I18nMarketingComponent {

  user = window.Minds.user;

  constructor(private client: Client, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
