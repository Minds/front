import { Component, Input } from '@angular/core';
import { BoostConsoleType } from '../console.component';

import { BoostService } from '../../boost.service';

@Component({
  moduleId: module.id,
  providers: [BoostService],
  selector: 'm-boost-console-network',
  templateUrl: 'network.component.html'
})
export class BoostConsoleNetworkListComponent {

  initialized: boolean = false;
  inProgress: boolean = false;

  type: string = '';
  boosts: any[] = [];
  offset = '';
  moreData = true;

  error: string = '';

  constructor(public service: BoostService) { }

  @Input('type') set _type(type: BoostConsoleType) {
    this.type = type;

    if (this.initialized) {
      this.load(true);
    }
  }

  ngOnInit() {
    this.load(true);
    this.initialized = true;
  }

  load(refresh?: boolean) {
    if ((this.inProgress && !refresh) || !this.type) {
      return;
    }

    this.inProgress = true;

    if (refresh) {
      this.boosts = [];
      this.offset = '';
      this.moreData = true;
    }

    this.service.load(this.type, '', {
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
