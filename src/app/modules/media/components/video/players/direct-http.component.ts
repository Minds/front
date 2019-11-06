import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MindsPlayerInterface } from './player.interface';

@Component({
  moduleId: module.id,
  selector: 'm-video--direct-http-player',
  templateUrl: 'direct-http.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MindsVideoDirectHttpPlayer
  implements OnInit, OnDestroy, MindsPlayerInterface {
  @ViewChild('player', { static: true }) player: ElementRef;

  @Input() muted: boolean = false;
  @Input() poster: string = '';
  @Input() autoplay: boolean = false;
  @Input() guid: string | number;

  src: string;
  @Input('src') set _src(src: string) {
    this.src = src;

    const player = this.getPlayer();

    if (player) {
      this.loading = true;
      this.detectChanges();

      player.load();
    }
  }

  @Output() onPlay: EventEmitter<HTMLVideoElement> = new EventEmitter();
  @Output() onPause: EventEmitter<HTMLVideoElement> = new EventEmitter();
  @Output() onEnd: EventEmitter<HTMLVideoElement> = new EventEmitter();
  @Output() onError: EventEmitter<{
    player: HTMLVideoElement;
    e;
  }> = new EventEmitter();
  @Output() onCanPlayThrough: EventEmitter<any> = new EventEmitter();
  @Output() onLoadedMetadata: EventEmitter<any> = new EventEmitter();

  loading: boolean = false;

  constructor(protected cd: ChangeDetectorRef) {}

  protected _emitPlay = () => this.onPlay.emit(this.getPlayer());
  protected _emitPause = () => this.onPause.emit(this.getPlayer());
  protected _emitEnd = () => this.onEnd.emit(this.getPlayer());
  protected _emitError = e =>
    this.onError.emit({ player: this.getPlayer(), e });
  protected _emitCanPlayThrough = () =>
    this.onCanPlayThrough.emit(this.getPlayer());
  protected _emitLoadedMetadata = () =>
    this.onLoadedMetadata.emit(this.getPlayer());

  protected _canPlayThrough = () => {
    this.loading = false;
    this.detectChanges();
    this._emitCanPlayThrough();
  };

  protected _onPlayerError = e => {
    if (
      !e.target.error &&
      e.target.networkState !== HTMLMediaElement.NETWORK_NO_SOURCE
    ) {
      // Poster error
      return;
    }

    this.loading = false;
    this.detectChanges();

    this._emitError(e);
  };

  ngOnInit() {
    const player = this.getPlayer();
    player.addEventListener('playing', this._emitPlay);
    player.addEventListener('pause', this._emitPause);
    player.addEventListener('ended', this._emitEnd);
    player.addEventListener('error', this._onPlayerError);
    player.addEventListener('canplaythrough', this._canPlayThrough);
    player.addEventListener('loadedmetadata', this._emitLoadedMetadata);

    this.loading = true;
  }

  ngOnDestroy() {
    const player = this.getPlayer();

    if (player) {
      player.removeEventListener('playing', this._emitPlay);
      player.removeEventListener('pause', this._emitPause);
      player.removeEventListener('ended', this._emitEnd);
      player.removeEventListener('error', this._onPlayerError);
      player.removeEventListener('canplaythrough', this._canPlayThrough);
      player.removeEventListener('loadedmetadata', this._emitLoadedMetadata);
    }
  }

  getPlayer(): HTMLVideoElement {
    return this.player.nativeElement;
  }

  async play() {
    const player = this.getPlayer();

    try {
      await player.play();
    } catch (e) {
      console.log(e);
    }
  }

  pause() {
    const player = this.getPlayer();

    try {
      player.pause();
    } catch (e) {
      console.log(e);
    }
  }

  async toggle() {
    const player = this.getPlayer();

    if (player.paused) {
      await this.play();
    } else {
      this.pause();
    }
  }

  resumeFromTime(time: number = 0) {
    // TODO detect if it's still transcoding
    const player = this.getPlayer();

    try {
      player.currentTime = time;
      this.play();
    } catch (e) {
      console.log(e);
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
    return {};
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
