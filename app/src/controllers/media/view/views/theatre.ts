import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../../services/api';
import { SessionFactory } from '../../../../services/session';

@Component({
  selector: 'm-media-theatre',
  inputs: ['_object: object'],
  template: `
    <i class="material-icons left"
      (click)="prev()"
      [hidden]="!isAlbum()">
        keyboard_arrow_left
    </i>
    <div class="m-media-stage" *ngIf="object.subtype == 'image'"
      [class.m-media-stage--has-nav]="isAlbum()"
    >
      <img src="/fs/v1/thumbnail/{{object.guid}}/xlarge"/>
    </div>
    <div class="m-media-stage" *ngIf="object.subtype == 'video'"
      [class.m-media-stage--has-nav]="isAlbum()"
    >
      <minds-video
      [poster]="object.thumbnail_src"
	    [autoplay]="!object.monetized"
	    [muted]="false"
	    [src]="[{ 'uri': object.src['720.mp4'] }, { 'uri': object.src['360.mp4'] }]"
        [log]="object.guid"
        [playCount]="false"
        #player>
        <video-ads [player]="player" *ngIf="object.monetized"></video-ads>
      </minds-video>

    </div>
    <i class="material-icons right"
      (click)="next()"
      [hidden]="!isAlbum()">
        keyboard_arrow_right
    </i>
    <ng-content></ng-content>
  `
})

export class MediaTheatre {

  object: any = {};
  session = SessionFactory.build();

  constructor(public client: Client, public router: Router) {
  }

  set _object(value: any) {
    if (!value.guid)
      return;
    this.object = value;
  }

  prev() {
    var pos = this.object['album_children_guids'].indexOf(this.object.guid) - 1;
    //go from the top if less than 0
    if (pos <= 0)
      pos = this.object['album_children_guids'].length - 1;
    this.router.navigate(['/media', this.object['album_children_guids'][pos]]);
  }

  next() {
    var pos = this.object['album_children_guids'].indexOf(this.object.guid);
    //bump up if less than 0
    if (pos <= 0)
      pos = 1;
    //bump one up if we are in the same position as ourself
    if (this.object['album_children_guids'][pos] === this.object.guid)
      pos++;
    //reset back to 0 if we are are the end
    if (pos >= this.object['album_children_guids'].length)
      pos = 0;
    this.router.navigate(['/media', this.object['album_children_guids'][pos]]);
  }

  isAlbum() {
    return this.object.container_guid !== this.object.owner_guid
      && this.object.album_children_guids
      && this.object.album_children_guids.length > 1;
  }

}
