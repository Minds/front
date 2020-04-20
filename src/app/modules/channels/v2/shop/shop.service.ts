import { Injectable } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MindsUser } from '../../../../interfaces/entities';

/**
 * Wire reward structure
 * @todo Unify with Pay modal implementation
 */
export interface WireReward {
  id: string;
  amount: number;
  description: string;
}

/**
 * Builds Wire Rewards entries
 * @param key
 * @param data
 * @todo Unify with Pay modal implementation
 */
const buildWireRewardEntries = (
  key: string,
  data: Array<any>
): Array<WireReward> =>
  (data || [])
    .map(entry => ({
      id: `${key}:${entry.amount}`,
      amount: entry.amount,
      description: entry.description,
    }))
    .sort((a, b) => a.amount - b.amount);

/**
 * Wire rewards
 * @todo Unify with Pay modal implementation
 */
interface WireRewards {
  description: string;
  count: number;
  tokens: Array<WireReward>;
  usd: Array<WireReward>;
}

/**
 * Channel shop service.
 * @todo Unify with Pay modal implementation
 */
@Injectable()
export class ChannelShopService {
  /**
   * Shop items
   */
  readonly wireRewards$: Observable<WireRewards>;

  /**
   * Constructor. Set up channel observable pipe.
   * @param channel
   */
  constructor(protected channel: ChannelsV2Service) {
    this.wireRewards$ = this.channel.channel$.pipe(
      map(channel => this.getWireRewards(channel))
    );
  }

  /**
   * Parses the items
   * @param channel
   * @todo Unify with Pay modal implementation
   */
  getWireRewards(channel: MindsUser): WireRewards {
    if (!channel || !channel.wire_rewards) {
      return {
        count: 0,
        description: '',
        tokens: [],
        usd: [],
      };
    }

    // Update rewards
    const tokenRewards = buildWireRewardEntries(
      'tokens',
      channel.wire_rewards.rewards.tokens
    );

    const usdRewards = buildWireRewardEntries(
      'usd',
      channel.wire_rewards.rewards.money
    );

    return {
      description: channel.wire_rewards.description || '',
      count: tokenRewards.length + usdRewards.length,
      tokens: tokenRewards,
      usd: usdRewards,
    };
  }
}
