import { Component, Input, Output, EventEmitter, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'm-video--progress-bar',
  templateUrl: 'progress-bar.component.html'
})

export class MindsVideoProgressBar {
  @Input('element') element: any;
  time: { minutes: any, seconds: any } = {
    minutes: '00',
    seconds: '00'
  };
  elapsed: { minutes: any, seconds: any } = {
    minutes: '00',
    seconds: '00'
  };
  remaining: { minutes: any, seconds: any } | null = null;
  seek_interval;
  seeked: number = 0;
  keyPressListener: any;
  duration: number = 0;

  constructor(private cd: ChangeDetectorRef, public _element: ElementRef) {
  }

  ngOnInit() {
    this.keyPressListener = this.executeControl.bind(this);
    this.element.addEventListener('loadedmetadata', (e) => {
      
      this.duration = this.element.duration;
      this.calculateTime();
    });
  }

  calculateTime() {
    var seconds = this.duration;
    this.time.minutes = Math.floor(seconds / 60);
    if (parseInt(this.time.minutes) < 10)
      this.time.minutes = '0' + this.time.minutes;

    this.time.seconds = Math.floor(seconds % 60);
    if (parseInt(this.time.seconds) < 10)
      this.time.seconds = '0' + this.time.seconds;
  }

  calculateElapsed() {
    var seconds = this.element.currentTime;
    this.elapsed.minutes = Math.floor(seconds / 60);
    if (parseInt(this.elapsed.minutes) < 10)
      this.elapsed.minutes = '0' + this.elapsed.minutes;

    this.elapsed.seconds = Math.floor(seconds % 60);
    if (parseInt(this.elapsed.seconds) < 10)
      this.elapsed.seconds = '0' + this.elapsed.seconds;
  }

  calculateRemaining() {
    if (!this.duration || this.element.paused) {
      this.remaining = null;
      return;
    }

    var seconds = this.duration - this.element.currentTime;
    this.remaining = {seconds : 0, minutes : 0};
    this.remaining.minutes = Math.floor(seconds / 60);
    if (parseInt(this.remaining.minutes) < 10)
      this.remaining.minutes = '0' + this.remaining.minutes;

    this.remaining.seconds = Math.floor(seconds % 60);
    if (parseInt(this.remaining.seconds) < 10)
      this.remaining.seconds = '0' + this.remaining.seconds;
  }


  seek(e) {
    e.preventDefault();
    var seeker = e.target;
    var seek = e.offsetX / seeker.offsetWidth;
    var seconds = this.seekerToSeconds(seek);
    this.element.currentTime = seconds;
  }

  seekerToSeconds(seek) {
    var duration = this.element.duration;
    return duration * seek;
  }

  getSeeker() {
    if (this.seek_interval)
      clearInterval(this.seek_interval);
    this.seek_interval = setInterval(() => {
      this.seeked = (this.element.currentTime / this.element.duration) * 100;
      this.calculateElapsed();
      this.calculateRemaining();
      this.cd.markForCheck();
    }, 100);
  }

  stopSeeker() {
    clearInterval(this.seek_interval);
  }

  enableKeyControls(){
    window.removeEventListener('keydown', this.keyPressListener, true);
    window.addEventListener('keydown', this.keyPressListener, true);
  }

  disableKeyControls(){
    window.removeEventListener('keydown', this.keyPressListener, true);
  }

  togglePause() {
    if (this.element.paused === false) {
      this.element.pause();
    } else {
      this.element.play();
    }
  }

  ngOnDestroy() {
    clearInterval(this.seek_interval);
  }

  moveToTime(offset){
    this.element.currentTime = this.element.currentTime + offset;
  }

  executeControl(e){
    e.preventDefault();
    switch(e.keyCode){
      case 39:
        this.moveToTime(2);
        break;
      case 37:
        this.moveToTime(-2);
        break;
      case 32:
        this.togglePause();
        break
    }
  }
}
