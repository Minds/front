import { Component, OnInit } from '@angular/core';
import { MultiTenantNetworkConfigService } from '../services/config.service';
import { Observable, map } from 'rxjs';
import { MultiTenantConfig } from '../../../../graphql/generated.engine';

/**
 * Multi-tenant network admin console.
 * Allows for configuration of a mutli-tenant network.
 */
@Component({
  selector: 'm-networkAdminConsole',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.ng.scss'],
})
export class NetworkAdminConsoleComponent implements OnInit {
  /** Whether config has been loaded. */
  public configLoaded$: Observable<boolean> = this.multiTenantConfigService
    .configLoaded$;

  /** Title for console. */
  public title$: Observable<
    string
  > = this.multiTenantConfigService.config$.pipe(
    map((config: MultiTenantConfig): string => {
      return config?.siteName
        ? this.formatTitle(config.siteName)
        : 'Your Network';
    })
  );

  constructor(
    private multiTenantConfigService: MultiTenantNetworkConfigService
  ) {}

  ngOnInit(): void {
    this.multiTenantConfigService.fetchConfig();
  }

  /**
   * Format title for console, pluralising names.
   * @param { string } siteName - Name of site.
   * @returns { string } Formatted title.
   */
  private formatTitle(siteName: string): string {
    return siteName.slice(-1) === 's'
      ? `${siteName}' Network`
      : `${siteName}'s Network`;
  }
}
