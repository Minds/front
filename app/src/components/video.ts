import { Component, View, ElementRef, ChangeDetectionStrategy } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { ROUTER_DIRECTIVES } from 'angular2/router';

import { Client } from '../services/api';
import { Material } from '../directives/material';
import { ScrollService } from '../services/ux/scroll';


@Component({
  selector: 'minds-video',
  inputs: [ '_src: src', '_autoplay: autoplay', '_loop: loop', '_muted: muted', 'controls', 'poster', 'guid' ],
  host: {
    //'(click)': 'onClick()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()'
    },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <video (click)="onClick()" preload="auto" allowfullscreen>
    </video>
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
    </div>
  `,
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, Material ]
})

export class MindsVideo{

  element : any;
  container : any;
  src : Array<any> = [];
  guid : string | number;

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
  loop : boolean = true;
  scroll_listener;


  constructor(_element : ElementRef, public scroll : ScrollService){
    this.container = _element.nativeElement;
    this.element = _element.nativeElement.getElementsByTagName("video")[0];
    this.scroll_listener = this.scroll.listenForView().subscribe((view) => {
      this.isVisible();
    });
  }

  ngOnInit(){
    this.isVisible();
    this.setUp();
  }

  set _src(value : any){
    this.src = value[0].uri;
    this.element.src = this.src;
  }

  set _muted(value : boolean){
    this.muted = value;
    this.element.muted = value;
  }

  set _autoplay(value : boolean){
    this.autoplay = value;
    this.element.autoplay = value;
  }

  set _loop(value : boolean){
    this.loop = value;
    this.element.loop = value;
  }

  setUp(){
    //this.element.addEventListener('play', (e)=>{
    //  console.log('got play event');
    //});
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
    this.seek_interval = setInterval(() => {
      this.seeked = (this.element.currentTime / this.element.duration) * 100;
      this.calculateElapsed();
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

  isVisible(){
    if(this.autoplay){
      this.getSeeker();
      return;
    }
    if(!this.guid)
      return;
      var bounds = this.element.getBoundingClientRect();
    if(bounds.top < this.scroll.view.clientHeight && bounds.top + (this.scroll.view.clientHeight / 2) >= 0){
      if(this.element.paused == true){
        //console.log('[video]:: playing '  + this.src);
        this.element.play();
      }
    } else {
      if(this.element.paused == false){
        this.element.muted = true;
        this.element.pause();
        //console.log('[video]:: pausing ' + this.src);
      }
    }
      //console.log('[video]: checking visibility');
  }

  ngOnDestroy(){
    clearInterval(this.seek_interval);
    if(this.scroll_listener)
      this.scroll.unListen(this.scroll_listener);
  }

}
