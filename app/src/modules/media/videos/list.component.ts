import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { MindsTitle } from '../../../services/ux/title';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { ContextService } from '../../../services/context.service';
import { OverlayModalService } from '../../../services/ux/overlay-modal';

import { Poster } from '../../legacy/controllers/newsfeed/poster/poster';

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
  ) { }

  ngOnInit() {
    this.title.setTitle('Videos');

    this.paramsSubscription = this.route.params.subscribe((params) => {
      if (params['filter']) {
        this.filter = params['filter'];
        this.owner = '';

        switch (this.filter) {
          case 'all':
            break;
          case 'top':
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
      this.entities = [];
      this.load(true);
    });
  }

  showPoster() {
    const creator = this.overlayModal.create(Poster, {}, { 
      class: 'm-overlay-modal--no-padding m-overlay-modal--top m-overlay-modal--medium'
    });
    creator.present();
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  load(refresh: boolean = false) {

    if (this.inProgress)
      return false;

    if (refresh)
      this.offset = '';

    this.inProgress = true;

    this.client.get('api/v1/entities/' + this.filter + '/videos/' + this.owner, {
      limit: 12,
      offset: this.offset
    })
      .then((data: any) => {
        if (!data.entities) {
          this.moreData = false;
          this.inProgress = false;
          return false;
        }

        if (refresh) {
          this.entities = data.entities;
        } else {
          if (this.offset)
            data.entities.shift();
          this.entities = this.entities.concat(data.entities);
        }

        console.log(this.entities);

        this.offset = data['load-next'];
        this.inProgress = false;
      })
      .catch((e) => {
        this.inProgress = false;
      });
  }

}
