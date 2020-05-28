import { Component, Injector } from '@angular/core';
import { OverlayModalService } from '../../services/ux/overlay-modal';
import { LanguageModalComponent } from './language-modal/language-modal.component';
import { LanguageService } from './language.service';
import { LanguageModalService } from './language-modal/language-modal.service';

/**
 * Language selection modal component
 */
@Component({
  selector: 'm-language__bar',
  templateUrl: 'language-bar.component.html',
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
    const language = await this.languageModal
      .present(this.injector)
      .toPromise();

    if (language) {
      await this.onLanguageSelect(language);
    }
  }

  /**
   * Called on language selection.
   * @param language - language to pass to currentLanguage$
   */
  async onLanguageSelect(language: string): Promise<void> {
    await this.service.setCurrentLanguage(language);
  }
}
