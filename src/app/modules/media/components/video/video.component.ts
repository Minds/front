import { Component, ElementRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MindsVideoProgressBar } from './progress-bar/progress-bar.component';

import { Client } from '../../../../services/api';
import { ScrollService } from '../../../../services/ux/scroll';
import { MindsTorrentVideo } from './torrent-video.component';

@Component({
  selector: 'm-video',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()'
  },
  templateUrl: 'video.component.html',
})

export class MindsVideoComponent {

  @Input() guid: string | number;
  @Input() log: string | number;
  @Input() muted: boolean = false;
  @Input() poster: string = '';
  @Input() visibleplay: boolean = true;
  @Input() loop: boolean = true;

  @Output('finished') finished: EventEmitter<any> = new EventEmitter();

  @ViewChild('progressBar') progressBar: MindsVideoProgressBar;
  @ViewChild('torrentVideo') torrentVideo: MindsTorrentVideo;

  src: any[];
  @Input('src') set _src(src) {
    this.src = src;
    this.updateAvailableQualities();
  }

  torrent: any[];
  @Input('torrent') set _torrent(torrent) {
    this.torrent = torrent;
    this.updateAvailableQualities();
  }

  element: any;
  container: any;

  time: { minutes: any, seconds: any } = {
    minutes: '00',
    seconds: '00'
  };

  remaining: { minutes: any, seconds: any } | null = null;

  scroll_listener;
  transcoding: boolean = false;
  playedOnce: boolean = false;
  playCount: number = -1;
  playCountDisabled: boolean = false;

  torrentInfo: boolean = false;

  currentQuality: string;
  availableQualities: string[] = [];

  currentSrc: any;
  currentTorrent: any;

  constructor(
    public _element: ElementRef, 
    public scroll: ScrollService, 
    public client: Client
  ) { }

  ngOnInit() {
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

  ngAfterViewInit() {
    this.getElement();
    this.setUp();
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
    this.element = this.torrentVideo.getPlayer();
  }

  setUp() {
    if (!this.element) {
      return;
    }

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

  onMouseEnter() {
    this.progressBar.getSeeker();
    this.progressBar.enableKeyControls();
    this.element.addEventListener('dblclick', this.openFullScreen);
  }

  openFullScreen = (e) => {
    if (this.element.requestFullscreen) {
      this.element.requestFullscreen();
    } else if (this.element.msRequestFullscreen) {
      this.element.msRequestFullscreen();
    } else if (this.element.mozRequestFullScreen) {
      this.element.mozRequestFullScreen();
    } else if (this.element.webkitRequestFullscreen) {
      this.element.webkitRequestFullscreen();
    }
  };

  onMouseLeave() {
    this.progressBar.stopSeeker();
    this.progressBar.disableKeyControls();
    this.element.removeEventListener('dblclick', this.openFullScreen);
  }
  
  selectedQuality(quality) {
    const time = this.torrentVideo.getCurrentTime();

    this.currentQuality = quality;
    this.updateCurrentSrc();
    this.torrentVideo.resumeFrom(time);
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
      if (!this.torrentVideo.isPlaying()) {
        this.torrentVideo.play();
      }
    } else {
      if (this.torrentVideo.isPlaying()) {
        // this.element.muted = true;
        this.torrentVideo.pause();
      }
    }
  }

  toggleTorrentInfo() {
    this.torrentInfo = !this.torrentInfo;
  }

  ngOnDestroy() {
    if (this.scroll_listener)
      this.scroll.unListen(this.scroll_listener);
  }

  pause() {
    this.torrentVideo.pause();
  }

  play() {
    this.torrentVideo.play();
  }

  //

  updateAvailableQualities() {
    let qualities = [];

    if (this.src && this.src.length) {
      this.src.forEach(item => qualities.push(item.res));
    }

    if (this.torrent && this.torrent.length) {
      this.torrent.forEach(item => qualities.push(item.res));
    }

    this.availableQualities = qualities
      .filter((item, index, self) => self.indexOf(item) === index)
      .sort((a, b) => parseFloat(b) - parseFloat(a));

    if (!this.currentQuality) {
      this.currentQuality = this.availableQualities[0];
    }

    this.updateCurrentSrc();
  }

  updateCurrentSrc() {
    if (!this.currentQuality) {
      this.currentSrc = void 0;
      this.currentTorrent = void 0;
      return;
    }

    if (this.src && this.src.length) {
      this.currentSrc = this.src
        .find(item => item.res === this.currentQuality)
    }

    if (this.torrent && this.torrent.length) {
      this.currentTorrent = this.torrent
        .find(item => item.res === this.currentQuality)
    }
  }

}

export { VideoAds } from './ads.component';
