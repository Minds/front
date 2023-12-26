import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SiteService } from '../../../../common/services/site.service';
import { ProChannelService } from '../channel.service';
import { Session } from '../../../../services/session';
import {
  SupportTier,
  SupportTiersService,
} from '../../../wire/v2/support-tiers.service';
import { AuthModalService } from '../../../auth/modal/auth-modal.service';

/**
 * Full page splash page shown to logged out visitors to pro pages.
 * Can be disabled or enabled in channel settings > pro > general tab.
 */
@Component({
  selector: 'm-proChannel__splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.ng.scss'],
  providers: [SupportTiersService],
})
export class ProChannelSplashComponent implements OnInit {
  channel: any;
  settings: any;

  constructor(
    public service: ProChannelService,
    protected site: SiteService,
    private authModal: AuthModalService,
    public session: Session
  ) {}

  ngOnInit(): void {
    this.channel = this.service.currentChannel;
    this.settings = this.channel.pro_settings;
  }

  async showLoginModal(): Promise<void> {
    await this.authModal.open({ formDisplay: 'login' });
  }
}
