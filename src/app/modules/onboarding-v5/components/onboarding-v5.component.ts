import {
  Component,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { OnboardingV5Service } from '../services/onboarding-v5.service';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { CarouselItem } from '../../../common/components/feature-carousel/feature-carousel.component';
import { OnboardingStep } from '../types/onboarding-v5.types';
import { isIos } from '../../../helpers/is-mobile-or-tablet';
import isMobile from '../../../helpers/is-mobile';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';
import { MultiTenantConfigImageService } from '../../multi-tenant-network/services/config-image.service';
import { OnboardingV5MinimalModeService } from '../services/onboarding-v5-minimal-mode.service';

/**
 * Onboarding V5 component. Acts as a root container that handles the layout and internal
 * component display of the modal.
 */
@Component({
  selector: 'm-onboardingV5',
  templateUrl: './onboarding-v5.component.html',
  styleUrls: [
    'onboarding-v5.component.ng.scss',
    '../../../../stylesheets/two-column-layout.ng.scss',
  ],
})
export class OnboardingV5Component implements OnInit, OnDestroy {
  /** Whether fetching of steps is in progress. */
  public stepFetchInProgress$: Observable<boolean> =
    this.service.stepFetchInProgress$;

  /** Carousel items to be displayed. */
  public readonly carouselItems$: Observable<CarouselItem[]> =
    this.service.activeStepCarouselItems$;

  /** Currently active step. */
  public readonly activeStep$: Observable<OnboardingStep> =
    this.service.activeStep$;

  /**
   * Whether onboarding is in a completed state - used to show completion panel
   * before modal dismissal.
   */
  public readonly onboardingCompleted$: Observable<boolean> =
    this.service.onboardingCompleted$;

  /** Tenant logo path for display instead of the carousel on tenant networks. */
  public readonly tenantLogoPath$: Observable<string> =
    this.tenantConfigImageService.horizontalLogoPath$;

  /** Subscription to popstate. */
  private popStateSubscription: Subscription;

  /** Whether onboarding is in minimal mode. */
  public isOnboardingMinimalMode: boolean = false;

  @HostBinding('class.m-onboardingV5--isIosMobile')
  isIosMobile: boolean = false;

  constructor(
    private service: OnboardingV5Service,
    private tenantConfigImageService: MultiTenantConfigImageService,
    private onboardingMinimalModeService: OnboardingV5MinimalModeService,
    @Inject(IS_TENANT_NETWORK) public readonly isTenantNetwork: boolean
  ) {}

  ngOnInit(): void {
    this.isIosMobile = isIos() && isMobile();
    this.service.start();
    this.isOnboardingMinimalMode =
      this.onboardingMinimalModeService.shouldShow();
    this.disableBackNavigation();
  }

  ngOnDestroy(): void {
    this.popStateSubscription?.unsubscribe();
  }

  /**
   * Disable back navigation by pushing a new null state to the history stack and
   * intercepting occurring popstate events, overwriting their action.
   * @returns { void }
   */
  private disableBackNavigation(): void {
    history.pushState(null, null, location.href);

    // prevent back button navigation.
    this.popStateSubscription = fromEvent(window, 'popstate').subscribe(
      (_: unknown): void => {
        history.pushState(null, null, location.href);
      }
    );
  }
}
