import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {Subscription} from "rxjs";

import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';

import { RecommendedService } from '../../components/video/recommended.service';

@Component({
  selector: 'm-media--theatre',
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
      <div *ngIf="counterSeconds > 0" class="m-media-theatre--next-countdown">
        <span> Loading the next video in <strong>{{counterLimit - counterSeconds}}</strong> seconds. <a (click)="cancelCountdown()"><strong>Cancel</strong></a>.</span>
      </div>
      <m-video
      [poster]="object.thumbnail_src"
	    [autoplay]="!object.monetized"
      [muted]="false"
      (finished)="loadNext()"
	    [src]="[{ 'uri': object.src['720.mp4'] }, { 'uri': object.src['360.mp4'] }]"
        [log]="object.guid"
        [playCount]="false"
        #player>
        <video-ads [player]="player" *ngIf="object.monetized"></video-ads>
      
      </m-video>

    </div>
    <i class="material-icons right"
      (click)="next()"
      [hidden]="!isAlbum()">
        keyboard_arrow_right
    </i>
    <ng-content></ng-content>
  `
})

export class MediaTheatreComponent {

  object: any = {};
  nextVideo: any = {};
  ticks: number;
  timerSubscribe: Subscription;
  counterSeconds: number = 0;
  counterLimit: number = 10;

  constructor(
    public session: Session,
    public client: Client, 
    public router: Router,
    private recommended: RecommendedService
  ) {
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

  loadNext() {
    this.nextVideo = this.recommended.getFirstRecommended();
    let timer = Observable.timer(2000,1000);
    this.timerSubscribe = timer.subscribe(t => this.tickerFunc(t));
  }

  tickerFunc(t) {
    this.ticks = parseInt(t);
    if (this.counterSeconds >= this.counterLimit) {
      this.cancelCountdown();
      this.router.navigate(['/media', this.nextVideo.guid]);
    } else {
      this.counterSeconds = this.counterSeconds + 1;
    }
  }

  cancelCountdown() {
    this.counterSeconds = 0;
    this.timerSubscribe.unsubscribe();
  }

  ngOnDestroy() {
    if (this.timerSubscribe) {
      this.timerSubscribe.unsubscribe();
    }
  }

}
