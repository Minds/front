import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { FormToastService } from './form-toast.service';

import isMobileOrTablet from '../../helpers/is-mobile-or-tablet';
import hasTouchScreen from '../../helpers/is-mobile-or-tablet';
import isAndroid from '../../helpers/is-mobile-or-tablet';
import isIos from '../../helpers/is-mobile-or-tablet';

/**
 * Dismissed or active to make use of animations.
 */
export type AppPromptState = 'dismissed' | 'active';

/**
 * A supported mobile platform with our app, or non-mobile.
 */
export type MobilePlatform = 'android' | 'iphone' | 'non-mobile';

/**
 * Service for interacting with the mobile app prompt.
 */
@Injectable({ providedIn: 'root' })
export class AppPromptService implements OnDestroy {
  private subscriptions: Subscription[] = [];

  /**
   * Current state of modal
   */
  public readonly state$: BehaviorSubject<AppPromptState> = new BehaviorSubject<
    AppPromptState
  >('dismissed');

  /**
   * Current user platform (defaults to non-mobile until after init)
   */
  public readonly platform$: BehaviorSubject<
    MobilePlatform
  > = new BehaviorSubject<MobilePlatform>('non-mobile');

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private toaster: FormToastService
  ) {}

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Open the prompt.
   * @returns { AppPromptService } - chain-able.
   */
  public open(): AppPromptService {
    this.state$.next('active');
    return this;
  }

  /**
   * Close the prompt.
   * @returns { AppPromptService } - chain-able.
   */
  public close(): AppPromptService {
    this.state$.next('dismissed');
    return this;
  }

  /**
   * Checks whether device is touch screen, then user agent.
   * @returns { boolean } true if platform has app available.
   */
  public hasAvailableApp(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      if (hasTouchScreen()) {
        return isMobileOrTablet();
      }
      return false;
    }
  }

  /**
   * Sets platform to iphone or android
   * @returns { void }
   */
  public setPlatform(): void {
    if (isIos()) {
      this.platform$.next('iphone');
    }
    if (isAndroid()) {
      this.platform$.next('android');
    }
  }

  /**
   * Redirect to app or app store depending on platform and
   * whether app is installed already. Based upon solution from Vikas Kohli.
   * https://imvikaskohli.medium.com/how-to-do-deep-linking-to-app-from-website-c2ecbf345dd5
   * @returns { void }
   */
  public redirect(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.subscriptions.push(
        this.platform$
          .pipe(
            take(1),
            catchError(e => this.handleError(e))
          )
          .subscribe((platform: MobilePlatform) => {
            try {
              switch (platform) {
                case 'iphone':
                  setTimeout(function() {
                    window.location.href =
                      'https://itunes.apple.com/us/app/minds-com/id961771928';
                  }, 25);
                  window.location.href = 'mindsapp://'; //which page to open(now from mobile, check its authorization)
                  break;
                case 'android':
                  window.location.replace('mindsapp://'); //which page to open(now from mobile, check its authorization)
                  setTimeout(
                    (window.location.href =
                      'https://play.google.com/store/apps/details?id=com.minds.mobile'),
                    500
                  );
                  break;
                default:
                  this.state$.next('dismissed');
                  break;
              }
            } catch (e) {
              this.handleError(e);
            }
          })
      );
    }
  }

  /**
   * Handles error.
   * @param - error object.
   * @returns { Observable<null> }
   */
  private handleError(e: Observable<null>) {
    console.error(e);
    this.state$.next('dismissed');
    this.toaster.error(
      'Sorry, we were unable to open the mobile app or store right now'
    );
    return of(null);
  }
}
