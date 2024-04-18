import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigsService } from '../../services/configs.service';
import { ThemeService } from '../../services/theme.service';

export type ErrorHeaderType = 'COULD_NOT_LOAD_PAGE' | 'SOMETHING_WENT_WRONG';
export type ErrorSubheaderType =
  | 'WE_HAVE_BEEN_NOTIFIED'
  | 'PLEASE_TRY_AGAIN_LATER';

const DEFAULT_HEADER_TYPE: ErrorHeaderType = 'COULD_NOT_LOAD_PAGE';
const DEFAULT_SUBHEADER_TYPE: ErrorSubheaderType = 'WE_HAVE_BEEN_NOTIFIED';

/**
 * Generic error splash - for the sake of i18n, to add a custom message
 * use the relevant switch cases in the template and extend the types above.
 */
@Component({
  selector: 'm-errorSplash',
  templateUrl: './error-splash.component.html',
  styleUrls: ['./error-splash.component.ng.scss'],
})
export class ErrorSplashComponent {
  /**
   * Header text for error splash.
   */
  private readonly _headerType$: BehaviorSubject<ErrorHeaderType> =
    new BehaviorSubject<ErrorHeaderType>(DEFAULT_HEADER_TYPE);

  /**
   * Subheader text for error splash.
   */
  private readonly _subheaderType$: BehaviorSubject<ErrorSubheaderType> =
    new BehaviorSubject<ErrorSubheaderType>(DEFAULT_SUBHEADER_TYPE);

  /**
   * Set to true on image load - helps prevent jumping flex content whilst loading.
   */
  public readonly imageLoaded$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * Assets URL.
   */
  public cdnAssetsUrl: string = '';

  /**
   * Sets header type observable to the header type passed in.
   * @param { ErrorHeaderType } - header type.
   */
  @Input() set headerType(headerType: ErrorHeaderType) {
    this._headerType$.next(headerType);
  }

  /**
   * Sets subheader type observable to the subheader type passed in.
   * @param { ErrorSubheaderType } - subheader type.
   */
  @Input() set subheaderType(text: ErrorSubheaderType) {
    this._subheaderType$.next(text);
  }

  /**
   * Get header type observable.
   * @returns { BehaviorSubject<ErrorHeaderType> } - header type observable.
   */
  get headerType$(): BehaviorSubject<ErrorHeaderType> {
    return this._headerType$;
  }

  /**
   * Get subheader type observable.
   * @returns { BehaviorSubject<ErrorSubheaderType> } - subheader type observable.
   */
  get subheaderType$(): BehaviorSubject<ErrorSubheaderType> {
    return this._subheaderType$;
  }

  /**
   * True if current theme is dark.
   * @returns { Observable<boolean> } - true if theme is dark, else false.
   */
  get isDarkTheme$(): Observable<boolean> {
    return this.themeService.isDark$;
  }

  /**
   * Logo URL - responsive to theme changes.
   * @returns { Observable<string> } - url of logo.
   */
  get logoUrl$(): Observable<string> {
    return this.isDarkTheme$.pipe(
      map((isDarkTheme: boolean) => {
        return `${this.cdnAssetsUrl}${
          !isDarkTheme
            ? 'assets/logos/logo-light-mode.svg'
            : 'assets/logos/logo-dark-mode.svg'
        }`;
      })
    );
  }
  constructor(
    private themeService: ThemeService,
    private router: Router,
    private route: ActivatedRoute,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  /**
   * Reloads the page using the router.
   * iemi111 @ https://stackoverflow.com/a/63059359/7396007
   * @returns { void }
   */
  public reload(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'], { relativeTo: this.route });
  }

  /**
   * Navigates to root url
   * @returns { void }
   */
  public navigateToRoot(): void {
    this.router.navigate(['/']);
  }
}
