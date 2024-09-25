import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarNavigationService } from '../../../../../common/layout/sidebar/navigation.service';
import { PageLayoutService } from '../../../../../common/layout/page-layout.service';
import { TopbarService } from '../../../../../common/layout/topbar.service';
import { BootstrapProgressSplashService } from './bootstrap-progress-splash.service';
import { distinctUntilChanged, Observable, shareReplay } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { CommonModule } from '../../../../../common/common.module';
import { NewTenantWelcomeVideoComponent } from '../new-tenant-welcome-video/new-tenant-welcome-video.component';

/**
 * Splash screen to hold a tenant creator during bootstrapping process.
 */
@Component({
  selector: 'm-tenantBootstrapProgressSplash',
  templateUrl: './bootstrap-progress-splash.component.html',
  styleUrls: ['./bootstrap-progress-splash.component.ng.scss'],
  standalone: true,
  imports: [AsyncPipe, NgIf, CommonModule, NewTenantWelcomeVideoComponent],
})
export class MultiTenantBootstrapProgressSplashComponent
  implements OnInit, OnDestroy
{
  /** The loading text for the currently in progress step. */
  protected readonly currentStepLoadingLabel$: Observable<string> =
    this.bootstrapProgressSplashService.currentStepLoadingLabel$.pipe(
      distinctUntilChanged(),
      shareReplay()
    );

  /**
   * Whether the bootstrapping process can be considered completed and the user can progress.
   * This does not neccesarily indicate that all steps are completed, just that at minimum,
   * the steps that a user is being held here to wait for completion of are.
   */
  protected readonly completed$: Observable<boolean> =
    this.bootstrapProgressSplashService.completed$;

  constructor(
    private readonly bootstrapProgressSplashService: BootstrapProgressSplashService,
    private readonly navigationService: SidebarNavigationService,
    private readonly pageLayoutService: PageLayoutService,
    private readonly topbarService: TopbarService
  ) {}

  ngOnInit() {
    this.navigationService.setVisible(false);

    this.topbarService.toggleVisibility(false);

    this.pageLayoutService.useFullWidth();
    this.pageLayoutService.removeTopbarBackground();
    this.pageLayoutService.removeTopbarBorder();

    this.bootstrapProgressSplashService.startPolling();
  }

  ngOnDestroy() {
    this.bootstrapProgressSplashService.stopPolling();
  }

  /**
   * Start polling for progress updates.
   * @returns { void }
   */
  public startPolling(): void {
    this.bootstrapProgressSplashService.startPolling();
  }

  /**
   * Stop polling for progress updates.
   * @returns { void }
   */
  public stopPolling(): void {
    this.bootstrapProgressSplashService.stopPolling();
  }

  /**
   * Handle navigate to network click.
   * @returns { void }
   */
  public onNavigateToNetworkClick(): void {
    this.bootstrapProgressSplashService.redirectToNetwork();
  }
}
