import { Component, Input } from '@angular/core';

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
  @Input('toggled') open: boolean = false;

  posts: any[] = [];
  media: any[] = [];

  session: Session = SessionFactory.build();

  @Input('type') type: BoostConsoleType;

  constructor(public client: Client) { }

  ngOnInit() {
    this.load();
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

  toggle() {
    this.open = !this.open;

    if (this.open) {
      this.load();
    }
  }

}
