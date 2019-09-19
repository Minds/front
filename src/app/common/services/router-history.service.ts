import { Router, RoutesRecognized, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter, pairwise } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class RouterHistoryService {
  eventsSubscription: Subscription;
  history: Array<string> = [];

  constructor(private router: Router) {
    this.eventsSubscription = this.router.events
      .pipe(
        filter((e: any) => e instanceof RoutesRecognized),
        pairwise()
      )
      .subscribe((e: any) => {
        this.history.push(e[0].urlAfterRedirects);
      });
  }

  getPreviousUrl(): string {
    return this.history[this.history.length - 1];
  }
}
