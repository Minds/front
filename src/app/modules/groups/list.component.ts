import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { MindsGroupListResponse } from '../../interfaces/responses';
import { ContextService } from '../../services/context.service';
import { HashtagsSelectorModalComponent } from '../hashtags/hashtag-selector-modal/hashtags-selector.component';
import { OverlayModalService } from '../../services/ux/overlay-modal';

@Component({
  selector: 'm-groups--list',
  templateUrl: 'list.component.html',
})
export class GroupsListComponent {
  minds;

  moreData: boolean = true;
  inProgress: boolean = false;
  all: boolean = false;
  offset: string = '';
  entities: Array<any> = [];
  filter: string = 'top';
  paramsSubscription: Subscription;
  rating: number = 1;
  preventHashtagOverflow: boolean = false;

  constructor(
    public client: Client,
    public route: ActivatedRoute,
    public router: Router,
    private context: ContextService,
    public session: Session,
    private overlayModal: OverlayModalService
  ) {}

  ngOnInit() {
    this.context.set('group');
    this.detectWidth();

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['filter']) {
        if (params['filter'] === 'suggested' && !this.session.isLoggedIn()) {
          this.router.navigate(['/login']);
        }
        this.filter = params['filter'];

        this.inProgress = false;
        this.moreData = true;
        this.entities = [];

        if (this.session.isLoggedIn())
          this.rating = this.session.getLoggedInUser().boost_rating;

        this.load(true);
      }
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  reloadTags(all: boolean) {
    this.all = all;
    this.load(true);
  }

  load(refresh: boolean = false) {
    if (this.inProgress) return;

    if (refresh) {
      this.offset = '';
      this.entities = [];
      this.moreData = true;
    }

    let endpoint, key;

    switch (this.filter) {
      case 'top':
        if (!this.session.isLoggedIn()) {
          this.router.navigate(['/login']);
        }
        endpoint = `api/v2/entities/suggested/groups`;
        if (this.all) endpoint += '/all';
        key = 'entities';
        break;
      case 'suggested':
        endpoint = `api/v2/entities/suggested/groups`;
        key = 'entities';
        break;
      default:
        endpoint = `api/v1/groups/${this.filter}`;
        key = 'groups';
        if (this.all) this.router.navigate(['/groups/top']);
        break;
    }

    this.inProgress = true;
    this.client
      .get(endpoint, {
        limit: 12,
        offset: this.offset,
        rating: this.rating,
      })
      .then((response: MindsGroupListResponse) => {
        if (!response[key] || response[key].length === 0) {
          this.moreData = false;
          this.inProgress = false;
          if (this.filter == 'top') this.openHashtagsSelector();
          return false;
        }

        if (refresh) {
          this.entities = response[key];
        } else {
          if (this.offset) response[key].shift();

          this.entities.push(...response[key]);
        }

        this.offset = response['load-next'];
        if (!this.offset) {
          this.moreData = false;
        }
        this.inProgress = false;
      })
      .catch(e => {
        this.inProgress = false;
      });
  }

  reloadTopFeed() {
    this.load(true);
  }

  onOptionsChange(e: { rating }) {
    this.rating = e.rating;

    if (this.inProgress) {
      return setTimeout(() => {
        this.onOptionsChange(e);
      }, 100); //keep trying every 100ms
    }
    this.load(true);
  }

  @HostListener('window:resize') detectWidth() {
    this.preventHashtagOverflow = window.innerWidth < 400;
  }

  openHashtagsSelector() {
    this.overlayModal
      .create(
        HashtagsSelectorModalComponent,
        {},
        {
          class:
            'm-overlay-modal--hashtag-selector m-overlay-modal--medium-large',
          onSelected: () => {
            this.load(true); //refresh list
          },
        }
      )
      .present();
  }
}

export { GroupsProfile } from './profile/profile';
export { GroupsCreator } from './create/create';
