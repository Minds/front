import { Component } from '@angular/core';

/**
 * Displays markdown content for custom pages
 * in a modal, so tenant admins can preview it.
 */
@Component({
  selector: 'm-customPageForm__contentPreviewModal',
  templateUrl: './content-preview-modal.component.html',
  styleUrls: ['./content-preview-modal.component.ng.scss'],
})
export class CustomPageFormContentPreviewModalComponent {
  protected content: string = '';
  /**
   * @param content the markdown text
   */
  setModalData({ content }) {
    this.content = content;
  }
}
