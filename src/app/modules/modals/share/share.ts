import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToasterService } from '../../../common/services/toaster.service';
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

  shareUrlFocused: boolean = false;
  embedInputFocused: boolean = false;

  embedCode: string;

  commentUrn: string;
  commentParam: string;

  includeReferrerParam: boolean = true; // Include referrer param in url by default
  flashing: boolean = false;
  flashTimeout;

  constructor(
    public session: Session,
    configs: ConfigsService,
    private toasterService: ToasterService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  setModalData({
    commentUrn,
    embedCode,
    url,
  }: {
    commentUrn?: string;
    embedCode?: string;
    url: string;
  }) {
    this.commentUrn = commentUrn;
    this.embedCode = embedCode;
    this.rawUrl = url;
  }

  ngOnInit() {
    if (this.session.getLoggedInUser()) {
      // Create custom referral param for current user
      this.referrerParam =
        'referrer=' + this.session.getLoggedInUser().username;
    }

    if (this.commentUrn) {
      this.commentParam = `focusedCommentUrn=${this.commentUrn}`;
    }
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
    } else {
      this.includeReferrerParam = false;
    }

    // Animate opacity of input text to indicate toggle occured
    this.flashing = true;
    clearTimeout(this.flashTimeout);
    this.flashTimeout = setTimeout(() => {
      this.flashing = false;
    }, 160);
  }

  // Receives input element whose text you want to copy
  copyShareUrlToClipboard(inputElement) {
    inputElement.select();
    document.execCommand('copy');

    // TODO: translate
    this.notify('Post link copied to clipboard');
  }

  copyEmbedCodeToClipboard(inputElement) {
    inputElement.select();
    document.execCommand('copy');

    // TODO: translate
    this.notify('Post embed code copied to clipboard');
  }

  /**
   * Notify the user using the toast service
   * @param {string} msg
   * */
  private notify(msg: string) {
    this.toasterService.success(msg);
  }

  // Make copyable link container appear focused when you click on it
  // Receives the inputElement to be focused
  applyFocusToShareInput(inputElement) {
    inputElement.focus();
    inputElement.select();
    this.shareUrlFocused = true;
  }

  applyFocusToEmbedInput(inputElement) {
    inputElement.focus();
    inputElement.select();
    this.embedInputFocused = true;
  }

  ngOnDestroy() {
    clearTimeout(this.flashTimeout);
  }

  get shareUrl(): string {
    if (this.includeReferrerParam && this.commentParam) {
      return `${this.rawUrl}?${this.referrerParam}&${this.commentParam}`;
    }

    if (this.includeReferrerParam) {
      return `${this.rawUrl}?${this.referrerParam}`;
    }

    if (this.commentParam) {
      return `${this.rawUrl}?${this.commentParam}`;
    }
    return this.rawUrl;
  }

  get encodedShareUrl(): string {
    return encodeURIComponent(this.shareUrl);
  }
}
