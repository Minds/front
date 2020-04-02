import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Session } from '../../../services/session';
import isMobileOrTablet from '../../../helpers/is-mobile-or-tablet';
import isMobile from '../../../helpers/is-mobile';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-modal-share',
  templateUrl: 'share.html',
})
export class ShareModalComponent implements OnInit, OnDestroy {
  readonly cdnAssetsUrl: string;

  rawUrl: string = '';
  encodedRawUrl: string = '';
  referrerParam: string = '';

  shareUrl: string = '';
  encodedShareUrl: string = '';

  shareUrlRecentlyCopied: boolean = false;
  shareUrlFocused: boolean = false;
  shareUrlTimeout;

  includeReferrerParam: boolean = true; // Include referrer param in url by default
  flashing: boolean = false;
  flashTimeout;

  @Input('url') set data(url) {
    this.rawUrl = url;
    this.encodedRawUrl = encodeURI(this.rawUrl);
  }

  constructor(public session: Session, configs: ConfigsService) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit() {
    if (this.session.getLoggedInUser()) {
      // Create custom referral param for current user
      this.referrerParam =
        '?referrer=' + this.session.getLoggedInUser().username;
    }

    // Include referrerParam in url by default
    this.shareUrl = this.rawUrl + this.referrerParam;
    this.encodedShareUrl = encodeURIComponent(this.shareUrl);
  }

  // Only show Messenger/Whatsapp share buttons if mobile or tablet
  isMobileOrTablet() {
    return isMobileOrTablet();
  }

  // Only show SMS share button if mobile
  isMobile() {
    return isMobile();
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

  openMessenger() {
    const encodedFacebookAppId = encodeURIComponent('184865748231073');
    this.openWindow(
      'fb-messenger://share?link=' +
        this.encodedShareUrl +
        '&app_id=' +
        encodedFacebookAppId
    );
  }

  openWhatsapp() {
    this.openWindow(
      'https://api.whatsapp.com/send?text=' + this.encodedShareUrl
    );
  }

  openSMS() {
    this.openWindow('sms:?&body=' + this.encodedShareUrl);
  }

  openEmail() {
    this.openWindow('mailto:?body=' + this.encodedShareUrl);
  }

  // Add or remove referrerParam from share url based on checkbox input
  toggleReferrerParam() {
    if (!this.includeReferrerParam) {
      this.includeReferrerParam = true;
      this.shareUrl = this.rawUrl + this.referrerParam;
      this.encodedShareUrl = encodeURIComponent(this.shareUrl);
    } else {
      this.includeReferrerParam = false;
      this.shareUrl = this.rawUrl;
      this.encodedShareUrl = encodeURIComponent(this.shareUrl);
    }

    // Animate opacity of input text to indicate toggle occured
    this.flashing = true;
    clearTimeout(this.flashTimeout);
    this.flashTimeout = setTimeout(() => {
      this.flashing = false;
    }, 160);
  }

  // Receives input element whose text you want to copy
  copyToClipboard(inputElement) {
    inputElement.select();
    document.execCommand('copy');

    // Temporarily change button text from 'copy' to 'copied'
    clearTimeout(this.shareUrlTimeout);
    this.shareUrlRecentlyCopied = true;
    this.shareUrlTimeout = setTimeout(() => {
      this.shareUrlRecentlyCopied = false;
    }, 2000);
  }

  // Make copyable link container appear focused when you click on it
  // Receives the inputElement to be focused
  applyFocus(inputElement) {
    inputElement.focus();
    inputElement.select();
    this.shareUrlFocused = true;
  }

  ngOnDestroy() {
    clearTimeout(this.shareUrlTimeout);
    clearTimeout(this.flashTimeout);
  }
}
