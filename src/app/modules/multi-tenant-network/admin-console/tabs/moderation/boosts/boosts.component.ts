import { Component, OnInit } from '@angular/core';
import { BoostConsoleService } from '../../../../../boost/console-v2/services/console.service';

/**
 * Network admin console boost approval queue.
 */
@Component({
  selector: 'm-networkAdminConsole__boosts',
  styleUrls: ['./boosts.component.ng.scss'],
  template: `
    <m-boostConsole__list [showFilterBar]="false"></m-boostConsole__list>
  `,
})
export class NetworkAdminConsoleBoostsComponent implements OnInit {
  constructor(private boostConsoleService: BoostConsoleService) {}

  ngOnInit(): void {
    this.boostConsoleService.adminContext$.next(true);
  }
}
