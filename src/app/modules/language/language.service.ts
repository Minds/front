import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from '../../common/services/cookie.service';
import LANGUAGE_LIST, { LanguageListEntry } from './language-list';

@Injectable()
export class LanguageService {
  /**
   * Current language selected by user
   */
  readonly currentLanguage$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >('en');

  /**
   * Browser's language
   */
  readonly browserLanguage$: Observable<string> = of(
    (navigator as any).language || (navigator as any).userLanguage
  ).pipe(
    map<string, string>(language =>
      (language || 'en').slice(0, 2).toLowerCase()
    )
  );

  /**
   * List of all languages, weighted by current, browser and site default (English)
   */
  readonly languages$: Observable<Array<LanguageListEntry>> = combineLatest([
    of(LANGUAGE_LIST),
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
    map(
      ([languages, currentLanguage]) =>
        languages.find(language => language.code === currentLanguage).nativeName
    ),
    catchError(() => 'Unknown')
  );

  /**
   * Constructor. Sets current language.
   * @param cookie
   */
  constructor(protected cookie: CookieService) {
    const currentLanguage = this.cookie.get('hl');

    if (currentLanguage) {
      this.setCurrentLanguage(currentLanguage, true);
    }
  }

  /**
   * Sets the current language
   * @param language
   * @param serviceOnly
   */
  async setCurrentLanguage(
    language: string,
    serviceOnly: boolean = false
  ): Promise<void> {
    this.currentLanguage$.next(language);

    if (!serviceOnly) {
      // TODO: Do it via API (async)
      this.cookie.put('hl', language);
    }
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
