import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output,
  ViewChild
} from '@angular/core';
import { MindsPlayerInterface } from './player.interface';
import { WebtorrentService } from '../../../../webtorrent/webtorrent.service';
import { Client } from '../../../../../services/api/client';
import base64ToBlob from '../../../../../helpers/base64-to-blob';

@Component({
  moduleId: module.id,
  selector: 'm-video--torrent-player',
  templateUrl: 'torrent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MindsVideoTorrentPlayer implements OnInit, AfterViewInit, OnDestroy, MindsPlayerInterface {
  @ViewChild('player') player: ElementRef;

  @Input() muted: boolean = false;
  @Input() poster: string = '';
  @Input() autoplay: boolean = false;

  src: string;
  @Input('src') set _src(src: string) {
    this.src = src;

    if (this.initialized) {
      this.removeTorrent();

      setTimeout(() => {
        this.loadTorrent();
      }, 0);
    }
  }

  @Output() onPlay: EventEmitter<HTMLVideoElement> = new EventEmitter();
  @Output() onPause: EventEmitter<HTMLVideoElement> = new EventEmitter();
  @Output() onEnd: EventEmitter<HTMLVideoElement> = new EventEmitter();
  @Output() onError: EventEmitter<{ player, e }> = new EventEmitter();

  initialized: boolean = false;
  loading: boolean = false;

  protected torrentId: string;
  protected torrentReady: boolean = false;

  protected torrentInfo = {
    progress: 0,
    peers: 0,
    ul: 0,
    dl: 0,
    ulspeed: 0,
    dlspeed: 0,
  };
  protected infoTimer$: any;

  protected deferredResumeFromTime: number;

  constructor(
    protected cd: ChangeDetectorRef,
    protected client: Client,
    protected webtorrent: WebtorrentService,
  ) { }

  protected _emitPlay = () => this.onPlay.emit(this.getPlayer());
  protected _emitPause = () => this.onPause.emit(this.getPlayer());
  protected _emitEnd = () => this.onEnd.emit(this.getPlayer());
  protected _emitError = e => this.onError.emit({ player: this.getPlayer(), e});

  protected _canPlayThrough = () => {
    this.loading = false;
    this.detectChanges();
  };

  protected _dblClick = () => {
    this.requestFullScreen();
  };

  protected _onError = e => {
    this.loading = false;
    this.detectChanges();

    this._emitError(e);
  };

  protected _onPlayerError = e => {
    if (!e.target.error) {
      // Poster error
      return;
    }

    this.loading = false;
    this.detectChanges();

    this._emitError(e);
  };

  protected _refreshInfo = () => {
    if (!this.torrentId || !this.torrentReady || !this.webtorrent.get(this.torrentId)) {
      this.torrentInfo = {
        progress: 0,
        peers: 0,
        ul: 0,
        dl: 0,
        ulspeed: 0,
        dlspeed: 0,
      };
    } else {
      const torrent = this.webtorrent.get(this.torrentId);

      this.torrentInfo = {
        progress: torrent.progress,
        peers: torrent.numPeers,
        ul: torrent.uploaded,
        dl: torrent.downloaded,
        ulspeed: torrent.uploadSpeed,
        dlspeed: torrent.downloadSpeed,
      };
    }

    this.detectChanges();
  };

  ngOnInit() {
    const player = this.getPlayer();
    player.addEventListener('dblclick', this._dblClick);
    player.addEventListener('playing', this._emitPlay);
    player.addEventListener('pause', this._emitPause);
    player.addEventListener('ended', this._emitEnd);
    player.addEventListener('error', this._onPlayerError);
    player.addEventListener('canplaythrough', this._canPlayThrough);

    this.infoTimer$ = setInterval(this._refreshInfo, 1000);
  }

  ngAfterViewInit() {
    this.initialized = true;

    if (this.autoplay) {
      this.play();
    }
  }

  ngOnDestroy() {
    if (this.infoTimer$) {
      clearInterval(this.infoTimer$);
    }

    this.removeTorrent();

    const player = this.getPlayer();

    if (player) {
      player.removeEventListener('dblclick', this._dblClick);
      player.removeEventListener('playing', this._emitPlay);
      player.removeEventListener('pause', this._emitPause);
      player.removeEventListener('ended', this._emitEnd);
      player.removeEventListener('error', this._onPlayerError);
      player.removeEventListener('canplaythrough', this._canPlayThrough);
    }
  }

  getPlayer(): HTMLVideoElement {
    return this.player.nativeElement;
  }

  play() {
    const player = this.getPlayer();

    try {
      if (this.torrentReady) {
        player.play();
      } else {
        this.loadTorrent();
      }
    } catch (e) {
      console.error(e);
    }
  }

  pause() {
    const player = this.getPlayer();

    try {
      player.pause();
    } catch (e) {
      console.error(e);
    }
  }

  toggle() {
    const player = this.getPlayer();

    if (player.paused) {
      this.play()
    } else {
      this.pause();
    }
  }

  resumeFromTime(time: number = 0) {
    const player = this.getPlayer();

    try {
      if (this.torrentReady) {
        player.currentTime = time;
        this.play();
      } else {
        this.deferredResumeFromTime = time;

        if (!this.loading) {
          this.loadTorrent();
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  isPlaying() {
    const player = this.getPlayer();

    return !player.paused;
  }

  isLoading() {
    return this.loading;
  }

  requestFullScreen() {
    const player: any = this.getPlayer();

    if (player.requestFullscreen) {
      player.requestFullscreen();
    } else if (player.msRequestFullscreen) {
      player.msRequestFullscreen();
    } else if (player.mozRequestFullScreen) {
      player.mozRequestFullScreen();
    } else if (player.webkitRequestFullscreen) {
      player.webkitRequestFullscreen();
    }
  }

  getInfo() {
    return this.torrentInfo;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  //

  async loadTorrent() {
    if (this.loading) {
      return;
    } else if (this.torrentReady) {
      this.play();
      return;
    }

    this.removeTorrent();

    this.loading = true;
    this.torrentReady = false;
    this.detectChanges();

    let torrentFile;
    let infoHash;
    let webSeed;
    try {
      const response: any = await this.client.get(`api/v2/media/magnet/${this.src}`);

      torrentFile = base64ToBlob(response.encodedTorrent);
      infoHash = response.infoHash;
      webSeed = response.httpSrc;
    } catch (e) {
      this.loading = false;
      this.detectChanges();

      console.error('[TorrentVideo] Magnet download', e);
      this._emitError(e);

      return;
    }

    try {
      this.torrentId = infoHash;
      const torrent = await this.webtorrent.add(torrentFile, infoHash);

      if (webSeed) {
        torrent.addWebSeed(webSeed);
      }

      this.loading = false;
      this.detectChanges();

      const file = torrent.files.find(file => file.name.endsWith('.mp4'));

      if (!file) {
        this.loading = false;
        this.detectChanges();

        this.webtorrent.remove(this.torrentId);
        this.torrentId = void 0;

        console.error('[TorrentVideo] Video file not found');
        this._emitError('E_NO_FILE');
        return;
      }

      file.renderTo(this.getPlayer(), err => {
        if (err) {
          this.loading = false;
          this.detectChanges();

          this.webtorrent.remove(this.torrentId);
          this.torrentId = void 0;

          console.error('[TorrentVideo] Video render', err);
          this._emitError(err);
          return;
        }

        this.loading = false;
        this.torrentReady = true;
        this.detectChanges();

        if (typeof this.deferredResumeFromTime) {
          const time = this.deferredResumeFromTime;
          this.deferredResumeFromTime = void 0;

          this.resumeFromTime(time);
        }
      });

    } catch (e) {
      this.loading = false;
      this.detectChanges();

      console.error('[TorrentVideo] Webtorrent general error', e);
      this._emitError(e);
    }
  }

  removeTorrent() {
    if (this.torrentId) {
      this.webtorrent.remove(this.torrentId);
      this.torrentId = void 0;
      this.loading = false;
      this.torrentReady = false;
    }
  }
}
