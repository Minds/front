import { Component, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { Client } from '../../services/api';
import { Material } from '../../directives/material';
import { ScrollService } from '../../services/ux/scroll';
import { VideoAdsService } from './ads-service';

@Component({
  selector: 'minds-video',
  inputs: [ 'src', '_autoplay: autoplay', '_visibleplay: visibleplay', '_loop: loop', '_muted: muted', 'controls', 'poster', 'guid', 'log', '_playCount: playCount' ],
  host: {
    //'(click)': 'onClick()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()'
    },
  //changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <video (click)="onClick()" preload="none" [poster]="poster" allowfullscreen [muted]="muted" [loop]="loop" [autoplay]="autoplay">
      <source [src]="s.uri" *ngFor="let s of src">
    </video>
    <ng-content></ng-content>
    <div class="minds-video-bar-min">
      {{time.minutes}}:{{time.seconds}}
    </div>
    <div class="minds-video-bar-full">
      <i class="material-icons" [hidden]="!element.paused" (click)="onClick()">play_arrow</i>
      <i class="material-icons" [hidden]="element.paused" (click)="onClick()">pause</i>
      <span id="seeker" class="progress-bar" (click)="seek($event)">
        <bar class="progress" [ngStyle]="{ 'width': seeked + '%'}"></bar>
        <bar class="total"></bar>
      </span>
      <span class="progress-stamps">{{elapsed.minutes}}:{{elapsed.seconds}}/{{time.minutes}}:{{time.seconds}}</span>
      <i class="material-icons" [hidden]="element.muted" (click)="element.muted = true">volume_up</i>
      <i class="material-icons" [hidden]="!element.muted" (click)="element.muted = false">volume_off</i>
      <a class="material-icons m-video-full-page mdl-color-text--white"
        *ngIf="guid"
        [routerLink]="['/Archive-View', {guid: guid}]"
        target="_blank"
        (click)="element.pause()">
        lightbulb_outline
      </a>
      <i class="material-icons" (click)="openFullScreen()">tv</i>
      <!--<span class="m-play-count" *ngIf="playCount > -1">
        <i class="material-icons">ondemand_video</i>
        <span>{{ playCount }}</span>
      </span>-->
    </div>
  `,
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, Material ]
})

export class MindsVideo{

  element : any;
  container : any;
  src : Array<any> = [];
  guid : string | number;
  log : string | number;

  time : { minutes: any, seconds: any } = {
    minutes: '00',
    seconds: '00'
  }
  elapsed : { minutes: any, seconds: any } = {
    minutes: '00',
    seconds: '00'
  }
  seek_interval;
  seeked : number = 0;

  muted : boolean = true;
  autoplay : boolean = false;
  visibleplay : boolean = true;
  wasvisible : boolean = false;
  loop : boolean = true;
  scroll_listener;
  poster:string = '';

  playedOnce: boolean = false;
  playCount: number = -1;
  playCountDisabled: boolean = false;

  constructor(public _element : ElementRef, public scroll : ScrollService, private cd: ChangeDetectorRef, public client: Client){

  }

  ngOnInit(){
    this.container = this._element.nativeElement;
    this.element = this._element.nativeElement.getElementsByTagName("video")[0];
    this.scroll_listener = this.scroll.listenForView().subscribe((view) => {
      this.isVisible();
    });
    this.isVisible();
    this.setUp();

    if (this.guid && !this.log) {
      this.log = this.guid;
    }

    if (!this.playCountDisabled && this.log && this.playCount === -1) {
      this.client.get(`api/v1/analytics/@counter/play/${this.log}`)
      .then((response: any) => {
        if (!response.data) {
          return;
        }

        this.playCount = response.data
      })
    }
  }

  //set _src(value : any){
    //this.src = value[0].uri;
    //this.element.src = this.src;
  //}

  set _muted(value : boolean){
    this.muted = value;
    //this.element.muted = value;
  }

  set _autoplay(value : boolean){
    if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
      this.autoplay = false;
    } else {
      this.autoplay = value;
    }
    //this.element.autoplay = value;
  }

  set _loop(value : boolean){
    this.loop = value;
    //this.element.loop = value;
  }

  set _visibleplay(value : boolean){
    this.visibleplay = value;
  }

  set _playCount(value: any) {
    if (!value && value !== 0) {
      if (value === false) {
        this.playCountDisabled = true;
      }
      return;
    }

    this.playCount = value;
  }

  setUp(){
    this.element.addEventListener('play', (e)=>{
      this.addViewCount();
    });
    //this.element.addEventListener('error', (e)=>{
    //  console.log('got error event', e);
    //});
    this.element.addEventListener('loadedmetadata', (e) => {
      this.calculateTime();
    });
    //this.element.addEventListener('onprogress', (e) => {
    //  console.log('progress', e);
    //});
    //this.getSeeker();
  }

  addViewCount() {
    if (!this.log || this.playedOnce) {
      return;
    }

    this.client.put('api/v1/analytics/play/' + this.log)
    .then(() => {
      if (!this.playCountDisabled) {
        this.playCount++;
      }
    });
    this.playedOnce = true;
  }

  calculateTime(){
    var seconds = this.element.duration;
    this.time.minutes = Math.floor(seconds / 60);
    if(parseInt(this.time.minutes) < 10)
      this.time.minutes = "0" + this.time.minutes;

    this.time.seconds = Math.floor(seconds % 60);
    if(parseInt(this.time.seconds) < 10)
      this.time.seconds = "0" + this.time.seconds;
  }

  calculateElapsed(){
    var seconds = this.element.currentTime;
    this.elapsed.minutes = Math.floor(seconds / 60);
    if(parseInt(this.elapsed.minutes) < 10)
      this.elapsed.minutes = "0" + this.elapsed.minutes;

    this.elapsed.seconds = Math.floor(seconds % 60);
    if(parseInt(this.elapsed.seconds) < 10)
      this.elapsed.seconds = "0" + this.elapsed.seconds;
  }

  onClick(){
    console.log(this.element.paused)
    if(this.element.paused == false){
      this.element.pause();
    } else {
      this.element.play();
    }
  }

  onMouseEnter(){
    //if(this.muted)
    //  this.element.muted = false;
    this.getSeeker();
  }

  onMouseLeave(){
    //if(this.muted)
    //  this.element.muted = true;
    this.stopSeeker();
  }

  seek(e){
    e.preventDefault();
    var seeker = e.target;
    var seek = e.offsetX / seeker.offsetWidth;
    var seconds = this.seekerToSeconds(seek);
    this.element.currentTime = seconds;
  }

  seekerToSeconds(seek){
    var duration = this.element.duration;
    console.log('seeking to ', duration * seek);
    return duration * seek;
  }

  getSeeker(){
    if(this.seek_interval)
      clearInterval(this.seek_interval);
    this.seek_interval = setInterval(() => {
      this.seeked = (this.element.currentTime / this.element.duration) * 100;
      this.calculateElapsed();
      this.cd.markForCheck();
    }, 100);
  }

  stopSeeker(){
    clearInterval(this.seek_interval);
  }

  openFullScreen(){
    //this._element.nativeElement.requestFullscreen();
    if (this.element.requestFullscreen) {
      this.element.requestFullscreen();
    } else if (this.element.msRequestFullscreen) {
      this.element.msRequestFullscreen();
    } else if (this.element.mozRequestFullScreen) {
      this.element.mozRequestFullScreen();
    } else if (this.element.webkitRequestFullscreen) {
      this.element.webkitRequestFullscreen();
    }
  }
  
  wasFrameVisible(){
    return this.wasvisible;
  }

  isFrameVisible(){
    let visiblenow = (bounds.top < this.scroll.view.clientHeight && bounds.top + (this.scroll.view.clientHeight / 2) >= 0);
    this.wasvisible = visiblenow;
    return visiblenow;
  }

  hasFrameBecomeVisible(){
    //function order is important
    return (!(this.wasFrameVisible()) && this.isFrameVisible());
  }

  hasFrameBecomeInvisible(){
    return (this.wasFrameVisible() && !this.isFrameVisible());
  }
  
  isVisible(){
    if(this.autoplay)
      return;
    if(!this.visibleplay)
      return;
    if(!this.guid)
      return;
      var bounds = this.element.getBoundingClientRect();
    if(this.hasFrameBecomeVisible()){
      //stops this section from firing 
      if(this.element.paused == true){
        //console.log('[video]:: playing '  + this.src);
        this.element.play();
      }
    } else if(this.hasFrameBecomeInvisible()) {
      if(this.element.paused == false){
        this.element.muted = true;
        this.element.pause();
        //console.log('[video]:: pausing ' + this.src);
      }
    } else {
      //Frame is eaither in view out out of view, leave alone to play or be paused
    }
      //console.log('[video]: checking visibility');
  }

  ngOnDestroy(){
    clearInterval(this.seek_interval);
    if(this.scroll_listener)
      this.scroll.unListen(this.scroll_listener);
  }

}

export { VideoAds } from './ads';
