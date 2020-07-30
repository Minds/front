import { Component, Input } from '@angular/core';
import { ConfigsService } from '../../services/configs.service';

@Component({
  selector: 'm-poweredBy',
  templateUrl: 'powered-by.component.html',
  styleUrls: ['powered-by.component.ng.scss'],
})
export class PoweredByComponent {
  @Input() product;
  @Input() link = '/';

  readonly cdnAssetsUrl: string;

  constructor(configs: ConfigsService) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }
}
