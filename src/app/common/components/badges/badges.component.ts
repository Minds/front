import { Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';
import { IS_TENANT_NETWORK } from '../../injection-tokens/tenant-injection-tokens';

export interface SocialProfileMeta {
  key: string;
  label: string;
  placeholder: string;
  link: string;
  icon: string;
  customIcon?: boolean;
}

/**
 * Displays the badges associated with a channel
 *
 * Control which badges are shown by passing a
 * subset of the available badge types as an input
 *
 * Admins may use this component to toggle whether a
 * channel is verified or a founder
 */
@Component({
  selector: 'm-channel--badges',
  templateUrl: 'badges.component.html',
  styleUrls: ['badges.component.ng.scss'],
})
export class ChannelBadgesComponent {
  @Input() user;
  @Input() badges: Array<string> = [
    'verified',
    'plus',
    'pro',
    'founder',
    'admin',
    'onchain_booster',
    'federation',
    'member',
  ];

  /**
   * Responsible to show the html middle dot element before the badges
   */
  @Input() showMidDot = false;

  isDark: boolean = false;
  themeSubscription: Subscription;

  constructor(
    public session: Session,
    private client: Client,
    private router: Router,
    protected themeService: ThemeService,
    @Inject(IS_TENANT_NETWORK) private readonly isTenantNetwork: boolean
  ) {}

  ngOnInit(): void {
    this.themeSubscription = this.themeService.isDark$.subscribe(
      (isDark) => (this.isDark = isDark)
    );
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  showVerifiedBadge() {
    if (this.badges.indexOf('verified') === -1 || this.isTenantNetwork) {
      return false;
    }

    if (this.user.verified && !this.user.is_admin) {
      return true;
    } else if (
      !this.user.is_admin &&
      this.session.isAdmin() &&
      this.user.guid !== this.session.getLoggedInUser().guid
    ) {
      return true;
    }

    return false;
  }

  showAdminBadge(): boolean {
    return this.user.is_admin && this.badges.indexOf('admin') > -1;
  }

  showPlusBadge(): boolean {
    return this.user.plus && !this.user.pro && this.badges.indexOf('plus') > -1;
  }

  showProBadge(): boolean {
    return this.user.pro && this.badges.indexOf('pro') > -1;
  }

  showBotBadge(): boolean {
    return this.user.bot;
  }

  showFounderBadge(): boolean {
    return (
      !this.isTenantNetwork &&
      this.user.founder &&
      !this.session.isAdmin() &&
      this.badges.indexOf('founder') > -1
    );
  }

  showOnchainBadge() {
    return (
      this.user.onchain_booster &&
      this.user.onchain_booster * 1000 > Date.now() &&
      this.badges.indexOf('onchain_booster') > -1
    );
  }

  showFederationBadge() {
    return this.badges.includes('federation') && this.user?.canonical_url;
  }

  badgeVisible(): boolean {
    return (
      this.showVerifiedBadge() ||
      this.showAdminBadge() ||
      this.showPlusBadge() ||
      this.showProBadge() ||
      this.showFounderBadge() ||
      this.showOnchainBadge() ||
      this.showFederationBadge()
    );
  }

  /**
   * Admins only
   */
  showFounderSwitch(): boolean {
    return (
      !this.isTenantNetwork &&
      this.session.isAdmin() &&
      this.badges.indexOf('founder') > -1
    );
  }

  protected showMemberBadge(): boolean {
    return (
      this.badges.indexOf('member') > -1 && this.user.has_active_site_membership
    );
  }

  /**
   * Admins only
   */
  verify(e) {
    if (!this.session.isAdmin()) {
      e.preventDefault();
      return this.router.navigate(['/plus']);
    }
    if (this.user.verified) return this.unVerify();
    this.user.verified = true;
    this.client.put('api/v1/admin/verify/' + this.user.guid).catch(() => {
      this.user.verified = false;
    });
  }

  /**
   * Admins only
   */
  unVerify() {
    this.user.verified = false;
    this.client.delete('api/v1/admin/verify/' + this.user.guid).catch(() => {
      this.user.verified = true;
    });
  }

  /**
   * Admins only
   */
  setFounder(e) {
    if (!this.session.isAdmin()) {
      e.preventDefault();
      return this.router.navigate(['/channels/founders']);
    }
    if (this.user.founder) return this.unsetFounder();
    this.user.founder = true;
    this.client.put('api/v1/admin/founder/' + this.user.guid).catch(() => {
      this.user.founder = false;
    });
  }

  /**
   * Admins only
   */
  unsetFounder() {
    this.user.founder = false;
    this.client.delete('api/v1/admin/founder/' + this.user.guid).catch(() => {
      this.user.founder = true;
    });
  }
}
