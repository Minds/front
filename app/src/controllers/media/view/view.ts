import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';

import { AttachmentService } from '../../../services/attachment';

@Component({
  moduleId: module.id,
  selector: 'm-media-view',
  templateUrl: 'view.html'
})

export class MediaView {

  minds;
  guid: string;
  entity: any = {};
  session = SessionFactory.build();
  inProgress: boolean = true;
  error: string = '';
  deleteToggle: boolean = false;

  theaterMode: boolean = false;

  menuOptions: Array<string> = ['edit', 'mute', 'feature', 'delete', 'report'];

  paramsSubscription: Subscription;

  constructor(
    public client: Client,
    public router: Router,
    public route: ActivatedRoute,
    public attachment: AttachmentService
  ) { }

  ngOnInit() {
    this.minds = window.Minds;

    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['guid']) {
        this.guid = params['guid'];
        this.load();
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  load(refresh: boolean = false) {
    this.inProgress = true;
    this.client.get('api/v1/media/' + this.guid, { children: false })
      .then((response: any) => {
        this.inProgress = false;
        if (response.entity.type !== 'object') {
          return;
        }
        if (response.entity)
          this.entity = response.entity;

      })
      .catch((e) => {
        this.inProgress = false;
        this.error = 'Sorry, there was problem.';
      });
  }

  delete() {
    this.client.delete('api/v1/media/' + this.guid)
      .then((response: any) => {
        this.router.navigate(['/discovery/owner']);
      })
      .catch(e => {
        alert((e && e.message) || 'Server error');
      });
  }

  getNext() {
    if (this.entity.container_guid === this.entity.owner_guid
      || !this.entity.album_children_guids
      || this.entity.album_children_guids.length <= 1) {
      return;
    }

    let pos = this.entity['album_children_guids'].indexOf(this.entity.guid);
    //bump up if less than 0
    if (pos <= 0)
      pos = 1;
    //bump one up if we are in the same position as ourself
    if (this.entity['album_children_guids'][pos] === this.entity.guid)
      pos++;
    //reset back to 0 if we are are the end
    if (pos >= this.entity['album_children_guids'].length)
      pos = 0;

    return this.entity['album_children_guids'][pos];
  }

  menuOptionSelected(option: string) {
    switch (option) {
      case 'edit':
        this.router.navigate(['/media/edit', this.entity.guid]);
        break;
      case 'delete':
        this.delete();
    }
  }

}
