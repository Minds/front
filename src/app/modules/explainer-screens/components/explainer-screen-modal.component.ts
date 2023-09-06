import { Component } from '@angular/core';
import { ExplainerScreenWeb } from '../../../../graphql/generated.strapi';
import { MarkdownService } from 'ngx-markdown';
import { Session } from '../../../services/session';
import { AuthModalService } from '../../auth/modal/auth-modal.service';

/**
 * Modal that shows explainers for various parts of the site.
 * Intended to be triggered via CMS.
 */
@Component({
  selector: 'm-explainScreenModal',
  templateUrl: './explainer-screen-modal.component.html',
  styleUrls: ['./explainer-screen-modal.component.ng.scss'],
})
export class ExplainerScreenModalComponent {
  // data from CMS.
  public explainerScreenData: ExplainerScreenWeb;

  constructor(
    private markdownService: MarkdownService,
    private session: Session,
    private authModal: AuthModalService
  ) {
    this.formatMarkdown();
  }

  onDismissIntent: () => void = () => {};

  /**
   * Format markdown before it is rendered - in this case so that
   * links open in a new tab.
   */
  public formatMarkdown(): void {
    const linkRenderer = this.markdownService.renderer.link;
    // modify the renderer so that links have their target set to _blank.
    this.markdownService.renderer.link = (href, title, text) => {
      const html = linkRenderer.call(
        this.markdownService.renderer,
        href,
        title,
        text
      );
      return html.replace(/^<a /, '<a target="_blank"');
    };
  }

  /*
   * Set modal data.
   * @param { any } data - data from CMS.
   * @returns { void }
   */
  public setModalData({ onDismissIntent, explainerScreenData }: any) {
    this.onDismissIntent = onDismissIntent || (() => {});

    if (!explainerScreenData) {
      throw new Error('explainerScreenData is required');
    }

    this.explainerScreenData = explainerScreenData;
  }

  /**
   * Handles action button click.
   * @returns { void }
   */
  public onActionButtonClick(): void {
    if (!this.isLoggedIn()) {
      this.authModal.open();
    }
    this.onDismissIntent?.();
  }

  /**
   * Whether a user is logged in.
   * @returns { boolean } true if a user is logged in.
   */
  public isLoggedIn(): boolean {
    return this.session.isLoggedIn();
  }
}
