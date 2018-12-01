import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { MindsTitle } from '../../../services/ux/title';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { ContextService } from '../../../services/context.service';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { ModalPosterComponent } from '../../newsfeed/poster/poster-modal.component';
import { HashtagsSelectorModalComponent } from '../../hashtags/hashtag-selector-modal/hashtags-selector.component';

@Component({
  moduleId: module.id,
  selector: 'm-media--videos-list',
  templateUrl: 'list.component.html'
})

export class MediaVideosListComponent {

  filter: string = 'featured';
  owner: string = '';
  entities: Array<Object> = [];
  moreData: boolean = true;
  offset: string | number = '';
  inProgress: boolean = false;
  rating: number = 1; //safe by default
  all: boolean = false;

  city: string = '';
  cities: Array<any> = [];
  nearby: boolean = false;
  hasNearby: boolean = false;
  distance: number = 5;
  paramsSubscription: Subscription;
  searching;

  constructor(
    public client: Client,
    public router: Router,
    public route: ActivatedRoute,
    public title: MindsTitle,
    private context: ContextService,
    public session: Session,
    private overlayModal: OverlayModalService
  ) {
  }

  ngOnInit() {
    this.title.setTitle('Videos');

    this.paramsSubscription = this.route.params.subscribe((params) => {
      if (params['filter']) {
        this.filter = params['filter'];
        this.owner = '';

        switch (this.filter) {
          case 'all':
            break;
          case 'network':
            this.filter = 'network';
            break;
          case 'top':
            this.filter = 'trending';
            if (!this.session.isLoggedIn()) {
              this.router.navigate(['/login']);
            } 
            break;
          case 'suggested':
            if (!this.session.isLoggedIn()) {
              this.router.navigate(['/login']);
            }
            this.filter = 'trending';
            break;
          case 'my':
            this.filter = 'owner';
            this.owner = this.session.getLoggedInUser().guid;
            break;
          case 'owner':
          default:
            this.owner = this.filter;
            this.filter = 'owner';
        }
      }

      this.context.set('object:video');

      this.inProgress = false;
      this.moreData = true;
      this.entities = [];

      if (this.session.isLoggedIn())
        this.rating = this.session.getLoggedInUser().boost_rating;

      this.load(true);
    });
  }

  showPoster() {
    const creator = this.overlayModal.create(ModalPosterComponent, {}, {
      class: 'm-overlay-modal--no-padding m-overlay-modal--top m-overlay-modal--medium m-overlay-modal--overflow'
    });
    creator.present();
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  reloadTags(all: boolean = false) {
    this.all = all;
    this.load(true);
  }

  load(refresh: boolean = false) {

    if (this.inProgress)
      return false;

    if (refresh) {
      this.offset = '';
      this.entities = [];
    }

    this.inProgress = true;

    let endpoint;
    if (this.filter === 'trending') {
      endpoint = 'api/v2/entities/suggested/videos';
      if (this.all)
        endpoint += '/all';
    } else {
      endpoint = 'api/v1/entities/' + this.filter + '/videos/' + this.owner;
    }

    this.client.get(endpoint, {
      limit: 12,
      offset: this.offset,
      rating: this.rating,
    })
      .then((data: any) => {
        if (!data.entities || !data.entities.length) {
          this.moreData = false;
          this.inProgress = false;

          if (this.filter === 'trending')
            this.openHashtagsSelector();
          return false;
        }

        if (refresh) {
          this.entities = data.entities;
        } else {
          if (this.offset)
            data.entities.shift();
          this.entities = this.entities.concat(data.entities);
        }

        this.offset = data['load-next'];
        if (!this.offset)
          this.moreData = false;
        this.inProgress = false;
      })
      .catch((e) => {
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

  openHashtagsSelector() {
    this.overlayModal.create(HashtagsSelectorModalComponent, {}, {
      class: 'm-overlay-modal--hashtag-selector m-overlay-modal--medium-large',
      onSelected: () => {
        this.load(true); //refresh list
      },
    }).present();
  }

}
