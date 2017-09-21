import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'm-boost--marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BoostMarketingComponent implements OnInit {
  user = window.Minds.user;

  constructor() {
  }

  ngOnInit() {
  }
}
