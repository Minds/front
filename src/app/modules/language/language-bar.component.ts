import { Component, Injector, SkipSelf } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FeaturesService } from '../../services/features.service';
import { OverlayModalService } from '../../services/ux/overlay-modal';
import { LanguageModalComponent } from './language-modal/language-modal.component';

/**
 * Language selection modal component
 */
@Component({
  selector: 'm-language__bar',
  template: `
    <div class="m-languageBar__wrapper">
      <div class="m-languageBar__currentLanguage">
        <i class="material-icons">language</i>
        <span i18n>{{ currentLanguage$ | async }}</span>
      </div>
      <div class="m-languageBar__languageOptions">
        <span
          *ngFor="let language of languages.slice(0, 8)"
          class="m-languageBar__languageOption"
          (click)="onLanguageSelect(language)"
          i18n
        >
          {{ language }}
        </span>
      </div>
      <div class="m-languageBar__squareButtonWrapper">
        <button
          (click)="openLanguageModal()"
          class="m-languageBar__squareButton"
        >
          +
        </button>
      </div>
    </div>
  `,
})
export class LanguageBarComponent {
  //TODO: Replace for property of service.
  readonly languages = [
    'Español',
    'English (US)',
    'Deutsch',
    'Français',
    'Português',
    'العربية',
    'Tiếng Việt',
    'Polski',
    'абаза бызшва (abaza bəzš˚a)',
    'Alnôba',
    'аҧсуа бызшәа (aṗsua byzš˚a)',
    'адыгэбзэ (adəgăbză)',
    'ʿAfár af',
    'Afrikaans',
    'アイヌ イタク/Aynu itak',
    'akan',
    'shqip / gjuha shqipe',
    'Unangam tunuu',
    'ኣማርኛ (amarəñña)',
    'Ndéé',
    'Fabla / l’Aragonés',
    'Aranés',
    'Basa Bali',
    'بلوچی',
  ];

  // TODO: Replace with value from service.
  readonly currentLanguage$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >('English (US)');

  constructor(
    private overlayModal: OverlayModalService,
    @SkipSelf() private injector: Injector
  ) {}
  /**
   * Opens language selection modal.
   */
  openLanguageModal(): void {
    this.overlayModal
      .create(
        LanguageModalComponent,
        null,
        {
          wrapperClass: 'm-modalV2__wrapper',
          onSave: language => {
            this.onLanguageSelect(language);
            this.overlayModal.dismiss();
          },
          onDismissIntent: () => {
            this.overlayModal.dismiss();
          },
        },
        this.injector
      )
      .onDidDismiss(() => {
        console.log('closed modal');
      })
      .present();
  }

  /**
   * Called on language selection.
   * @param language - language to pass to currentLanguage$
   */
  onLanguageSelect(language: string): void {
    this.currentLanguage$.next(language);
  }
}
