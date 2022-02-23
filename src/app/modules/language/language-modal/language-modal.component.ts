import { Component } from '@angular/core';
import { LanguageService } from '../language.service';

/**
 * NO-OP
 */
const noOp = () => {};

/**
 * Language selection modal component
 */
@Component({
  selector: 'm-languageModal',
  templateUrl: 'language-modal.component.html',
})
export class LanguageModalComponent {
  /**
   *
   */
  onSaveIntent: (any: any) => void = noOp;

  /**
   *
   */
  onDismissIntent: () => void = noOp;

  /**
   * Constructor
   * @param service
   */
  constructor(public service: LanguageService) {}

  /**
   * Modal options
   * @param onSave
   */
  setModalData({ onSave }) {
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
