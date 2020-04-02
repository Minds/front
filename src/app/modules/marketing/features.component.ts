import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigsService } from '../../common/services/configs.service';

@Component({
  selector: 'm-marketing--features',
  templateUrl: 'features.component.html',
})
export class MarketingFeaturesComponent {
  readonly cdnAssetsUrl: string;

  @Input() panels = {
    newsfeed: true,
  };

  constructor(configs: ConfigsService) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }
}
