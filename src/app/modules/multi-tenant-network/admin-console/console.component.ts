import { Component, OnInit } from '@angular/core';
import { MultiTenantNetworkConfigService } from '../services/config.service';
import { Observable, Subscription, map, take } from 'rxjs';
import { MultiTenantConfig } from '../../../../graphql/generated.engine';
import { ContentGenerationCompletedSocketService } from './services/content-generation-completed-socket';
import { ContentGenerationCompletedModalService } from './components/content-generation-completed-modal/content-generation-completed-modal.service';
import { ActivatedRoute } from '@angular/router';

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
  public configLoaded$: Observable<boolean> =
    this.multiTenantConfigService.configLoaded$;

  /** Title for console. */
  public title$: Observable<string> =
    this.multiTenantConfigService.config$.pipe(
      map((config: MultiTenantConfig): string => {
        return config?.siteName
          ? this.formatTitle(config.siteName)
          : 'Your Network';
      })
    );

  /** Subscription to content generation completed socket. */
  private contentGenerationCompletedSubscription: Subscription;

  constructor(
    private multiTenantConfigService: MultiTenantNetworkConfigService,
    private contentGenerationCompletedSocketService: ContentGenerationCompletedSocketService,
    private contentGenerationCompletedModalService: ContentGenerationCompletedModalService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.queryParams?.['awaitContentGeneration']) {
      this.setupContentGenerationCompletedSocketListener();
    }
    this.multiTenantConfigService.fetchConfig();
  }

  ngOnDestroy() {
    if (!this.contentGenerationCompletedSocketService) {
      return;
    }

    this.contentGenerationCompletedSubscription?.unsubscribe();
    this.contentGenerationCompletedSocketService.leave();
  }

  /**
   * Setup content generation completed socket listener.
   * @returns { void }
   */
  private setupContentGenerationCompletedSocketListener(): void {
    this.contentGenerationCompletedSubscription =
      this.contentGenerationCompletedSocketService.contentGenerationCompleted$
        .pipe(take(1))
        .subscribe((value: boolean) => {
          this.contentGenerationCompletedModalService.open();
        });

    this.contentGenerationCompletedSocketService.listen();
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
