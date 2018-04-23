import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BoostConsoleType } from '../console.component';

import { BoostService } from '../../boost.service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { ModalPosterComponent } from '../../../newsfeed/poster/poster-modal.component';

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

  constructor(
    public service: BoostService, 
    private overlayModal: OverlayModalService,
    private router: Router
  ) { }

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

  showPoster() {
    const creator = this.overlayModal.create(ModalPosterComponent, {}, {
      class: 'm-overlay-modal--no-padding m-overlay-modal--top m-overlay-modal--medium m-overlay-modal--overflow'
    });
    creator.present();
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

    const type: string = this.type === 'offers' ? 'peer' : this.type;

    this.service.load(type, '', {
      offset: this.offset
    })
      .then(({ boosts, loadNext }) => {
        this.inProgress = false;

        if (!boosts.length) {
          this.moreData = false;
          if (this.boosts.length == 0 && type == 'content') {
            this.router.navigate(['/boost/console/sidebar/create']);
          } else { 
            this.router.navigate(['/boost/console/newsfeed/create']);
          }
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
