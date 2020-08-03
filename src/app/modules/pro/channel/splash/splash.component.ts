import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SiteService } from '../../../../common/services/site.service';
import { SignupModalService } from '../../../modals/signup/service';
import { ProChannelService } from '../channel.service';
import { Session } from '../../../../services/session';
import {
  SupportTier,
  SupportTiersService,
} from '../../../wire/v2/support-tiers.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { AuthModalService } from '../../../auth/modal/auth-modal.service';
import { map, first } from 'rxjs/operators';
import { WireModalService } from '../../../wire/wire-modal.service';

@Component({
  selector: 'm-proChannel__splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.ng.scss'],
  providers: [SupportTiersService],
})
export class ProChannelSplashComponent implements OnInit {
  hidden: boolean = false;

  channel: any;
  settings: any;
  channelTiers: SupportTier[];

  lowestSupportTier$ = this.supportTiersService.list$.pipe(
    map(supportTiers => {
      return supportTiers[0];
    })
  );

  @Output() closeSplash: EventEmitter<any> = new EventEmitter();

  constructor(
    protected channelService: ProChannelService,
    protected modal: SignupModalService,
    protected site: SiteService,
    private authModal: AuthModalService,
    public session: Session,
    private supportTiersService: SupportTiersService
  ) {}

  ngOnInit(): void {
    this.channel = this.channelService.currentChannel;
    this.settings = this.channel.pro_settings;

    this.supportTiersService.setEntityGuid(this.channel.guid);
  }

  async showLoginModal(): Promise<void> {
    await this.authModal.open({ formDisplay: 'login' });
  }
}
