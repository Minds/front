import { Component, Input } from '@angular/core';
import { BoostConsoleFilter } from '../console.component';

import { BoostService } from '../../boost.service';

@Component({
  moduleId: module.id,
  providers: [BoostService],
  selector: 'm-boost-console-p2p',
  templateUrl: 'p2p.component.html'
})
export class BoostConsoleP2PListComponent {

  initialized: boolean = false;
  inProgress: boolean = false;

  filter: string = '';
  boosts: any[] = [];
  offset = '';
  moreData = true;

  error: string = '';

  constructor(public service: BoostService) { }

  @Input('filter') set _filter(filter: BoostConsoleFilter) {
    this.filter = filter;

    if (this.initialized) {
      this.load(true);
    }
  }

  ngOnInit() {
    this.load(true);
    this.initialized = true;
  }

  load(refresh?: boolean) {
    if ((this.inProgress && !refresh) || !this.filter) {
      return;
    }

    this.inProgress = true;

    if (refresh) {
      this.boosts = [];
      this.offset = '';
      this.moreData = true;
    }

    this.service.load('peer', this.filter, {
      offset: this.offset
    })
      .then(({ boosts, loadNext }) => {
        this.inProgress = false;

        if (!boosts.length) {
          this.moreData = false;
          return;
        }

        this.boosts.push(...boosts);
        this.offset = loadNext;
        this.moreData = !!loadNext;
      })
      .catch(e => {
        this.inProgress = false;
        this.moreData = false;
        this.error = (e && e.message) || '';
      });
  }
}
