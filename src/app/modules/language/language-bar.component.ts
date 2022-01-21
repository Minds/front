import { Component, Injector } from '@angular/core';
import { LanguageModalComponent } from './language-modal/language-modal.component';
import { LanguageService } from './language.service';
import { LanguageModalService } from './language-modal/language-modal.service';

/**
 * Language selection modal component
 */
@Component({
  selector: 'm-language__bar',
  templateUrl: 'language-bar.component.html',
  styleUrls: ['language-bar.component.ng.scss'],
})
export class LanguageBarComponent {
  /**
   * Constructor
   * @param service
   * @param languageModal
   * @param injector
   */
  constructor(
    public service: LanguageService,
    protected languageModal: LanguageModalService,
    protected injector: Injector
  ) {}

  /**
   * Opens language selection modal.
   */
  async openLanguageModal(): Promise<void> {
    const language = await this.languageModal.present(this.injector);

    if (language) {
      await this.onLanguageSelect(language);
    }
  }

  /**
   * Called on language selection.
   * @param language - language to pass to currentLanguage$
   */
  async onLanguageSelect(language: string): Promise<void> {
    const needsReload = await this.service.setCurrentLanguage(language);

    if (needsReload) {
      window.location.reload();
    }
  }
}
