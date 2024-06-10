/**
 * This CanActivate implementation always returns true. It's purpose
 * is to hook into the router and set a value in local storage on
 * ChildActivationEnd with the current tab url.
 * @author Ben Hayward
 */
import { Injectable } from '@angular/core';
import { Router, ChildActivationEnd } from '@angular/router';
import { WalletTabHistoryService } from '../tab-history.service';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class TabStorageGuard {
  constructor(
    private tabHistory: WalletTabHistoryService,
    private router: Router
  ) {}

  /**
   * Sets tab history to current url
   * @returns true
   */
  canActivate() {
    this.router.events
      .pipe(
        filter((event) => event instanceof ChildActivationEnd),
        take(1)
      )
      .subscribe((event: any) => {
        const url = event.snapshot['_routerState'].url;
        const splitUrl = url.split('/wallet')[1];
        if (splitUrl) {
          this.tabHistory.lastTab = splitUrl;
        }
      });

    // always return true
    return true;
  }
}
