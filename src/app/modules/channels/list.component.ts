import { Component, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { MindsTitle } from '../../services/ux/title';
import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { ContextService } from '../../services/context.service';
import { HashtagsSelectorModalComponent } from '../hashtags/hashtag-selector-modal/hashtags-selector.component';
import { OverlayModalService } from '../../services/ux/overlay-modal';

@Component({
  moduleId: module.id,
  selector: 'm-channels--list',
  templateUrl: 'list.component.html'
})

export class ChannelsListComponent {

  filter: string = 'top';
  uri: string = 'entities/trending/channels';
  entities: Array<Object> = [];
  moreData: boolean = true;
  all: boolean = false;
  offset: string | number = '';
  inProgress: boolean = false;
  paramsSubscription: Subscription;
  rating: number = 1; //safe by default
  version: string = 'v1';
  preventHashtagOverflow: boolean = false;

  constructor(
    public client: Client,
    public router: Router,
    public route: ActivatedRoute,
    public title: MindsTitle,
    private context: ContextService,
    public session: Session,
    private overlayModal: OverlayModalService,
  ) { }

  ngOnInit() {
    this.title.setTitle('Channels');

    this.paramsSubscription = this.route.params.subscribe((params) => {
      if (params['filter']) {
        this.filter = params['filter'];
        this.version = 'v1';
        switch (this.filter) {
          case 'all':
            this.filter = 'all';
            break;
          case 'top':
            if (!this.session.isLoggedIn()) {
              this.router.navigate(['/login']);
            }
            this.version = 'v2';
            this.filter = 'trending';
            this.uri = 'entities/suggested/channels';
            break;
          case 'suggested':
            if (!this.session.isLoggedIn()) {
              this.router.navigate(['/channels', 'subscriptions']);
            }
            this.filter = 'trending';
            this.uri = 'entities/trending/channels';
            break;
          case 'subscribers':
            this.uri = 'subscribe/subscribers/' + this.session.getLoggedInUser().guid;
            break;
          case 'subscriptions':
            this.uri = 'subscribe/subscriptions/' + this.session.getLoggedInUser().guid;
            break;
          case 'founders':
            this.uri = 'channels/founders/';
            this.version = 'v2';
            break;
        }
      }

      this.inProgress = false;
      this.moreData = true;
      this.entities = [];
      this.load(true);
      this.detectWidth();
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  reloadTags(all: boolean = false) {
    this.all = all;
    this.load(true);
  }

  load(refresh: boolean = false) {

    if (this.inProgress || !this.moreData && !refresh)
      return false;

    if (refresh) {
      this.offset = '';
      this.entities = [];
    }

    this.inProgress = true;

    let uri = this.uri;
    if (this.all) {
      uri = uri + '/all';
      this.router.navigate(['channels/top']);
    }

    this.client.get('api/' + this.version + '/' + uri, {
        limit: 24,
        offset: this.offset
      })
      .then((data: any) => {
        if (data.users)
          data.entities = data.users;
        if (!data.entities || !data.entities.length) {
          this.moreData = false;
          this.inProgress = false;
          if (this.filter == 'trending')
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

  @HostListener('window:resize') detectWidth() {
    this.preventHashtagOverflow = window.innerWidth < 400;
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
