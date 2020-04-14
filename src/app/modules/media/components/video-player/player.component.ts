import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { PLAYER_ANIMATIONS } from './player.animations';
import { VideoPlayerService, VideoSource } from './player.service';
import Plyr from 'plyr';
import { PlyrComponent } from 'ngx-plyr';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Session } from '../../../../services/session';
import { VideoAutoplayService } from '../video/services/video-autoplay.service';

@Component({
  selector: 'm-videoPlayer',
  templateUrl: 'player.component.html',
  animations: PLAYER_ANIMATIONS,
  providers: [VideoPlayerService, Session],
})
export class MindsVideoPlayerComponent
  implements OnChanges, OnDestroy, AfterViewInit, OnChanges {
  /**
   * MH: dislike having to emit an event to open modal, but this is
   * the quickest work around for now
   */
  @Output() mediaModalRequested: EventEmitter<void> = new EventEmitter();

  /**
   * Modal needs to know if we have left full screen
   */
  @Output() fullScreenChange: EventEmitter<Event> = new EventEmitter();

  /**
   * Dimension change event for parent components
   */
  @Output() dimensions: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Setting this to true makes the video autoplay
   */
  @Input() autoplay: boolean = false;

  @Input() allowAutoplayOnScroll: boolean = false;

  /**
   * See setAutoplay method
   */
  autoplayChanged: boolean = false;
  newAutoplayValue: boolean = false;

  /**
   * This is set by VideoAutoplayService
   */
  autoplaying: boolean = false;
  /**
   * This is the video player component
   */
  player: PlyrComponent;

  @ViewChild(PlyrComponent, { static: false }) set _player(
    player: PlyrComponent
  ) {
    this.player = player;
  }

  /**
   * Options for Plyr to use
   */
  options: Plyr.Options = {
    controls: [
      'play-large',
      'play',
      'progress',
      'current-time',
      'mute',
      'volume',
      'captions',
      'settings',
      'airplay',
      'fullscreen',
    ],
  };

  onReadySubscription: Subscription = this.service.onReady$.subscribe(() => {
    this.cd.markForCheck();
    this.cd.detectChanges();
  });

  setAutoplaying(value: boolean): void {
    this.autoplaying = value;

    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  setAutoplay(value: boolean): void {
    // if the player doesn't exist yet, make it so this is called again by onReady()
    if (!this.player || !this.player.player) {
      this.newAutoplayValue = value;
      this.autoplayChanged = true;
    } else {
      this.autoplayChanged = false;

      // if we're about to autoplay, first mute so we avoid errors
      if (value) {
        this.mute();
      }
      // change the actual option in the next cycle, after the video has been muted
      setTimeout(() => {
        this.options = { ...this.options, autoplay: value };
      });
    }
  }

  constructor(
    public elementRef: ElementRef,
    private service: VideoPlayerService,
    private session: Session,
    @Inject(forwardRef(() => VideoAutoplayService))
    private autoplayService: VideoAutoplayService,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (isPlatformBrowser(this.platformId)) {
      this.service.load();
    }

    if (changes.autoplay) {
      this.setAutoplay(changes.autoplay.currentValue);
    }
  }

  ngAfterViewInit() {
    this.setAutoplay(this.autoplay);

    if (this.allowAutoplayOnScroll) {
      this.autoplayService.registerPlayer(this);
    }
  }

  ngOnDestroy(): void {
    this.onReadySubscription.unsubscribe();
  }

  @Input('guid')
  set guid(guid: string) {
    const oldGuid = this.service.guid;
    this.service.setGuid(guid);

    if (isPlatformBrowser(this.platformId) && oldGuid !== guid) {
      this.service.load();
    }
  }

  @Input('isModal')
  set isModal(isModal: boolean) {
    this.service.setIsModal(isModal);
  }

  @Input('shouldPlayInModal')
  set shouldPlayInModal(shouldPlayInModal: boolean) {
    this.service.setShouldPlayInModal(shouldPlayInModal);
  }

  get sources$(): BehaviorSubject<VideoSource> {
    return this.service.sources$;
  }

  get status(): string {
    return this.service.status;
  }

  onPlayed(event: Plyr.PlyrEvent): void {
    // console.log('played', event);
  }

  /**
   * If the component is in a playable state
   * @return boolean
   */
  isPlayable(): boolean {
    return (
      (isPlatformBrowser(this.platformId) && this.autoplay) ||
      (this.service.isPlayable() && this.autoplaying) // autoplaying comes from the scroll, and autoplay is for single entity views
    );
  }

  /**
   * Placeholder clicked
   * @param e
   * @return void
   */
  onPlaceholderClick(e: MouseEvent): void {
    // If we have a player, then play
    if (this.player) {
      this.player.player.play();
      return;
    }
    // Play in modal if required
    if (this.service.shouldPlayInModal) {
      return this.mediaModalRequested.next();
    }

    // This is very hacky. A wrapper component needs to be made for autoplay logic.
    this.autoplaying = true;
    this.service.forcePlayable = true;

    //console.error('Placeholder was clicked but we have no action to take');
  }

  unmute(): void {
    if (this.player) {
      this.player.player.muted = false;
    }
  }

  mute(): void {
    if (this.player) {
      this.player.player.muted = true;
    }
  }

  isMuted(): boolean {
    return this.player ? this.player.player.muted : false;
  }

  play(): void {
    if (this.player) {
      this.player.player.play();
    }
  }

  isPlaying(): boolean {
    return this.player ? this.player.player.playing : false;
  }

  stop(): void {
    if (this.player) {
      this.player.player.stop();
    }
  }

  /**
   * Pause the player, if there is one
   * @return void
   */
  pause(): void {
    if (this.player) {
      this.player.player.pause();
    }
  }

  /**
   * Emits dimensions to parent component,
   * called after HTML5 metadata is loaded
   * @param e
   */
  emitDimensions(e) {
    try {
      const media = e.detail.plyr.media;

      if (!media) {
        return;
      }

      this.dimensions.next({
        width: media.videoWidth,
        height: media.videoHeight,
      });
    } catch (e) {
      console.info('Error emitting dimensions', e);
    }
  }

  onClick(): void {
    if ((this.autoplay || this.autoplaying) && this.isMuted()) {
      this.autoplayService.muted = false;
      this.unmute();
      this.play();
    }
  }

  onReady() {
    // if autoplay changed, the player probably wasn't defined yet, so we need to call this method again
    if (this.autoplayChanged) {
      this.setAutoplay(this.newAutoplayValue);
    }
    if (this.autoplaying) {
      if (this.autoplayService.muted) {
        this.mute();
      } else {
        this.unmute();
      }
      this.play();
    }
  }

  onVolumeChange() {
    if (this.autoplay || this.autoplaying) {
      this.autoplayService.muted = this.player.player.muted;
    }
  }

  onPlay(): void {
    if (!this.autoplaying) {
      this.autoplayService.userPlay(this);
    }
  }
}
