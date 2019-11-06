import {
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { MindsVideoProgressBar } from './progress-bar/progress-bar.component';
import { MindsVideoVolumeSlider } from './volume-slider/volume-slider.component';

import { Client } from '../../../../services/api';
import { ScrollService } from '../../../../services/ux/scroll';
import { MindsPlayerInterface } from './players/player.interface';
import { WebtorrentService } from '../../../webtorrent/webtorrent.service';
import {
  SOURCE_CANDIDATE_PICK_ZIGZAG,
  SourceCandidates,
} from './source-candidates';
import { FeaturesService } from '../../../../services/features.service';
import isMobile from '../../../../helpers/is-mobile';

@Component({
  selector: 'm-video',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '[class.clickable]': 'metadataLoaded',
  },
  templateUrl: 'video.component.html',
  animations: [
    trigger('fadeAnimation', [
      state(
        'in',
        style({
          visibility: 'visible',
          opacity: 1,
        })
      ),
      state(
        'out',
        style({
          visibility: 'hidden',
          opacity: 0,
        })
      ),
      transition('in <=> out', [animate('300ms ease-in')]),
    ]),
  ],
})
export class MindsVideoComponent implements OnDestroy {
  @Input() guid: string | number;
  @Input() log: string | number;
  @Input() muted: boolean = false;
  @Input() poster: string = '';
  @Input() isModal: boolean = false;
  @Input() shouldPlayInModal: boolean = false;

  @Output('finished') finished: EventEmitter<any> = new EventEmitter();

  @Output() videoMetadataLoaded: EventEmitter<any> = new EventEmitter();
  @Output() videoCanPlayThrough: EventEmitter<any> = new EventEmitter();
  @Output() mediaModalRequested: EventEmitter<any> = new EventEmitter();

  @ViewChild('progressBar', { static: false })
  progressBar: MindsVideoProgressBar;
  @ViewChild('volumeSlider', { static: false })
  volumeSlider: MindsVideoVolumeSlider;
  @ViewChild('player', { static: false }) playerRef: MindsPlayerInterface;

  src: any[];
  @Input('src') set _src(src) {
    this.src = src;

    if (this.initialized) {
      this.changeSources();
    }
  }

  torrent: any[];
  @Input('torrent') set _torrent(torrent) {
    this.torrent = torrent;

    if (this.initialized) {
      this.changeSources();
    }
  }

  scroll_listener;
  transcoding: boolean = false;
  playedOnce: boolean = false;
  playCount: number = -1;
  playCountDisabled: boolean = false;
  stageHover: boolean = false;
  showControls: boolean = false;
  stopSeekerTimeout: any = null;
  metadataLoaded: boolean = false;
  canPlayThrough: boolean = false;
  isFullscreen: boolean = false;
  isMobile: boolean = false;

  current: { type: 'torrent' | 'direct-http'; src: string };
  protected candidates: SourceCandidates = new SourceCandidates();

  torrentInfo: boolean = false;
  torrentEnabled: boolean = false;

  protected initialized: boolean = false;

  private availableQualities: string[] = [];
  private currentQuality: string = '';
  transcodingError = null;

  constructor(
    public scroll: ScrollService,
    public client: Client,
    protected webtorrent: WebtorrentService,
    protected cd: ChangeDetectorRef,
    protected featuresService: FeaturesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.torrentEnabled = this.webtorrent.isEnabled();

    this.changeSources();

    this.initialized = true;

    if (this.guid && !this.log) {
      this.log = this.guid;
    }

    if (!this.playCountDisabled && this.log && this.playCount === -1) {
      this.client
        .get(`api/v1/analytics/@counter/play/${this.log}`)
        .then((response: any) => {
          if (!response.data) {
            return;
          }

          this.playCount = response.data;
        });
    }
  }

  ngAfterViewInit() {
    this.detectChanges();
  }

  autoplay: boolean = false;
  @Input('autoplay') set _autoplay(value: boolean) {
    if (
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPod/i)
    ) {
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

  onError({ player, e }: { player?; e? } = {}) {
    console.log('Received error when trying to reproduce video', e, player);

    setTimeout(() => this.fallback(), 0);
  }

  onPlay() {
    this.addViewCount();
  }

  onEnd() {
    this.sendFinished();
  }

  onPause() {}

  sendFinished() {
    this.finished.emit(true);
  }

  addViewCount() {
    if (!this.log || this.playedOnce) {
      return;
    }

    this.client.put('api/v1/analytics/play/' + this.log).then(() => {
      if (!this.playCountDisabled) {
        this.playCount++;
      }
    });
    this.playedOnce = true;
  }

  onMouseEnter() {
    if (this.shouldPlayInModal && this.featuresService.has('media-modal')) {
      return;
    }
    if (this.videoMetadataLoaded) {
      this.progressBar.getSeeker();
      this.progressBar.enableKeyControls();
      this.showControls = true;
    }
  }

  onMouseLeave() {
    if (
      this.featuresService.has('media-modal') &&
      (this.stageHover || this.shouldPlayInModal)
    ) {
      return;
    }

    clearTimeout(this.stopSeekerTimeout);
    this.stopSeekerTimeout = setTimeout(() => {
      this.progressBar.stopSeeker();
    }, 300);

    this.progressBar.disableKeyControls();
    this.showControls = false;
  }

  selectedQuality(quality) {
    const player = this.playerRef.getPlayer();

    const time = player ? player.currentTime : 0;
    this.playerRef.pause();

    this.currentQuality = quality;
    this.reorderSourcesBasedOnQuality();
    this.changeSources();

    // Update
    this.detectChanges();

    setTimeout(() => this.playerRef.resumeFromTime(time), 0);
  }

  // isVisible() {
  //   if (this.autoplay)
  //     return;
  //   // if (!this.visibleplay)
  //   //   return;
  //   if (!this.guid)
  //     return;
  //   if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
  //     this.muted = false;
  //     return;
  //   }
  //   /*var bounds = this.element.getBoundingClientRect();
  //   if (bounds.top < this.scroll.view.clientHeight && bounds.top + (this.scroll.view.clientHeight / 2) >= 0) {
  //     if (!this.torrentVideo.isPlaying()) {
  //       this.torrentVideo.play();
  //     }
  //   } else {
  //     if (this.torrentVideo.isPlaying()) {
  //       // this.element.muted = true;
  //       this.torrentVideo.pause();
  //     }
  //   }*/
  // }

  toggleTorrentInfo() {
    this.torrentInfo = !this.torrentInfo;
  }

  ngOnDestroy() {
    if (this.scroll_listener) this.scroll.unListen(this.scroll_listener);

    if (this.stopSeekerTimeout) {
      clearTimeout(this.stopSeekerTimeout);
    }
  }

  pause() {
    this.playerRef.pause();
  }

  play() {
    this.playerRef.play();
  }

  toggle() {
    this.playerRef.toggle();
  }

  loadedMetadata() {
    const dimensions = {
      width: this.playerRef.getPlayer().videoWidth,
      height: this.playerRef.getPlayer().videoHeight,
    };
    this.metadataLoaded = true;
    this.videoMetadataLoaded.emit({ dimensions: dimensions });
  }

  onCanPlayThrough() {
    this.canPlayThrough = true;
    this.videoCanPlayThrough.emit();
  }

  // Sources
  async fallback() {
    this.candidates.setAsBlacklisted(this.current.type, this.current.src);
    const success = this.pickNextBestSource();

    if (!success) {
      try {
        let response: any = await this.client.get(
          `api/v1/media/transcoding/${this.guid}`
        );
        this.transcoding = response.transcoding;
      } catch (e) {
        this.transcodingError = e.error;
      }
    }

    this.detectChanges();

    setTimeout(() => {
      this.progressBar.bindToElement();
      this.volumeSlider.bindToElement();
      this.playerRef.resumeFromTime(0);
    }, 0);
  }

  changeSources() {
    this.candidates.empty();

    if (this.torrent && this.torrentEnabled) {
      const sources = this.torrent.map(s => s.key);
      this.candidates.setSource('torrent', sources);
    }

    if (this.src) {
      const sources = this.src.map(s => s.uri);
      this.candidates.setSource('direct-http', sources);
    }

    this.updateAvailableQualities();
    return this.pickNextBestSource();
  }

  pickNextBestSource() {
    const bestSource = this.candidates.pick(
      ['torrent', 'direct-http'],
      SOURCE_CANDIDATE_PICK_ZIGZAG
    );

    if (!bestSource) {
      // Keep the last player active
      return false;
    }

    this.current = {
      type: bestSource.type,
      src: bestSource.value,
    };

    return !!this.current;
  }

  // Qualities

  updateAvailableQualities() {
    const qualities = [];

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
  }

  reorderSourcesBasedOnQuality() {
    // Torrent
    if (this.torrent && this.torrent.length > 0) {
      const torrentI: number = this.torrent.findIndex(
        s => s.res === this.currentQuality
      );

      if (torrentI > -1) {
        this.torrent.unshift(...this.torrent.splice(torrentI, 1));
      }
    }

    // Src
    if (this.src && this.src.length > 0) {
      const srcI: number = this.src.findIndex(
        s => s.res === this.currentQuality
      );

      if (srcI > -1) {
        this.src.unshift(...this.src.splice(srcI, 1));
      }
    }
  }

  // Prevent extra toggles from bubbling up when click control bar that overlays player
  controlBarToggle($event) {
    $event.stopPropagation();
    this.toggle();
  }

  clickedVideo() {
    // if (!this.metadataLoaded) {
    //   return;
    // }

    const isNotTablet = Math.min(screen.width, screen.height) < 768;

    if (isMobile() && isNotTablet) {
      this.isMobile = true;
      this.toggle();
      return;
    }

    if (this.shouldPlayInModal && this.featuresService.has('media-modal')) {
      this.mediaModalRequested.emit();
      return;
    }

    this.toggle();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  // * FULLSCREEN * --------------------------------------------------------------------------------
  // Listen for fullscreen change event in case user enters/exits full screen without clicking button
  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  onFullscreenChange(event) {
    if (
      !document.fullscreenElement &&
      !document['webkitFullscreenElement'] &&
      !document['mozFullScreenElement'] &&
      !document['msFullscreenElement']
    ) {
      this.isFullscreen = false;
    } else {
      this.isFullscreen = true;
    }
  }

  toggleFullscreen($event) {
    // This will only work on the main video on a media page (not comment attachments)
    // TODO: make this work on pages with more than one m-video (i.e. feeds)
    const elem = document.querySelector('m-video');

    // If fullscreen is not already enabled
    if (
      !document['fullscreenElement'] &&
      !document['webkitFullscreenElement'] &&
      !document['mozFullScreenElement'] &&
      !document['msFullscreenElement']
    ) {
      // Request full screen
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem['webkitRequestFullscreen']) {
        elem['webkitRequestFullscreen']();
      } else if (elem['mozRequestFullScreen']) {
        elem['mozRequestFullScreen']();
      } else if (elem['msRequestFullscreen']) {
        elem['msRequestFullscreen']();
      }
      this.isFullscreen = true;
      return;
    }

    // If fullscreen is already enabled, exit it
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document['webkitExitFullscreen']) {
      document['webkitExitFullscreen']();
    } else if (document['mozCancelFullScreen']) {
      document['mozCancelFullScreen']();
    } else if (document['msExitFullscreen']) {
      document['msExitFullscreen']();
    }
    this.isFullscreen = false;
  }
}

export { VideoAds } from './ads.component';
