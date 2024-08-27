import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
} from '@angular/core';
import { ConfigsService } from '../../services/configs.service';
import * as moment from 'moment';

/**
 * Topbar network trial banner component - display logic is seperated
 * off into the topbar alert service - this component is only responsible
 * for the presentation of the alert. Due to the site layout
 * being dependant on the topbars size and position, it is advisable
 * for a message to occupy 2 lines at most in a mobile view viewport
 * if changed.
 */
@Component({
  selector: 'm-networkTrialBanner',
  templateUrl: 'topbar-network-trial-banner.component.html',
  styleUrls: ['./topbar-network-trial-banner.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarNetworkTrialBannerComponent {
  /** Whether the trial is in an expired state. */
  protected readonly isExpired: boolean;

  /** Timestamp for a trials deletion. */
  protected readonly trialDeletionTimestamp: number;

  /** Timestamp for the trials end. */
  protected readonly trialEndTimestamp: number;

  /** Whether the trial is PAST the deletion timestamp threshold. */
  protected readonly isPastDeletionThreshold: boolean;

  /** Full URL for network upgrade. */
  protected readonly externalNetworksUrl: string =
    'https://networks.minds.com/';

  /** Host classes */
  @HostBinding('class')
  get classes(): Record<string, boolean> {
    return {
      'm-networkTrialBanner__host--active': !this.isExpired,
      'm-networkTrialBanner__host--expired': this.isExpired,
    };
  }

  constructor(
    private config: ConfigsService,
    private cd: ChangeDetectorRef
  ) {
    this.trialEndTimestamp = this.config.get('tenant')?.['trial_end'];
    this.trialDeletionTimestamp =
      this.config.get('tenant')?.['network_deletion_timestamp'];
    this.isExpired = this.trialEndTimestamp < moment().unix();
    // provide a buffer to avoid weirdness if there are delays in layout rendering.
    this.isPastDeletionThreshold =
      this.trialDeletionTimestamp < moment().add(30, 'seconds').unix();
  }
}
