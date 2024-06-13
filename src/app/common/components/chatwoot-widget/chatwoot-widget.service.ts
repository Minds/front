import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { IS_TENANT_NETWORK } from '../../injection-tokens/tenant-injection-tokens';
import { Session } from '../../../services/session';

/** Toggle state for chatwoot widget. */
export type ChatwootToggleState = 'close' | 'open' | null;

/**
 * Service for interacting with Chatwoot widget.
 */
@Injectable({ providedIn: 'root' })
export class ChatwootWidgetService {
  constructor(
    private session: Session,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(IS_TENANT_NETWORK) private readonly isTenantNetwork: boolean
  ) {}

  /**
   * Popout a chatwoot session in a new browser window.
   * @returns { void }
   */
  public popoutChatWindow(): void {
    if (isPlatformBrowser(this.platformId) && this.canUseChatwoot()) {
      (this.document.defaultView as any).$chatwoot?.popoutChatWindow();
    }
  }

  /**
   * Toggle chat window.
   * @param toggleState - toggle state, if null, will toggle the opposite of the current state.
   * @returns { void }
   */
  public toggleChatWindow(toggleState: ChatwootToggleState = null): void {
    if (isPlatformBrowser(this.platformId) && this.canUseChatwoot()) {
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
    if (isPlatformBrowser(this.platformId) && this.canUseChatwoot()) {
      try {
        (this.document.defaultView as any).$chatwoot?.toggleBubbleVisibility(
          'show'
        );
      } catch (e) {
        console.error(e);
      }
    }
  }

  /**
   * Whether chatwoot can be used by the user.
   * @returns { boolean } - true if chatwoot can be used, false otherwise.
   */
  public canUseChatwoot(): boolean {
    return !this.isTenantNetwork || this.session.isAdmin();
  }
}
