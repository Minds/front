import { Component, ElementRef, Input, Output, ChangeDetectorRef, ChangeDetectionStrategy, EventEmitter, ViewChild } from '@angular/core';
import { MindsVideoProgressBar } from './progress-bar/progress-bar.component';

import { Client } from '../../../../services/api';
import { ScrollService } from '../../../../services/ux/scroll';
import { VideoAdsService } from './ads.service';

@Component({
  selector: 'm-video',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()'
  },
  templateUrl: 'video.component.html',
})

export class MindsVideoComponent {
  
  @ViewChild('progressBar') progressBar: MindsVideoProgressBar;
  
  @Output('finished') finished: EventEmitter<any> = new EventEmitter();

  element: any;
  container: any;
  @Input() guid: string | number;
  @Input() log: string | number;

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

  @Input() muted: boolean = false;
  @Input() visibleplay: boolean = true;
  @Input() loop: boolean = true;
  scroll_listener;
  transcoding: boolean = false;
  @Input() poster: string = '';
  playedOnce: boolean = false;
  playCount: number = -1;
  playCountDisabled: boolean = false;

  constructor(
    public _element: ElementRef, 
    public scroll: ScrollService, 
    private cd: ChangeDetectorRef, 
    public client: Client
  ) { }

  ngOnInit() {
    this.getElement();
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

          this.playCount = response.data;
        });
    }
  }

  src: Array<any> = [];
  @Input('src') set _src(src: any){
    this.src = src;
    this.getElement();
    this.element.load();
  }

  autoplay: boolean = false;
  @Input('autoplay') set _autoplay(value: boolean) {
    if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
      this.autoplay = false;
    } else {
      this.autoplay = value;
    }
  }

  @Input('playCount') set _playCount(value: any) {
    if (!value && value !== 0) {
      if (value === false) {
        this.playCountDisabled = true;
      }
      return;
    }

    this.playCount = value;
  }

  onError() {
    console.log('Error trying to reproduce video');
    this.client.get('api/v1/media/transcoding/' + this.guid)
      .then((response:any) => {
        this.transcoding = true || response.transcoding;
      });
  }

  getElement() {
    this.container = this._element.nativeElement;
    this.element = this._element.nativeElement.getElementsByTagName('video')[0];
  }

  setUp() {
    this.element.addEventListener('play', (e) => {
      this.addViewCount();
    });

    this.element.addEventListener("ended", (e) => {
      this.sendFinished();
    });
  }
  
  sendFinished(){
    this.finished.emit( true );
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

  onClick() {
    if (this.element.paused === false) {
      this.element.pause();
    } else {
      this.element.play();
    }
  }

  onMouseEnter() {
    this.progressBar.getSeeker();
    this.progressBar.enableKeyControls();
    this.element.addEventListener('dblclick', this.openFullScreen.bind(this));
  }

  openFullScreen(e){
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

  onMouseLeave() {
    this.progressBar.stopSeeker();
    this.progressBar.disableKeyControls();
  }
  
  selectedQuality(e){
    let time = this.element.currentTime;
    this.src = e.reorderedSrc;
    this.getElement();
    this.element.load();
    this.element.currentTime = time;
    this.element.play();
  }

  isVisible() {
    if (this.autoplay)
      return;
    if (!this.visibleplay)
      return;
    if (!this.guid)
      return;
    if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
      this.muted = false;
      return;
    }
    var bounds = this.element.getBoundingClientRect();
    if (bounds.top < this.scroll.view.clientHeight && bounds.top + (this.scroll.view.clientHeight / 2) >= 0) {
      if (this.element.paused === true) {
        this.element.play();
      }
    } else {
      if (this.element.paused === false) {
        this.element.muted = true;
        this.element.pause();
      }
    }
  }

  pause() {
    if (this.element.paused === false) {
      this.element.pause();
    }
  }

  ngOnDestroy() {
    if (this.scroll_listener)
      this.scroll.unListen(this.scroll_listener);
  }

}

export { VideoAds } from './ads.component';
