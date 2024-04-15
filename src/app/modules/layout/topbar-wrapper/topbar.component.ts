import { Component, OnInit } from '@angular/core';
import { Session } from '../../../services/session';
import { GiftCardPurchaseExperimentService } from '../../experiments/sub-services/gift-card-purchase-experiment.service';
import { Router } from '@angular/router';
import { TopbarService } from '../../../common/layout/topbar.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'm-topbarwrapper',
  templateUrl: 'topbar.component.html',
  styleUrls: ['topbar.component.ng.scss'],
})
export class TopbarWrapperComponent implements OnInit {
  public giftCardPurchaseExperimentIsActive: boolean = false;

  /** Whether topbar is being displayed in FORCED minimal light mode. */
  public readonly isMinimalLightMode$: BehaviorSubject<boolean> =
    this.topbarService.isMinimalLightMode$;

  /** Whether topbar is being displayed in minimal mode. */
  public readonly isMinimalMode$: BehaviorSubject<boolean> =
    this.topbarService.isMinimalMode$;

  constructor(
    public session: Session,
    private router: Router,
    private giftCardPurchaseExperiment: GiftCardPurchaseExperimentService,
    private topbarService: TopbarService
  ) {}

  ngOnInit(): void {
    this.giftCardPurchaseExperimentIsActive =
      this.giftCardPurchaseExperiment.isActive();
  }

  /**
   * Handles click on gift icon.
   * @returns { void }
   */
  public onGiftIconClick(): void {
    this.router.navigate(['/wallet/credits/send']);
  }
}
