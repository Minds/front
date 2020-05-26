import { Component } from '@angular/core';

const noOp = () => {};

/**
 * Language selection modal component
 */
@Component({
  selector: 'm-language__modal',
  template: `
    <div class="m-modalV2__inner">
      <div class="m-modalV2__header">
        <h2 class="m-modalV2Header__title" i18n>Select Language</h2>
      </div>
      <div class="m-layout__spacer"></div>

      <div
        class="m-marketing__sep m-marketing__sep--dashed m-marketing__sep--big"
      ></div>

      <div class="m-modalV2__body">
        <span
          *ngFor="let language of languages"
          class="m-languageModal__languageOption"
          (click)="onSave(language)"
          i18n
        >
          {{ language }}
        </span>
      </div>
    </div>
  `,
})
export class LanguageModalComponent {
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
    'abaza bəzš˚a',
    'Alnôba',
    'aṗsua byzš˚a',
    'адыгэбзэ',
    'ʿAfár af',
    'Afrikaans',
    'アイヌ イタク',
    'akan',
    'shqip',
    'Unangam tunuu',
    'ኣማርኛ',
    'Ndéé',
    'Fabla',
    'Aranés',
    'Basa Bali',
    'بلوچی',
  ];

  onSaveIntent: (any: any) => void = noOp;

  onDismissIntent: () => void = noOp;

  /**
   * Modal options
   *
   * @param onSave
   */
  set opts({ onSave }) {
    this.onSaveIntent = onSave || noOp;
  }

  /**
   * Calls save intent with language.
   * @param language - selected language.
   */
  onSave(language): void {
    this.onSaveIntent(language);
  }

  /**
   * Calls DismissIntent.
   */
  onDismiss(): void {
    this.onDismissIntent();
  }
}
