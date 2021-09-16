import { isPlatformBrowser } from '@angular/common';
import {
  Inject,
  Injectable,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { FormToastService } from './form-toast.service';

import isMobileOrTablet from '../../helpers/is-mobile-or-tablet';

/**
 * Dismissed or active to make use of animations.
 */
export type AppPromptState = 'dismissed' | 'active' | 'expanded';

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

  ngOnInit(): void {
    if (this.hasAvailableApp()) {
      this.setPlatform();
      this.activate();
    }
  }

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
  public activate(): AppPromptService {
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
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    return isMobileOrTablet();
  }

  /**
   * Sets platform to iphone or android
   * @returns { void }
   */
  public setPlatform(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (/iPad|iPhone|iPod/i.test(navigator.userAgent)) {
      this.platform$.next('iphone');
      return;
    }
    if (/android/i.test(navigator.userAgent)) {
      this.platform$.next('android');
    }
  }

  // opens the app and if the app wasn't opened calls the fallback function
  private openAppWithFallback(fallback: () => void) {
    this.watchUserPresence(() => {
      this.activate();
    });

    if (this.platform$.getValue() === 'iphone') {
      // https://stackoverflow.com/questions/13044805/how-can-i-check-if-an-app-is-installed-from-a-web-page-on-an-iphone
      var now = new Date().valueOf();
      setTimeout(function() {
        if (new Date().valueOf() - now < 25) {
          fallback();
        }
      }, 25);
    } else {
      // delay the fallback to let the animations of the
      // platform finish
      setTimeout(() => {
        fallback();
      }, 1000);
    }

    // attempt to open the app
    (window as any).location = 'mindsapp://';
  }

  // Opens app store
  private openAppStore() {
    (window as any).location =
      'https://itunes.apple.com/us/app/minds-com/id961771928';
  }

  private lastDateNow: number;

  /**
   * a timer to run every 500ms.
   *
   * this is a hack to detect whether the user has left the
   * browser or not. This works because when the user leaves
   * the browser the timeouts will be freezed and therefore
   * the diff of `Date.now()` with the last `Date.now()` will
   * be larger than the timer's duration
   *
   * @returns { void }
   */
  watchUserPresence(cb: () => void): void {
    // stop running if the prompt was dismissed
    if (this.state$.getValue() === 'dismissed') return;

    // stop running and shrink if the the user has been
    // away for more than timeout's duration
    if (this.lastDateNow && Date.now() - this.lastDateNow > 1000) {
      this.lastDateNow = undefined;
      return cb();
    }

    this.lastDateNow = Date.now();

    setTimeout(() => this.watchUserPresence(cb), 500);
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
                  this.openAppWithFallback(() => this.openAppStore());
                  break;
                case 'android':
                  this.openAppWithFallback(() => this.expand());
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
   * Expand the modal to show download options
   * @returns { void }
   */
  public expand(): void {
    this.state$.next('expanded');
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
