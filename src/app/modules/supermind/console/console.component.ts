import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { LoginReferrerService } from '../../../services/login-referrer.service';
import { Session } from '../../../services/session';
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
export class SupermindConsoleComponent implements OnInit, OnDestroy {
  /** @type { Subscription } routeSubscription - subscription to ActivatedRoutes firstChild.url */
  private routeSubscription: Subscription;

  /** @type { BehaviorSubject<SupermindConsoleListType> } listType$ - list type from service. */
  public readonly listType$: BehaviorSubject<SupermindConsoleListType> = this
    .service.listType$;

  /** @type { Observable<boolean> } isSingleSupermindPage$ - Whether this is a single Supermind page. */
  public readonly isSingleSupermindPage$: Observable<boolean> = this.service
    .isSingleSupermindPage$;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: SupermindConsoleService,
    private supermindOnboardingModal: SupermindOnboardingModalService,
    private session: Session,
    private loginReferrer: LoginReferrerService,
    private location: Location
  ) {}

  ngOnInit(): void {
    if (!this.session.isLoggedIn()) {
      this.loginReferrer.register(this.location.path());
      this.router.navigate(['/login']);
    }

    // on route change, set list type.
    this.routeSubscription = this.route.firstChild.url.subscribe(segments => {
      const param: string = segments[0].path;

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
        this.service.isNumericListType(param)
      ) {
        this.listType$.next(param);
        return;
      }
      this.listType$.next('inbox');
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
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
