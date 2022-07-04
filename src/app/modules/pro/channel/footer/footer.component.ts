import { Component } from '@angular/core';
import { ProChannelService } from '../channel.service';
import { Session } from '../../../../services/session';
import { AuthService } from '../../../../services/auth.service';
import { SiteService } from '../../../../common/services/site.service';
import { MessengerConversationDockpanesService } from '../../../messenger/dockpanes/dockpanes.service';
import { MessengerConversationBuilderService } from '../../../messenger/dockpanes/conversation-builder.service';
import {
  getSocialProfileMeta,
  socialProfileMeta,
} from '../../../channels/social-profiles-meta';
import { Router } from '@angular/router';

export type FooterLink = { title: string; href: string };

/**
 * Pro channel footer links, displayed at bottom of feed and mobile hamburger menu.
 * Contains links selected by the owner (in pro settings) and
 * optional links to social media profiles
 */
@Component({
  selector: 'm-pro--channel-footer',
  templateUrl: 'footer.component.html',
})
export class ProChannelFooterComponent {
  constructor(
    protected channelService: ProChannelService,
    private router: Router,
    protected session: Session,
    protected auth: AuthService,
    protected site: SiteService,
    protected dockpanes: MessengerConversationDockpanesService,
    protected conversationBuilder: MessengerConversationBuilderService
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

  /**
   * Called when Message label is clicked.
   */
  onMessageClicked(): void {
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
    this.dockpanes.open(this.conversationBuilder.buildConversation(this.user));
  }

  /**
   * Determined whether message button should be shown.
   * @return { boolean } true if the message button should be shown.
   */
  showMessageButton(): boolean {
    return !this.isProDomain && this.currentUser.guid !== this.user.guid;
  }
}
