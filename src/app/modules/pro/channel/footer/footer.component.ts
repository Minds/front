import { Component } from '@angular/core';
import { ProChannelService } from '../channel.service';
import { Session } from '../../../../services/session';
import { AuthService } from '../../../../services/auth.service';
import { SiteService } from '../../../../common/services/site.service';
import {
  getSocialProfileMeta,
  socialProfileMeta,
} from '../../../channels/social-profiles/meta';

export type FooterLink = { title: string; href: string };

@Component({
  selector: 'm-pro--channel-footer',
  templateUrl: 'footer.component.html',
})
export class ProChannelFooterComponent {
  constructor(
    protected channelService: ProChannelService,
    protected session: Session,
    protected auth: AuthService,
    protected site: SiteService
  ) {}

  get socialProfilesMeta() {
    return socialProfileMeta;
  }

  get footerLinks(): FooterLink[] {
    return this.channelService.currentChannel.pro_settings.footer_links;
  }

  get footerText() {
    return this.channelService.currentChannel.pro_settings.footer_text;
  }

  get footerSocialProfiles() {
    return this.channelService.currentChannel.social_profiles;
  }

  onUserChange() {
    this.channelService.onChannelChange.next(this.user);
  }

  get user() {
    return this.channelService.currentChannel;
  }

  get isOwner() {
    return (
      this.session.getLoggedInUser() &&
      this.session.getLoggedInUser().guid == this.user.guid
    );
  }

  get currentUser() {
    return this.session.getLoggedInUser();
  }

  get currentUsername() {
    return this.session.getLoggedInUser().username;
  }

  get viewProfileHref() {
    return this.site.baseUrl + this.session.getLoggedInUser().username;
  }

  get isProDomain() {
    return this.site.isProDomain;
  }

  getSocialProfileURL(url: string) {
    if (url.includes('http://') || url.includes('https://')) {
      return url;
    } else {
      return 'http://' + url;
    }
  }

  getSocialProfileIconClass({ key = '' }) {
    let meta = getSocialProfileMeta(key),
      domClass;

    if (meta.customIcon) {
      domClass = `m-custom-icon m-custom-icon-${meta.icon}`;
    } else {
      domClass = `fa fa-fw fa-${meta.icon}`;
    }
    return domClass;
  }

  logout() {
    this.auth.logout();
  }

  getTarget(link: FooterLink) {
    const domain = this.isProDomain
      ? this.user.pro_settings.domain
      : this.site.baseUrl;
    const regex = new RegExp(`/${domain}/`);
    return regex.exec(link.href) ? '_self' : '_blank';
  }
}
