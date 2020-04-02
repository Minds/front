import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ConfigsService } from '../../common/services/configs.service';

@Component({
  selector: 'm-upgrades',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'upgrades.component.html',
})
export class UpgradesComponent {
  readonly cdnAssetsUrl: string;

  @ViewChild('upgradeOptionsAnchor', { static: false })
  readonly upgradeOptionsAnchor: ElementRef;

  constructor(configs: ConfigsService) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  upgradeNow() {
    if (this.upgradeOptionsAnchor.nativeElement) {
      this.upgradeOptionsAnchor.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }
}
