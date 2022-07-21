import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MetaService } from '../../../common/services/meta.service';

export type BoostConsoleType = 'newsfeed' | 'content' | 'offers' | 'publisher';
export type BoostConsoleFilter =
  | 'create'
  | 'history'
  | 'earnings'
  | 'payouts'
  | 'settings'
  | 'inbox'
  | 'outbox';

/**
 * Base component for the boost console
 */
@Component({
  selector: 'm-boost-console',
  templateUrl: 'console.component.html',
})
export class BoostConsoleComponent implements OnInit, OnDestroy {
  type: BoostConsoleType;
  splitToolbar: boolean = false;
  routeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private metaService: MetaService
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.firstChild.url.subscribe(segments => {
      this.type = <BoostConsoleType>segments[0].path;
    });

    this.metaService.setTitle('Boost Console');

    this.detectWidth();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  @HostListener('window:resize') detectWidth() {
    this.splitToolbar = window.innerWidth < 480;
  }
}
