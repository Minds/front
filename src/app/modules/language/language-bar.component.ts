import { Component, Injector, SkipSelf } from '@angular/core';
import { OverlayModalService } from '../../services/ux/overlay-modal';
import { LanguageModalComponent } from './language-modal/language-modal.component';
import { LanguageService } from './language.service';

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
   * @param overlayModal
   * @param injector
   */
  constructor(
    public service: LanguageService,
    protected overlayModal: OverlayModalService,
    protected injector: Injector
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
        // TODO: Reload if needed
      })
      .present();
  }

  /**
   * Called on language selection.
   * @param language - language to pass to currentLanguage$
   */
  onLanguageSelect(language: string): void {
    this.service.currentLanguage$.next(language);
  }
}
