import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FeaturesService } from '../../../services/features.service';
import { OnboardingV3Service } from '../../onboarding-v3/onboarding-v3.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigsService } from '../../../common/services/configs.service';
import { OnboardingV2Service } from '../../onboarding-v2/service/onboarding.service';

/**
 * Handles redirection after login and registration.
 */
@Injectable({ providedIn: 'root' })
export class RedirectHandlerService implements OnDestroy {
  // url to redirect to.
  private redirectTo: string;

  // subscription to route params.
  private paramsSubscription: Subscription;

  // URLs that redirect to /newsfeed/subscriptions
  private newsfeedRedirectUrls = ['', '/', '/register', '/login'];

  constructor(
    private features: FeaturesService,
    private onboardingV3: OnboardingV3Service,
    private onboardingV2: OnboardingV2Service,
    private route: ActivatedRoute,
    private configs: ConfigsService,
    private router: Router
  ) {
    this.redirectTo = localStorage.getItem('redirect');

    this.paramsSubscription = this.route.queryParams.subscribe(params => {
      if (params['redirectUrl']) {
        this.redirectTo = decodeURI(params['redirectUrl']);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  /**
   * Handle redirection.
   * @param { 'login' | 'register' } form - which form to handle redirection from.
   * @returns { void }
   */
  public handle(form: string = 'login'): void {
    if (form === 'register') {
      this.handleRegister();
    } else if (form === 'login') {
      this.handleLogin();
    } else {
      console.error('Unsupported form in registration redirect handler');
    }
  }

  /**
   * Handle register redirection.
   * @returns { void }
   */
  private handleRegister(): void {
    if (this.redirectTo) {
      this.navigateToRedirection();
      return;
    }

    if (this.features.has('onboarding-october-2020')) {
      try {
        this.onboardingV3.open(true); // fire off async

        if (this.isNewsfeedRedirectUrl(this.router.url)) {
          this.router.navigate(['/newsfeed/subscriptions']);
        }
        return;
      } catch (e) {
        if (e === 'DismissedModalException') {
          return; // modal dismissed, do nothing
        }
      }
    }

    if (this.features.has('ux-2020')) {
      if (this.onboardingV2.shouldShow()) {
        this.router.navigate(['/onboarding']);
        return;
      }
    }
  }

  /**
   * Handle login redirection.
   * @returns { void }
   */
  private handleLogin(): void {
    if (this.redirectTo) {
      this.navigateToRedirection();
      return;
    }

    if (this.isNewsfeedRedirectUrl(this.router.url)) {
      this.router.navigate(['/newsfeed/subscriptions']);
    }
  }

  /**
   * Navigation to redirection URL.
   * @returns { void }
   */
  private navigateToRedirection(): void {
    const uri = this.redirectTo.split('?', 2);
    const extras = {};

    if (uri[1]) {
      extras['queryParams'] = {};

      for (const queryParamString of uri[1].split('&')) {
        const queryParam = queryParamString.split('=');
        extras['queryParams'][queryParam[0]] = queryParam[1];
      }
    }

    // If this is an api redirect, we need to redirect outside of angular router
    if (uri[0].indexOf(this.configs.get('site_url') + 'api/') === 0) {
      window.location.href = this.redirectTo;
    } else {
      this.router.navigate([uri[0]], extras);
    }
  }

  /**
   * Whether or not the user should be redirected to newsfeed
   * @param { string } url - the url to check.
   * @returns { boolean } true if the user should be redirected.
   */
  private isNewsfeedRedirectUrl(url: string): boolean {
    const withoutQueryString = url.split('?')[0];
    return this.newsfeedRedirectUrls.indexOf(withoutQueryString) > -1;
  }
}
