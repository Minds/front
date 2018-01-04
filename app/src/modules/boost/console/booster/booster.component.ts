import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BoostConsoleType } from '../console.component';
import { Client } from '../../../../services/api';
import { Session, SessionFactory } from '../../../../services/session';

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

  constructor(
    public client: Client,
    public session: Session,
    private route: ActivatedRoute,
  ) { }

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
      })
      .catch(e => {
        this.inProgress = false;
        return false;
      });
  }
}
