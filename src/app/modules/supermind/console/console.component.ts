import { Component, OnDestroy } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  UrlSegment,
} from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  filter,
  switchMap,
} from 'rxjs';
import { SupermindOnboardingModalService } from '../onboarding-modal/onboarding-modal.service';
import { SupermindConsoleListType } from '../supermind.types';
import { SupermindConsoleService } from './services/console.service';

/**
 * Supermind console component. Contains router outlet to display sub-routes like the inbox and outbox list.
 */
@Component({
  selector: 'm-supermind__console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.ng.scss'],
})
export class SupermindConsoleComponent implements OnDestroy {
  /** @type { Subscription } routeSubscription - subscription to ActivatedRoutes firstChild.url */
  private routeSubscription: Subscription;

  /** @type { BehaviorSubject<SupermindConsoleListType> } listType$ - list type from service. */
  public readonly listType$: BehaviorSubject<SupermindConsoleListType> = this
    .service.listType$;

  /** @type { Observable<boolean> } isSingleSupermindPage$ - Whether this is a single Supermind page. */
  public readonly isSingleSupermindPage$: Observable<boolean> = this.service
    .isSingleSupermindPage$;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: SupermindConsoleService,
    private supermindOnboardingModal: SupermindOnboardingModalService
  ) {
    // listen to router events. If outside of constructor will miss initial navigation event.
    this.routeSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        // switchMap into the first child.
        switchMap((_: unknown) => this.route.firstChild.url)
      )
      .subscribe((url: UrlSegment[]): void => {
        const param = url[0].path ?? null;

        if (param === 'inbox') {
          // Launch onboarding modal (if user hasn't seen it yet)
          this.supermindOnboardingModal.setContentType('reply');
          if (!this.supermindOnboardingModal.hasBeenSeenAlready()) {
            this.openSupermindOnboardingModal();
          }
        }

        if (
          param === 'inbox' ||
          param === 'outbox' ||
          param === 'explore' ||
          this.service.isNumericListType(param)
        ) {
          this.listType$.next(param);
          return;
        }

        this.listType$.next('explore');
      });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  /**
   * Called on settings button click - navigates to settings page.
   * @param { MouseEvent } $event - click event.
   * @returns { void }
   */
  public onSettingsButtonClick($event: MouseEvent): void {
    this.router.navigate(['/settings/payments/supermind']);
  }

  /**
   * On back button click.
   * @returns { void }
   */
  public onBackClick(): void {
    this.router.navigate(['/supermind/inbox']);
  }

  async openSupermindOnboardingModal() {
    await this.supermindOnboardingModal.open();
  }
}
