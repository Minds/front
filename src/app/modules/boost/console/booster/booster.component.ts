import { Component, ComponentFactoryResolver, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BoostConsoleType } from '../console.component';
import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { PosterComponent } from '../../../newsfeed/poster/poster.component';

@Component({
  moduleId: module.id,
  selector: 'm-boost-console-booster',
  templateUrl: 'booster.component.html'
})
export class BoostConsoleBooster {

  inProgress: boolean = false;
  loaded: boolean = false;

  posts: any[] = [];
  media: any[] = [];

  @Input('type') type: BoostConsoleType;

  componentRef;
  componentInstance: PosterComponent;

  @ViewChild('poster', { read: ViewContainerRef }) poster: ViewContainerRef;

  constructor(public client: Client,
              public session: Session,
              private route: ActivatedRoute,
              private _componentFactoryResolver: ComponentFactoryResolver,) {
  }

  ngOnInit() {
    this.route.parent.url.subscribe(segments => {
      this.type = <BoostConsoleType>segments[0].path;
      this.load();
    });
  }

  load(refresh?: boolean) {
    if (this.inProgress) {
      return Promise.resolve(false);
    }

    if (!refresh && this.loaded) {
      return Promise.resolve(true);
    }

    this.inProgress = true;

    let promises = [
      this.client.get('api/v1/newsfeed/personal'),
      this.client.get('api/v1/entities/owner')
    ];

    return Promise.all(promises)
      .then((responses: any[]) => {
        this.loaded = true;
        this.inProgress = false;

        this.posts = responses[0].activity || [];
        this.media = responses[1].entities || [];
        // this.posts = [];
        // this.media = [];
        this.loadComponent();
      })
      .catch(e => {
        this.inProgress = false;
        return false;
      });
  }

  loadComponent() {
    this.poster.clear();
    if (
      ((this.type === 'offers' || this.type === 'newsfeed') && this.posts.length === 0)
      || (this.type === 'content' && this.media.length === 0)) {


      const componentFactory = this._componentFactoryResolver.resolveComponentFactory(PosterComponent);

      this.componentRef = this.poster.createComponent(componentFactory);
      this.componentInstance = this.componentRef.instance;

      this.componentInstance.load.subscribe(()=> {
        this.load();
      });
    }
  }
}
