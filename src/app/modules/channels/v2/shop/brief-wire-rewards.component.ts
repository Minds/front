import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';
import { Observable } from 'rxjs';
import { MindsUser } from '../../../../interfaces/entities';
import { map } from 'rxjs/operators';
import { WireModalService } from '../../../wire/wire-modal.service';

interface WireReward {
  type: 'tokens' | 'money';
  amount: number | '';
  description: string;
}

@Component({
  selector: 'm-channelShop__briefWireRewards',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'brief-wire-rewards.component.html',
})
export class ChannelShopBriefWireRewardsComponent {
  /**
   * Wire reward
   */
  public wireRewards$: Observable<
    Array<WireReward>
  > = this.service.channel$.pipe(
    map(channel => {
      if (!channel || !channel.wire_rewards) {
        return [];
      }

      const tokens: Array<WireReward> = (
        channel.wire_rewards.rewards.tokens || []
      ).map(reward => ({
        type: 'tokens',
        ...reward,
      }));

      const money: Array<WireReward> = (
        channel.wire_rewards.rewards.money || []
      ).map(reward => ({
        type: 'money',
        ...reward,
      }));

      return tokens.concat(money).sort((wireRewardA, wireRewardB) => {
        let a = wireRewardA.amount || 0;
        let b = wireRewardB.amount || 0;

        if (wireRewardA.type === 'tokens') {
          a = a * 1.25;
        }

        if (wireRewardB.type === 'tokens') {
          b = b * 1.25;
        }

        return a - b;
      });
    })
  );

  /**
   * Constructor
   * @param service
   * @param wireModal
   */
  constructor(
    public service: ChannelsV2Service,
    protected wireModal: WireModalService
  ) {}

  /**
   * When user clicks on a wire reward
   * @param channel
   * @param wireReward
   */
  async onEntryClick(
    channel: MindsUser,
    wireReward: WireReward
  ): Promise<void> {
    await this.wireModal
      .present(channel, {
        default: {
          min: wireReward.amount || 0,
          type: wireReward.type,
        },
      })
      .toPromise();
  }
}
