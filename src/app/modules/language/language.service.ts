import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import LANGUAGE_LIST, { LanguageListEntry } from './language-list';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class LanguageService {
  /**
   *
   */
  readonly currentLanguage$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >('en');

  /**
   *
   */
  readonly browserLanguage$: Observable<string> = of(
    (navigator as any).language || (navigator as any).userLanguage
  ).pipe(
    map<string, string>(language =>
      (language || 'en').slice(0, 2).toLowerCase()
    )
  );

  /**
   *
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
   *
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
   *
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
