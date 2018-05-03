import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output,
  ViewChild
} from '@angular/core';
import { MindsPlayerInterface } from './player.interface';

@Component({
  moduleId: module.id,
  selector: 'm-video--direct-http-player',
  templateUrl: 'direct-http.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MindsVideoDirectHttpPlayer implements OnInit, OnDestroy, MindsPlayerInterface {
  @ViewChild('player') player: ElementRef;

  @Input() muted: boolean = false;
  @Input() poster: string = '';
  @Input() autoplay: boolean = false;

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
  @Output() onError: EventEmitter<{ player: HTMLVideoElement, e }> = new EventEmitter();

  loading: boolean = false;

  constructor(
    protected cd: ChangeDetectorRef
  ) { }

  protected _emitPlay = () => this.onPlay.emit(this.getPlayer());
  protected _emitPause = () => this.onPause.emit(this.getPlayer());
  protected _emitEnd = () => this.onEnd.emit(this.getPlayer());
  protected _emitError = e => this.onError.emit({ player: this.getPlayer(), e });

  protected _canPlayThrough = () => {
    this.loading = false;
    this.detectChanges();
  };

  protected _dblClick = () => {
    this.requestFullScreen();
  };

  protected _onPlayerError = e => {
    if (!e.target.error && (e.target.networkState !== HTMLMediaElement.NETWORK_NO_SOURCE)) {
      // Poster error
      return;
    }

    this.loading = false;
    this.detectChanges();

    this._emitError(e);
  };

  ngOnInit() {
    const player = this.getPlayer();
    player.addEventListener('dblclick', this._dblClick);
    player.addEventListener('playing', this._emitPlay);
    player.addEventListener('pause', this._emitPause);
    player.addEventListener('ended', this._emitEnd);
    player.addEventListener('error', this._onPlayerError);
    player.addEventListener('canplaythrough', this._canPlayThrough);

    this.loading = true;
  }

  ngOnDestroy() {
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
      player.play();
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
      player.currentTime = time;
      this.play();
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
    return {};
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
