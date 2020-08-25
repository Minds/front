import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'm-channel__shop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'shop.component.html',
  styleUrls: ['shop.component.ng.scss'],
})
export class ChannelShopComponent {}
