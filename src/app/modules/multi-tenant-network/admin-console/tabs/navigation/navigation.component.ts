import { Component, OnInit } from '@angular/core';
import { MultiTenantNavigationService } from './services/navigation.service';

@Component({
  selector: 'm-networkAdminConsole__navigation',
  templateUrl: './navigation.component.html',
  styleUrls: [
    './navigation.component.ng.scss',
    '../../stylesheets/console.component.ng.scss',
  ],
})
export class NetworkAdminConsoleNavigationComponent implements OnInit {
  constructor(protected service: MultiTenantNavigationService) {}

  ngOnInit() {
    /**
     * Initialize navigation items to be used by children
     */
    this.service.fetchNavigationItems(false);
  }
}
