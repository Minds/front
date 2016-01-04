import { Component, View, ElementRef } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

import { Client } from '../services/api';
import { Material } from '../directives/material';


@Component({
  selector: 'minds-video',
  inputs: [ '_src: src', '_autoplay: autoplay', '_loop: loop', '_muted: muted', 'controls', 'poster' ],
  host: {
    //'(click)': 'onClick()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()'
  }
})
@View({
  template: `
  <video (click)="onClick()" preload="metadata">
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
  </div>
  `,
  directives: [ CORE_DIRECTIVES, Material ]
})

export class MindsVideo{

  element : any;
  src : Array<any> = [];
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
  autoplay : boolean = true;
  loop : boolean = true;


  constructor(_element : ElementRef){
    this.element = _element.nativeElement.getElementsByTagName("video")[0];
  }

  set _src(value : any){
    this.src = value[0].uri;
    this.element.src = this.src;
    this.setUp();
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
    if(this.muted)
      this.element.muted = false;
    this.getSeeker();
  }

  onMouseLeave(){
    if(this.muted)
      this.element.muted = true;
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

  ngOnDestroy(){
    clearInterval(this.seek_interval);
  }

}
