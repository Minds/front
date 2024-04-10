import { Component } from '@angular/core';
import { LanguageService } from '../language.service';
import { combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'm-language__sidebarPrompt',
  templateUrl: './sidebar-prompt.component.html',
})
export class LanguageSidebarPromptComponent {
  languageName$ = this.languageService.browserLanguageName$;
  browserLanguage: string;
  browserLanguageSubscription: Subscription;
  saving = false;

  shouldShow$ = combineLatest(
    this.languageService.browserLanguage$,
    this.languageService.currentLanguage$
  ).pipe(
    map(
      ([browserLanguage, currentLanguage]) =>
        browserLanguage !== currentLanguage && browserLanguage !== 'en'
    )
  );

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    this.browserLanguageSubscription =
      this.languageService.browserLanguage$.subscribe(
        (browserLanguage) => (this.browserLanguage = browserLanguage)
      );
  }

  ngOnDestroy() {
    this.browserLanguageSubscription.unsubscribe();
  }

  async onClick(e: MouseEvent) {
    this.saving = true;
    await this.languageService.setCurrentLanguage(this.browserLanguage);
    this.saving = false;

    // Refresh the window
    window.location.reload();
  }
}
