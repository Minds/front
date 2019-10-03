import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'm-upgrades__upgradeOptions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'upgrade-options.component.html',
})
export class UpgradeOptionsComponent {
  interval: string = 'yearly';
  currency: string = 'tokens';
}
