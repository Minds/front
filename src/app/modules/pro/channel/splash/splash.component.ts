import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SiteService } from '../../../../common/services/site.service';
import { SignupModalService } from '../../../modals/signup/service';
import { ProChannelService } from '../channel.service';
import { Session } from '../../../../services/session';
import { SupportTier } from '../../../wire/v2/support-tiers.service';
import { ConfigsService } from '../../../../common/services/configs.service';

@Component({
  selector: 'm-proChannel__splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.ng.scss'],
})
export class ProChannelSplashComponent implements OnInit {
  hidden: boolean = false;

  channel: any;
  settings: any;
  channelTiers: SupportTier[];

  user;
  userIsMember: boolean = false;
  userIsSubscribed: boolean = false;

  lowestPrice: string;

  readonly cdnAssetsUrl: string;

  @Output() closeSplash: EventEmitter<any> = new EventEmitter();

  constructor(
    protected channelService: ProChannelService,
    protected modal: SignupModalService,
    protected site: SiteService,
    private signupModal: SignupModalService,
    configs: ConfigsService,
    public session: Session
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    this.channel = this.channelService.currentChannel;
    this.settings = this.channel.pro_settings;

    const moneyRewards = this.channel.wire_rewards.rewards.money;
    if (moneyRewards[0]) {
      this.lowestPrice = moneyRewards[0].amount;
    }
  }

  showLoginModal(): void {
    // TODO replace with new modal
    this.signupModal.open();
  }

  join(): void {
    // TODO replace with new modal
    // and after registration,
    // display wire creator modal on lowest money membership tier
    this.signupModal.open();
  }
}
