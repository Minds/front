import { Component, OnInit, Input } from '@angular/core';
import { WireModalService } from '../../../wire/wire-modal.service';
import { SupportTiersService } from '../../../wire/v2/support-tiers.service';
import { map, first } from 'rxjs/operators';
import { ProChannelService } from '../channel.service';
import { MindsUser } from '../../../../interfaces/entities';

@Component({
  selector: 'm-pro__joinButton',
  templateUrl: 'join-button.component.html',
  styleUrls: ['join-button.component.ng.scss'],
  providers: [SupportTiersService],
})
export class JoinButtonComponent implements OnInit {
  channel: MindsUser;

  lowestSupportTier$ = this.supportTiersService.list$.pipe(
    map(supportTiers => {
      return supportTiers[0];
    })
  );

  constructor(
    private wireModalService: WireModalService,
    protected supportTiersService: SupportTiersService,
    protected channelService: ProChannelService
  ) {}

  ngOnInit(): void {
    this.channel = this.channelService.currentChannel;
    this.supportTiersService.setEntityGuid(this.channel.guid);
  }

  async join(): Promise<void> {
    const lowestTier = await this.lowestSupportTier$.pipe(first()).toPromise();

    await this.wireModalService
      .present(this.channel, {
        supportTier: lowestTier,
      })
      .toPromise();
  }
}
