import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { WireV2Service, WireUpgradeType } from '../../wire-v2.service';
import { Observable, Subscription } from 'rxjs';

/**
 * Displayed at the top of the tip modal when a user is making a payment to upgrade to pro/plus
 */
@Component({
  selector: 'm-wireCreator__upgradeBlock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'upgrade-block.component.html',
  styleUrls: ['upgrade-block.component.ng.scss'],
})
export class WireCreatorUpgradeBlockComponent implements OnInit, OnDestroy {
  upgradeTypeSubscription: Subscription;
  upgradeType: WireUpgradeType;

  /** Whether the wire modal is presenting a gift purchasing option. */
  public readonly isSendingGift$: Observable<boolean> =
    this.service.isSendingGift$;

  /**
   * Constructor. Retrieves CDN URL.
   * @param service
   * @param configs
   */
  constructor(public service: WireV2Service) {}

  ngOnInit() {
    this.upgradeTypeSubscription = this.service.upgradeType$.subscribe(
      (upgradeType) => {
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
