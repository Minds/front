import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { WireModalService } from '../../../wire/wire-modal.service';
import {
  SupportTiersService,
  SupportTier,
} from '../../../wire/v2/support-tiers.service';
import { ProChannelService } from '../channel.service';
import { MindsUser } from '../../../../interfaces/entities';
import { Subscription } from 'rxjs';

@Component({
  selector: 'm-pro__joinButton',
  templateUrl: 'join-button.component.html',
  styleUrls: ['join-button.component.ng.scss'],
  providers: [SupportTiersService],
})
export class JoinButtonComponent implements OnInit, OnDestroy {
  channel: MindsUser;
  supportTiersSubscription: Subscription;

  userAlreadySubscribed: boolean = false;
  lowestSupportTier: SupportTier;

  constructor(
    private wireModal: WireModalService,
    protected supportTiersService: SupportTiersService,
    protected channelService: ProChannelService
  ) {}

  ngOnInit(): void {
    this.channel = this.channelService.currentChannel;
    this.supportTiersService.setEntityGuid(this.channel.guid);

    this.supportTiersSubscription = this.supportTiersService.list$.subscribe(
      supportTiers => {
        if (supportTiers[0]) {
          this.lowestSupportTier = supportTiers[0];

          this.userAlreadySubscribed = supportTiers.some(
            supportTier => supportTier.subscription_urn
          );
        }
      }
    );
  }

  async join(): Promise<void> {
    await this.wireModal
      .present(this.channel, {
        supportTier: this.lowestSupportTier,
      })
      .toPromise();
  }

  ngOnDestroy() {
    this.supportTiersSubscription.unsubscribe();
  }
}
