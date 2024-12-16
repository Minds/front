import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from '../../common/services/cookie.service';
import { ApiService } from '../../common/api/api.service';
import { Session } from '../../services/session';
import { ConfigsService } from '../../common/services/configs.service';
import * as moment from 'moment';

/**
 * Language list entry structure
 */
export interface LanguageListEntry {
  code: string;
  name: string;
}

const isoCodeToLanguageName = ([languages, currentLanguage]) =>
  languages.find((language) => language.code === currentLanguage).name;

const POPULAR_LANGUAGE_CODES = ['en', 'es', 'de', 'fr', 'th', 'it'];

/**
 * Language service
 */
@Injectable()
export class LanguageService {
  /**
   * Current language selected by user
   */
  readonly currentLanguage$: BehaviorSubject<string> =
    new BehaviorSubject<string>('en');

  /**
   * Browser's language
   */
  readonly browserLanguage$: Observable<string> = of(
    (navigator as any).language || (navigator as any).userLanguage
  ).pipe(
    map<string, string>((language) =>
      (language || 'en').slice(0, 2).toLowerCase()
    )
  );

  /**
   * List of all languages, weighted by current, browser and site default (English)
   */
  readonly languages$: Observable<Array<LanguageListEntry>> = combineLatest([
    of(this.configs.get<Object>('languages')).pipe(
      map((languages) => {
        const arr = [];
        for (const code in languages) {
          if (languages.hasOwnProperty(code)) {
            arr.push({
              code,
              name: languages[code],
            });
          }
        }
        return arr;
      })
    ),
    this.currentLanguage$,
    this.browserLanguage$,
  ]).pipe(
    map(([languages, current, browser]) =>
      this.sortLanguageList(languages, current, browser)
    )
  );

  /**
   * Current's language native name
   */
  readonly currentLanguageName$: Observable<string> = combineLatest([
    this.languages$,
    this.currentLanguage$,
  ]).pipe(
    map(isoCodeToLanguageName),
    catchError(() => 'Unknown')
  );

  /**
   * Browser's language native name
   */
  readonly browserLanguageName$: Observable<string> = combineLatest([
    this.languages$,
    this.browserLanguage$,
  ]).pipe(
    map(isoCodeToLanguageName),
    catchError(() => 'Unknown')
  );

  /**
   * Constructor. Sets current language.
   * @param cookie
   * @param api
   * @param session
   * @param configs
   */
  constructor(
    protected cookie: CookieService,
    protected api: ApiService,
    protected session: Session,
    protected configs: ConfigsService
  ) {
    const currentLanguage = this.cookie.get('hl');

    if (currentLanguage) {
      this.setCurrentLanguage(currentLanguage, true);
    }
  }

  /**
   * Sets the current language. Returns true if a reload is needed.
   * @param language
   * @param serviceOnly
   */
  async setCurrentLanguage(
    language: string,
    serviceOnly: boolean = false
  ): Promise<boolean> {
    this.currentLanguage$.next(language);

    // sets global moment locale
    // if there is no corresponding locale file,
    // it will default to 'en'
    moment.locale(language);

    if (!serviceOnly) {
      if (this.session.isLoggedIn()) {
        await this.api
          .post('api/v1/settings', {
            language,
          })
          .toPromise();
      } else {
        this.cookie.set('hl', language);
      }

      return true;
    }

    return false;
  }

  /**
   * Sorts the language list based on current values
   * @param languages
   * @param current
   * @param browser
   */
  protected sortLanguageList(
    languages: Array<LanguageListEntry>,
    current: string,
    browser: string
  ): Array<LanguageListEntry> {
    const defaultLanguageCode = 'en';

    const score = ({ code }: LanguageListEntry): number => {
      let score = 0;

      if (POPULAR_LANGUAGE_CODES.indexOf(code) > -1) {
        score += 1;
      }

      if (code === defaultLanguageCode) {
        score += 1;
      }

      if (code === browser) {
        score += 2;
      }

      if (code === current) {
        score += 4;
      }

      return score;
    };

    return languages.sort((a, b) => score(b) - score(a));
  }
}
