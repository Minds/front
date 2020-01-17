import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

@Component({
  selector: 'm-boost-console',
  templateUrl: 'console.component.html',
})
export class BoostConsoleComponent {
  type: BoostConsoleType;
  splitToolbar: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private metaService: MetaService
  ) {}

  ngOnInit() {
    this.route.firstChild.url.subscribe(segments => {
      console.log(segments);
      this.type = <BoostConsoleType>segments[0].path;
    });

    this.metaService.setTitle('Boost Console');

    this.detectWidth();
  }

  @HostListener('window:resize') detectWidth() {
    this.splitToolbar = window.innerWidth < 480;
  }
}
