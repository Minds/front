import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { ToasterService } from '../../common/services/toaster.service';
import isMobileOrTablet from '../../helpers/is-mobile-or-tablet';
import { Storage } from '../../services/storage';

/**
 * Dismissed or active to make use of animations.
 */
export type AppPromptState = 'dismissed' | 'active' | 'expanded';

/**
 * A supported mobile platform with our app, or non-mobile.
 */
export type MobilePlatform = 'android' | 'iphone' | 'non-mobile';

const STORAGE_KEY = 'app-prompt:dismissed';

let lastDateNow;

/**
 * navigates to the same screen in the app
 */
function navigateDeepIntoApp() {
  // attempt to open the app
  (window as any).location =
    'mindsapp://' +
    // extracts 'channel/00000000000000' from 'https://minds.com/channel/00000000000000'
    (window as any).location.href
      .split('//')[1]
      .split('/')
      .filter((item, i) => i !== 0)
      .join('/');
}

function watchIOS(cb) {
  if (lastDateNow) {
    if (Date.now() - lastDateNow > 50) {
      return;
    }

    lastDateNow = undefined;
    return cb();
  }

  lastDateNow = Date.now();

  setTimeout(() => watchIOS(cb), 25);
}

function openIOS() {
  watchIOS(() => {
    (window as any).location =
      'https://itunes.apple.com/us/app/minds-com/id961771928';
    setTimeout(() => window.location.reload(), 1000);
  });

  navigateDeepIntoApp();
}

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
    private storage: Storage,
    private toaster: ToasterService
  ) {}

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * whether the prompt has to be shown
   * @return { boolean }
   */
  shouldShowPrompt(): boolean {
    if (!this.hasAvailableApp()) return false;
    if (!this.storage.get(STORAGE_KEY)) return true;

    // if app was dismissed more than 24 hours ago, remove the key and return true
    if (
      Date.now() - Number(this.storage.get(STORAGE_KEY)) >
      24 * 60 * 60 * 1000 // 24 hours in milliseconds
    ) {
      this.storage.destroy(STORAGE_KEY);
      return true;
    }

    return false;
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
    this.storage.set(STORAGE_KEY, String(Date.now()));
    return this;
  }

  /**
   * Dismisses the prompt but doesn't save anything to storage
   * @returns { AppPromptService } - chain-able.
   */
  public dismiss(): AppPromptService {
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
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    if (this.platform$.getValue() === 'iphone') {
      this.watchIfAppWasntOpened(() => {
        fallback();
      });
    } else {
      this.watchUserPresence(() => {
        this.activate();
      });

      // delay the fallback to let the animations of the
      // platform finish
      setTimeout(() => {
        fallback();
      }, 1000);
    }

    // attempt to open the app
    navigateDeepIntoApp();
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

  // EXPERIMENT
  onceCalled = false;

  /**
   * a timer to run every 25ms.
   *
   * this is a hack to detect whether the app was opened or not.
   * if the app wasn't opened, call the fallback. If the app was
   * opened, don't call the fallback.
   *
   * @returns { void }
   */
  watchIfAppWasntOpened(cb: () => void): void {
    // stop running if the prompt was dismissed
    if (this.state$.getValue() === 'dismissed') return;

    if (this.lastDateNow) {
      if (Date.now() - this.lastDateNow > 50) {
        return;
      }

      if (!this.onceCalled) {
        this.onceCalled = true;
        return;
      }

      this.lastDateNow = undefined;
      return cb();
    }

    this.lastDateNow = Date.now();

    setTimeout(() => this.watchIfAppWasntOpened(cb), 25);
  }

  /**
   * Redirect to app or app store depending on platform and
   * whether app is installed already. Based upon solution from Vikas Kohli.
   * https://imvikaskohli.medium.com/how-to-do-deep-linking-to-app-from-website-c2ecbf345dd5
   * @returns { void }
   */
  public redirect(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.platform$.getValue() === 'iphone') {
        return openIOS();
      }

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
                  this.openAppWithFallback(() => {
                    this.openAppStore();
                    // reload the page after launching appstore
                    // to make the error dialog disappears
                    setTimeout(() => window.location.reload(), 1000);
                  });
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
