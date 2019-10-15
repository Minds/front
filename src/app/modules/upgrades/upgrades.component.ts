import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'm-upgrades',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'upgrades.component.html',
})
export class UpgradesComponent {
  readonly cdnAssetsUrl: string = window.Minds.cdn_assets_url;

  @ViewChild('upgradeOptionsAnchor', { static: false })
  readonly upgradeOptionsAnchor: ElementRef;

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
