import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { Client } from '../../../../services/api/client';
import { WebtorrentService } from '../../../webtorrent/webtorrent.service';
import base64ToBlob from '../../../../helpers/base64-to-blob';

@Component({
  moduleId: module.id,
  selector: 'm-torrent-video',
  templateUrl: 'torrent-video.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MindsTorrentVideo implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('player') player: ElementRef;

  @Input() muted: boolean = false;
  @Input() poster: string = '';
  @Input() autoplay: boolean = false;

  @Output('error') errorEmitter: EventEmitter<any> = new EventEmitter();
  @Output('refresh') refreshEmitter: EventEmitter<any> = new EventEmitter();

  src: any;
  @Input('src') set _src(value) {
    this.src = value;

    if (this.initialized && !this.torrentEnabled) {
      this.refresh();
    }
  }

  torrentEnabled: boolean = false;
  torrentSrc: any;
  @Input('torrent') set _torrentSrc(value) {
    this.torrentSrc = value;
    this.torrentEnabled = value && this.webtorrent.isSupported();

    if (this.initialized && this.torrentEnabled) {
      this.refresh();
    }
  }

  loading: boolean = false;
  currentTorrent: string;

  info = {
    progress: 0,
    peers: 0,
    ul: 0,
    dl: 0,
    ulspeed: 0,
    dlspeed: 0,
  };

  protected initialized: boolean = false;
  protected paused: boolean = true;
  protected torrenting: boolean = false;
  protected infoTimer$: any;

  protected resumeFromTime: number;

  constructor(
    protected cd: ChangeDetectorRef,
    protected client: Client,
    protected webtorrent: WebtorrentService,
  ) { }

  // Lifecycle

  ngOnInit() {
    this.infoTimer$ = setInterval(() => this.refreshInfo(), 1000);
  }

  ngAfterViewInit() {
    this.refresh();
    this.initialized = true;
  }

  refresh() {
    this.resetPlayer();
    this.removeTorrent();

    this.paused = true;
    this.torrenting = false;

    if (this.torrentEnabled && this.autoplay) {
      this.loadTorrent();
    } else if (!this.torrentEnabled) {
      this.detectChanges();

      this.player.nativeElement.load();
      if ((typeof this.resumeFromTime !== 'undefined') || this.autoplay) {
        try {
          (<HTMLVideoElement>this.player.nativeElement).currentTime = this.resumeFromTime || 0;
        } catch (e) { }
        this.resumeFromTime = void 0;
        this.play();
      }
    }

    // TODO: Send refresh signal, but first find a way to check
    // TODO: if rendered player is not the same as last refresh.
  }

  ngOnDestroy() {
    this.initialized = false;

    if (this.infoTimer$) {
      clearInterval(this.infoTimer$);
    }

    this.removeTorrent();
  }

  // Player

  getPlayer(): HTMLVideoElement {
    return this.player && this.player.nativeElement;
  }

  hasPlayer() {
    return !!this.getPlayer();
  }

  resetPlayer() {
    if (!this.hasPlayer()) {
      return;
    }

    const player = this.getPlayer();

    if (this.torrentEnabled) {
      player.pause();
      player.removeAttribute('src');
      while (player.firstChild) {
        player.removeChild(player.firstChild);
      }
    }
  }

  // Torrent

  async loadTorrent() {
    if (this.torrenting || !this.torrentEnabled) {
      this.play();
      return;
    }

    this.removeTorrent();

    this.loading = true;
    this.torrenting = true;
    this.paused = false;
    this.detectChanges();

    const magnetKey = this.torrentSrc.key;

    let torrentFile;
    let infoHash;
    let webSeed;
    try {
      const response: any = await this.client.get(`api/v2/media/magnet/${magnetKey}`);

      torrentFile = base64ToBlob(response.encodedTorrent);
      infoHash = response.infoHash;
      webSeed = response.httpSrc;
    } catch (e) {
      this.loading = false;
      this.torrenting = false;
      console.error('Torrent API fallback', e);
      this.fallback();

      return;
    }

    try {
      this.currentTorrent = infoHash;
      const torrent = await this.webtorrent.add(torrentFile, infoHash);
      if (webSeed) {
        torrent.addWebSeed(webSeed);
      }

      this.loading = false;
      this.detectChanges();

      const file = torrent.files.find(file => file.name.endsWith('.mp4'));

      if (!file) {
        // TODO: Destroy torrent?
        this.loading = false;
        this.torrenting = false;
        this.detectChanges();

        console.error('Torrent media not found fallback');
        this.fallback();
        return;
      }

      file.renderTo(this.getPlayer(), err => {
        if (err) {
          this.torrenting = false;
          this.detectChanges();

          console.error('Torrent media render error fallback');
          this.fallback();
        }

        if (typeof this.resumeFromTime !== 'undefined') {
          try {
            (<HTMLVideoElement>this.player.nativeElement).currentTime = this.resumeFromTime;
          } catch (e) { }
          this.resumeFromTime = void 0;
        }

        if (this.paused) {
          this.getPlayer().pause();
        }
      });
    } catch (e) {
      this.torrenting = false;
      this.detectChanges();

      console.error('Webtorrent error', e);
      this.errorEmitter.emit((e && e.message) || 'Error playing video');
    }
  }

  removeTorrent() {
    if (this.currentTorrent) {
      this.webtorrent.remove(this.currentTorrent);
      this.currentTorrent = void 0;
    }

    this.torrenting = false;

    if (this.initialized) {
      this.detectChanges();
    }
  }

  fallback() {
    this.torrentEnabled = false;
    this.detectChanges();

    this.resumeFromTime = 0;
    this.refresh();
  }

  isLoading() {
    return this.loading;
  }

  isTorrenting() {
    return this.torrenting;
  }

  // Info

  refreshInfo() {
    if (!this.isTorrenting() || !this.currentTorrent || !this.webtorrent.get(this.currentTorrent)) {
      this.info = {
        progress: 0,
        peers: 0,
        ul: 0,
        dl: 0,
        ulspeed: 0,
        dlspeed: 0,
      };
    } else {
      const torrent = this.webtorrent.get(this.currentTorrent);

      this.info = {
        progress: torrent.progress,
        peers: torrent.numPeers,
        ul: torrent.uploaded,
        dl: torrent.downloaded,
        ulspeed: torrent.uploadSpeed,
        dlspeed: torrent.downloadSpeed,
      };
    }

    this.detectChanges();
  }

  // Controls

  toggle() {
    if (this.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  play() {
    if (this.player.nativeElement) {
      if (this.torrenting || !this.torrentEnabled) {
        this.player.nativeElement.play();
      } else if (this.torrentEnabled) {
        this.loadTorrent();
      }
    }

    this.paused = false;
    this.detectChanges();
  }

  pause() {
    if (this.player.nativeElement) {
      this.player.nativeElement.pause();
    }

    this.paused = true;
    this.detectChanges();
  }

  isPlaying() {
    return !this.paused;
  }

  //

  getCurrentTime(): number {
    return (this.player.nativeElement && this.player.nativeElement.currentTime) || 0;
  }

  resumeFrom(from: number = 0) {
    this.resumeFromTime = from;
  }

  //

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
