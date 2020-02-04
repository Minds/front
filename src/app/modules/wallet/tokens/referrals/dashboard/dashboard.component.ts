import { Component, OnInit, OnDestroy } from '@angular/core';
import { Client } from '../../../../../services/api/client';
import isMobileOrTablet from '../../../../../helpers/is-mobile-or-tablet';

@Component({
  selector: 'm-referrals--dashboard',
  templateUrl: 'dashboard.component.html',
})
export class ReferralsDashboardComponent implements OnInit, OnDestroy {
  referrals: Array<any> = [];
  offset: string = '';
  limit = 12;
  moreData = true;
  inProgress = false;
  noInitResults = false;
  fewerResultsThanLimit = false;
  timeoutIds: number[] = [];

  constructor(public client: Client) {}

  ngOnInit() {
    this.load(true);
  }

  // Gets a list of the current user's referral prospects and displays the list as a table
  // Note: a referral is 'pending' until the prospect joins rewards program
  load(init: boolean = false) {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;

    if (init) {
      this.referrals = [];
      this.moreData = true;
    }

    this.client
      .get(`api/v2/referrals`, { limit: this.limit, offset: this.offset })
      .then((response: any) => {
        // Response is an array of current user's referrals (see `Referral.php`)

        // Hide infinite scroll's 'nothing more to load' notice
        // if initial load length is less than response limit
        if (init && response.referrals.length < this.limit) {
          this.fewerResultsThanLimit = true;
          this.moreData = false;
        }

        if (!response.referrals.length) {
          this.inProgress = false;
          this.moreData = false;

          // If no results on initial load, show notice instead of empty table
          if (init) {
            this.noInitResults = true;
          }
          return;
        }

        if (response['load-next']) {
          this.offset = response['load-next'];
        } else {
          this.moreData = false;
        }

        this.referrals.push(...response.referrals);
        this.inProgress = false;
      })
      .catch(e => {
        this.moreData = false;
        this.inProgress = false;
      });
  }

  // If the prospect hasn't joined rewards yet, the 'Rewards Signup' date column
  // will display a 'ping' notification button instead
  triggerNotification(referral: any) {
    // Don't trigger a notification if insufficient time has elapsed since last ping
    // Note: waiting period duration is set in `Referral.php`
    if (!referral.pingable || referral.pingInProgress) {
      return;
    }

    referral.pingInProgress = true;

    // Trigger the ping notification
    this.client
      .put(`api/v2/referrals/` + referral.prospect.guid)
      .then((response: any) => {
        if (response.done) {
          referral.pingable = false;
          referral.pingRecentlySent = true;
          referral.pingInProgress = false;

          // Briefly display 'ping sent!' on tooltip after it's clicked
          referral.timeout = setTimeout(() => {
            referral.pingRecentlySent = false;
          }, 3000);

          this.timeoutIds.push(setTimeout(() => referral.timeout));

          return;
        }
        throw new Error('Error: ping incomplete');
      })
      .catch(e => {
        referral.pingInProgress = false;
        // Do something else?
      });
  }

  // Go straight to 'ping sent' tooltip notice on click ping button when using mobile or tablet
  isMobileOrTablet() {
    return isMobileOrTablet();
  }

  ngOnDestroy() {
    // Clear any remaining timeouts
    this.timeoutIds.forEach(id => clearTimeout(id));
  }
}
