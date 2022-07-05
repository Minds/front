import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Container for actions and information relating to a channel's membership tiers
 */
@Component({
  selector: 'm-channel__shop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'shop.component.html',
  styleUrls: ['shop.component.ng.scss'],
})
export class ChannelShopComponent {}
