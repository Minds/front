import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Session } from '../../../../../services/session';
import { OverlayModalService } from '../../../../../services/ux/overlay-modal';
import isMobileOrTablet from '../../../../../helpers/is-mobile-or-tablet';
import isMobile from '../../../../../helpers/is-mobile';
import { ConfigsService } from '../../../../../common/services/configs.service';

@Component({
  selector: 'm-referrals--links',
  templateUrl: 'links.component.html',
})
export class ReferralsLinksComponent implements OnInit, OnDestroy {
  readonly cdnAssetsUrl: string;
  readonly siteUrl: string;

  referrerParam = '';
  registerUrl = '';
  encodedRegisterUrl = '';
  registerMessage = '';
  encodedRegisterMessage = '';

  registerUrlTimeout;
  referrerParamTimeout;
  registerUrlRecentlyCopied: boolean = false;
  referrerParamRecentlyCopied: boolean = false;
  registerUrlFocused: boolean = false;
  referrerParamFocused: boolean = false;

  constructor(
    public session: Session,
    private overlayModal: OverlayModalService,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.siteUrl = configs.get('site_url');
  }

  ngOnInit() {
    // Create custom referral links for current user
    this.referrerParam = '?referrer=' + this.session.getLoggedInUser().username;
    this.registerUrl = this.siteUrl + 'register' + this.referrerParam;
    this.encodedRegisterUrl =
      encodeURI(this.siteUrl) +
      encodeURIComponent('register' + this.referrerParam);
    this.encodedRegisterMessage = 'Join%20me%20on%20Minds%20%f0%9f%92%a1%20';
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
      'https://twitter.com/intent/tweet?tw_p=tweetbutton&text=' +
      this.encodedRegisterMessage +
      '&url=' +
      this.encodedRegisterUrl;
    window.open(url, '_blank', 'width=620, height=220, left=80, top=80');
  }

  openFacebook() {
    this.openWindow(
      'https://www.facebook.com/sharer/sharer.php?u=' +
        this.encodedRegisterUrl +
        '&display=popup&ref=plugin&src=share_button'
    );
  }

  openMessenger() {
    const encodedFacebookAppId = encodeURIComponent('184865748231073');
    this.openWindow(
      'fb-messenger://share?link=' +
        this.encodedRegisterUrl +
        '&app_id=' +
        encodedFacebookAppId
    );
  }

  openWhatsapp() {
    this.openWindow(
      'https://api.whatsapp.com/send?text=' +
        this.encodedRegisterMessage +
        this.encodedRegisterUrl
    );
  }

  openSMS() {
    this.openWindow(
      'sms:?&body=Join me on Minds%20%f0%9f%92%a1%20' + this.encodedRegisterUrl
    );
  }

  openEmail() {
    this.openWindow(
      'mailto:?subject=Join%20me%20on%20Minds&body=Join me on Minds%0D%0A' +
        this.encodedRegisterUrl
    );
  }

  // Receives the inputElement whose text you want to copy and linkType ('registerUrl' || 'referrerParam')
  copyToClipboard(inputElement, linkType) {
    inputElement.select();
    document.execCommand('copy');

    // Temporarily change button text from 'copy' to 'copied'
    if (linkType === 'registerUrl') {
      clearTimeout(this.registerUrlTimeout);
      this.registerUrlRecentlyCopied = true;
      this.registerUrlTimeout = setTimeout(() => {
        this.registerUrlRecentlyCopied = false;
      }, 2000);
    } else {
      clearTimeout(this.referrerParamTimeout);
      this.referrerParamRecentlyCopied = true;
      this.referrerParamTimeout = setTimeout(() => {
        this.referrerParamRecentlyCopied = false;
      }, 2000);
    }
  }

  // Make copyable link container appear focused when you click on it
  // Receives the inputElement to be focused and linkType ('registerUrl' || 'referrerParam')
  applyFocus(inputElement, linkType) {
    inputElement.focus();
    inputElement.select();

    if (linkType === 'registerUrl') {
      this.registerUrlFocused = true;
    } else {
      this.referrerParamFocused = true;
    }
  }

  ngOnDestroy() {
    clearTimeout(this.registerUrlTimeout);
    clearTimeout(this.referrerParamTimeout);
  }

  closeModal() {
    this.overlayModal.dismiss();
  }
}
