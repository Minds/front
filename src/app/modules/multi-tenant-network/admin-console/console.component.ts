import { Component, OnInit } from '@angular/core';
import { MultiTenantNetworkConfigService } from '../services/config.service';
import {
  Observable,
  Subscription,
  filter,
  firstValueFrom,
  map,
  take,
} from 'rxjs';
import { MultiTenantConfig } from '../../../../graphql/generated.engine';
import {
  BootstrapProgressSocketService,
  BootstrapSocketEvent,
} from './services/bootstrap-progress-socket.service';
import { ContentGenerationCompletedModalService } from './components/content-generation-completed-modal/content-generation-completed-modal.service';
import { ActivatedRoute } from '@angular/router';
import { BootstrapProgressService } from './services/bootstrap-progress.service';

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

  /** Subscription to bootstrap progress socket events. */
  private bootstrapProgressEventSubscription: Subscription;

  constructor(
    private multiTenantConfigService: MultiTenantNetworkConfigService,
    private bootstrapProgressService: BootstrapProgressService,
    private bootstrapProgressSocketService: BootstrapProgressSocketService,
    private contentGenerationCompletedModalService: ContentGenerationCompletedModalService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.queryParams?.['awaitContentGeneration']) {
      this.awaitContentGeneration();
    }
    this.multiTenantConfigService.fetchConfig();
  }

  ngOnDestroy() {
    if (this.bootstrapProgressSocketService.isJoined) {
      this.teardownBootstrapProgressSocketListener();
    }
  }

  /**
   * Setup bootstrap progress socket listener.
   * @returns { Promise<void> }
   */
  private async awaitContentGeneration(): Promise<void> {
    if (
      await firstValueFrom(
        this.bootstrapProgressService.hasAlreadyCompletedStep('CONTENT_STEP')
      )
    ) {
      // already completed - no need to set up socket subscription.
      this.contentGenerationCompletedModalService.open();
    } else {
      // await completion event from socket subscription.
      this.bootstrapProgressEventSubscription =
        this.bootstrapProgressSocketService.event$
          .pipe(
            filter((event: BootstrapSocketEvent): boolean => {
              return event.step === 'CONTENT_STEP' && event.completed;
            }),
            take(1)
          )
          .subscribe((event: BootstrapSocketEvent): void => {
            this.contentGenerationCompletedModalService.open();
            this.teardownBootstrapProgressSocketListener();
          });

      this.bootstrapProgressSocketService.listen();
    }
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

  /**
   * Teardown bootstrap progress socket listener.
   * @returns { void }
   */
  private teardownBootstrapProgressSocketListener(): void {
    this.bootstrapProgressEventSubscription?.unsubscribe();
    this.bootstrapProgressSocketService.leave();
  }
}
