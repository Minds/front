import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigsService } from '../../../common/services/configs.service';

/**
 * Presents a QR code/link that leads to the Minds mobile page
 */
@Component({
  selector: 'm-appDownloadModal',
  templateUrl: './app-download.component.html',
  styleUrls: ['./app-download.component.ng.scss'],
})
export class AppDownloadModalComponent {
  private readonly siteUrl: string;

  constructor(configs: ConfigsService) {
    this.siteUrl = configs.get('site_url');
  }

  /**
   * Dismiss intent.
   */
  onDismissIntent: () => void = () => {};

  setModalData({ onCloseIntent }) {
    this.onDismissIntent = onCloseIntent || (() => {});
  }

  get link() {
    return `${this.siteUrl}mobile`;
  }
}
