import { Component, Input } from '@angular/core';
import { AffiliatesEarnMethod } from '../../types/affiliates.types';
import isMobile from '../../../../helpers/is-mobile';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { ThemeService } from '../../../../common/services/theme.service';

/**
 * Preset links to share/copy as part of the affiliates program.
 * Different links appear depending on AffiliatesEarnMethod and desktop vs. mobile
 */
@Component({
  selector: 'm-affiliates__share',
  templateUrl: 'share.component.html',
  styleUrls: ['share.component.ng.scss'],
})
export class AffiliatesShareComponent {
  /**
   * Username of the referrer (aka current username)
   */
  @Input() referrerUsername: string = '';

  /**
   * Determinds which set of links to display
   */
  @Input() earnMethod: AffiliatesEarnMethod;

  readonly cdnAssetsUrl: string;
  readonly siteUrl: string = '';

  constructor(
    private toasterService: ToasterService,
    protected themeService: ThemeService,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.siteUrl = configs.get('site_url');
  }

  /**
   * Modal options.
   * @param { string } referrerUsername - username of referrer who wants to share links
   * @param { AffiliatesEarnMethod } earnMethod - whether the links relate to creators or spending
   * @param { function } onConfirm - callback on call for confirmation.
   * @param { function } onDismiss - callback on call to dismiss modal.
   */
  setModalData({ referrerUsername, earnMethod }) {
    this.referrerUsername = referrerUsername;
    this.earnMethod = earnMethod;
  }

  // Copy different urls to clipboard depending on button clicked
  copyUrlToClipboard(segment?: string) {
    let url;
    if (segment) {
      url = `${this.siteUrl}${segment}?referrer=${this.referrerUsername}`;
    } else {
      url = this.shareUrl;
    }

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.toasterService.success('Link copied to clipboard');
  }

  openWindow(url: string) {
    window.open(url, '_blank', 'width=600, height=300, left=80, top=80');
  }

  openTwitter() {
    const url =
      'https://twitter.com/intent/tweet?tw_p=tweetbutton&url=' +
      this.encodedShareUrl;
    window.open(url, '_blank', 'width=620, height=220, left=80, top=80');
  }

  openFacebook() {
    this.openWindow(
      'https://www.facebook.com/sharer/sharer.php?u=' +
        this.encodedShareUrl +
        '&display=popup&ref=plugin&src=share_button'
    );
  }

  openSMS() {
    this.openWindow('sms:?&body=' + this.encodedShareUrl);
  }

  openEmail() {
    this.openWindow('mailto:?body=' + this.encodedShareUrl);
  }

  // Only show SMS share button if mobile
  isMobile() {
    return isMobile();
  }

  get shareUrl(): string {
    return `${this.siteUrl}?referrer=${this.referrerUsername}`;
  }

  get encodedShareUrl(): string {
    return encodeURIComponent(this.shareUrl);
  }
}
