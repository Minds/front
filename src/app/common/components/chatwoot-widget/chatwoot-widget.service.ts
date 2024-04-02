import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

/** Toggle state for chatwoot widget. */
export type ChatwootToggleState = 'close' | 'open' | null;

/**
 * Service for interacting with Chatwoot widget.
 */
@Injectable({ providedIn: 'root' })
export class ChatwootWidgetService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Popout a chatwoot session in a new browser window.
   * @returns { void }
   */
  public popoutChatWindow(): void {
    if (isPlatformBrowser(this.platformId)) {
      (this.document.defaultView as any).$chatwoot?.popoutChatWindow();
    }
  }

  /**
   * Toggle chat window.
   * @param toggleState - toggle state, if null, will toggle the opposite of the current state.
   * @returns { void }
   */
  public toggleChatWindow(toggleState: ChatwootToggleState = null): void {
    if (isPlatformBrowser(this.platformId)) {
      (this.document.defaultView as any).$chatwoot?.toggle(toggleState);
    }
  }

  /**
   * Hide chatwoot bubble.
   * @returns { void }
   */
  public hideBubble(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        (this.document.defaultView as any).$chatwoot?.toggleBubbleVisibility(
          'hide'
        );
      } catch (e) {
        console.error(e);
      }
    }
  }

  /**
   * Show chatwoot bubble.
   * @returns { void }
   */
  public showBubble(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        (this.document.defaultView as any).$chatwoot?.toggleBubbleVisibility(
          'show'
        );
      } catch (e) {
        console.error(e);
      }
    }
  }
}
