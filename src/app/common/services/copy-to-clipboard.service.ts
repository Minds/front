import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '../injection-tokens/common-injection-tokens';

/**
 * Service for copying text to the system clipboard.
 */
@Injectable({ providedIn: 'root' })
export class CopyToClipboardService {
  constructor(@Inject(WINDOW) private readonly window: Window) {}

  /**
   * Copies the given text to the system clipboard.
   * Only available over secure origin. No-op under http.
   * @param { string } text - the text to copy to the clipboard.
   * @returns { Promise<void> } - Resolves upon text copy completion.
   */
  public async copyToClipboard(text: string): Promise<void> {
    return this.window.navigator?.clipboard?.writeText(text);
  }
}
