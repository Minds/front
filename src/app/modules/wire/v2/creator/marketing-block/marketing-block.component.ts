import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { WireV2Service, WireUpgradeType } from '../../wire-v2.service';
import { Subscription } from 'rxjs';

/**
 * Displayed at the top of the tip modal when a user is making a payment to upgrade to pro/plus
 */
@Component({
  selector: 'm-wireCreator__marketingBlock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'marketing-block.component.html',
  styleUrls: ['marketing-block.component.ng.scss'],
})
export class WireCreatorMarketingBlockComponent implements OnInit, OnDestroy {
  upgradeTypeSubscription: Subscription;
  upgradeType: WireUpgradeType;
  /**
   * Constructor. Retrieves CDN URL.
   * @param service
   * @param configs
   */
  constructor(public service: WireV2Service) {}

  ngOnInit() {
    this.upgradeTypeSubscription = this.service.upgradeType$.subscribe(
      upgradeType => {
        this.upgradeType = upgradeType;
      }
    );
  }

  ngOnDestroy() {
    if (this.upgradeTypeSubscription) {
      this.upgradeTypeSubscription.unsubscribe();
    }
  }

  get isPlus(): boolean {
    return this.upgradeType === 'plus';
  }

  get isPro(): boolean {
    return this.upgradeType === 'pro';
  }
}
