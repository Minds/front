import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import {
  VideoJSCustomMetadata,
  VideoJSCustomOptions,
} from './vjs-player.types';
// import { VjsAdsPlugin }  from './plugins/ads-plugin';

/**
 * Angular adapter for the Video.js player.
 */
@Component({
  selector: 'm-videoJsPlayer',
  template: `
    <video
      #target
      class="video-js vjs-theme-minds"
      controls
      playsinline
      preload="none"
      [poster]="options?.poster ?? false"
      [autoplay]="options?.autoplay ?? false"
      [muted]="options?.muted ?? false"
    ></video>
  `,
  styleUrls: ['./vjs-player.component.ng.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VjsPlayerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('target') target: ElementRef;

  /** Fires on player ready. */
  @Output() onReady: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Fires on player play - WILL fire multiple times if playback is stopped and resumed. */
  @Output() onPlay: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Fires on player ended event - when the video ends. */
  @Output() onEnded: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Fires on player metadata loaded */
  @Output() onMetadataLoaded: EventEmitter<VideoJSCustomMetadata> =
    new EventEmitter<VideoJSCustomMetadata>();

  /** Fires on player seek - will emit the time seeked to */
  @Output() onSeeking: EventEmitter<number> = new EventEmitter<number>();

  /** Fires on player volume change - will emit the volume on a scale of 0 to 1 */
  @Output() onVolumeChange: EventEmitter<number> = new EventEmitter<number>();

  /** Fires on player - emits true when going fullscreen, false when not. */
  @Output() onFullscreenChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  /**
   * Options for videojs. See more at:
   * https://videojs.com/guides/options/
   */
  @Input() protected options: VideoJSCustomOptions;

  /** Player object - typing should be improved when types for videojs@8.x are released */
  private player: Player | any;

  // constructor(
  //   // private adsPlugin: VjsAdsPlugin
  // ) { }

  ngAfterViewInit(): void {
    this.player = videojs(this.target.nativeElement, this.options, () => {
      this.onReady.emit(true);
    });

    // this.registerPlugins();
    this.registerEventListeners();
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }

  /**
   * Check whether player is muted.
   * @returns { boolean } true if player is muted.
   */
  public isMuted(): boolean {
    return this.player.muted();
  }

  /**
   * Set player muted state.
   * @param { boolean } muted - state to set.
   * @returns { void }
   */
  public setMuted(muted: boolean = true): void {
    this.player.muted(muted);
  }

  /**
   * Manually play.
   * @returns { Promise<any> } resolved on play success.
   */
  public async play(): Promise<any> {
    return this.player.play();
  }

  /**
   * Pause playback.
   * @returns { void }
   */
  public pause(): void {
    return this.player.pause();
  }

  /**
   * Whether video is playing.
   * @returns { boolean } true if playing.
   */
  public isPlaying(): boolean {
    return !this.player.paused();
  }

  /**
   * Get current volume of player.
   * @returns { number } current volume on a scale of 0 to 1.
   */
  public getVolume(): number {
    return this.player.volume();
  }

  /**
   * Register event listeners for player.
   * See here for list of emitted events: https://docs.videojs.com/player#event
   * @returns { void }
   */
  private registerEventListeners(): void {
    this.player.on('play', () => {
      this.onPlay.emit(true);
    });

    this.player.on('ended', () => {
      this.onEnded.emit(true);
    });

    this.player.on('loadedmetadata', () => {
      this.onMetadataLoaded.emit({
        videoHeight: this.player.videoHeight(),
        videoWidth: this.player.videoWidth(),
      });
    });

    this.player.on('seeking', () => {
      this.onSeeking.emit(this.player.currentTime());
    });

    this.player.on('volumechange', () => {
      this.onVolumeChange.emit(this.player.volume());
    });

    this.player.on('fullscreenchange', () => {
      this.onFullscreenChange.emit(this.player.isFullscreen());
    });
  }

  // /**
  //  * Register plugins for player.
  //  * @returns { void }
  //  */
  // private registerPlugins(): void {
  //   this.player.registerPlugin('mindsAds', this.adsPlugin.init(this.player));
  // }
}
