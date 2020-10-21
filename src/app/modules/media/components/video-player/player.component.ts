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
import { ConfigsService } from '../../../../common/services/configs.service';
import { PLAYER_ANIMATIONS } from './player.animations';
import { VideoPlayerService, VideoSource } from './player.service';
import * as Plyr from 'plyr';
import { PlyrComponent } from 'ngx-plyr';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Session } from '../../../../services/session';

@Component({
  selector: 'm-videoPlayer',
  templateUrl: 'player.component.html',
  animations: PLAYER_ANIMATIONS,
  providers: [VideoPlayerService, Session],
  styleUrls: ['./player.component.scss'],
})
export class MindsVideoPlayerComponent implements OnChanges, OnDestroy {
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
   * Autoplay (if set to false, then placeholder will be displayed)
   * calling .play() will override this
   */
  @Input() set autoplay(autoplay: boolean) {
    if (autoplay) {
      this.service.playable = true;
    }
  }

  /**
   * This is the video player component
   */
  player: PlyrComponent;

  useEmptySource: boolean = false;
  readonly cdnAssetsUrl: string;

  emptySource = {
    id: null,
    type: null,
    size: 0,
    src: '',
  };

  @ViewChild(PlyrComponent) set _player(player: PlyrComponent) {
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
    autoplay: true,
    muted: false,
    hideControls: true,
    storage: { enabled: false },
  };

  /**
   * Flag that gets set to true in ngAfterViewInit
   */
  protected init: boolean = false;

  onReadySubscription: Subscription = this.service.onReady$.subscribe(() => {
    this.cd.markForCheck();
    this.cd.detectChanges();
  });

  constructor(
    public elementRef: ElementRef,
    private service: VideoPlayerService,
    private configs: ConfigsService,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (isPlatformBrowser(this.platformId)) {
      this.service.load();
    }

    // if (changes.autoplay) {
    //   this.setAutoplay(changes.autoplay.currentValue);
    // }
  }

  ngOnDestroy(): void {
    this.onReadySubscription.unsubscribe();
    //this.autoplayService.unregisterPlayer(this);
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

  get sources$(): BehaviorSubject<VideoSource[]> {
    return this.service.sources$;
  }

  get status(): string {
    return this.service.status;
  }

  get awaitingTranscode(): Observable<boolean> {
    return this.service.awaitingTranscode();
  }

  onPlayed(event: Plyr.PlyrEvent): void {
    // console.log('played', event);
  }

  /**
   * If the component is in a playable state
   * @return boolean
   */
  isPlayable(): boolean {
    return isPlatformBrowser(this.platformId) && this.service.isPlayable();
  }

  /**
   * Placeholder clicked
   * @param e
   * @return void
   */
  onPlaceholderClick(e: MouseEvent): void {
    // If we have a player, then play
    if (this.player && this.isPlayable) {
      this.play({ muted: false, hideControls: false });
      return;
    }

    // Play in modal if required
    if (this.service.shouldPlayInModal) {
      return this.mediaModalRequested.next();
    }

    this.service.playable = true;
  }

  unmute(): void {
    this.options.muted = false;
    // if (this.player) {
    //   this.player.player.muted = false;
    // }
  }

  mute(): void {
    this.options.muted = true;
    // if (this.player) {
    //   this.player.player.muted = true;
    // }
  }

  isMuted(): boolean {
    return this.player ? this.player.player.muted : false;
  }

  async play(opts: { muted: boolean; hideControls?: boolean }) {
    this.options.muted = opts.muted;
    this.options.hideControls = opts.hideControls;

    this.service.playable = true;

    if (this.player) {
      try {
        this.player.player.muted = this.options.muted;

        await this.player.player.play();
      } catch (e) {}
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

    // Clean up sources
    this.removeSources();
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

  onReady() {}

  onVolumeChange(): void {}

  onPlay(): void {}

  removeSources() {
    // if we're not autoplaying, we need to set the src attribute to ''
    this.service.playable = false;

    const sources = this.elementRef.nativeElement.getElementsByTagName(
      'source'
    );

    // remove <source> from the DOM
    for (const source of sources) {
      source.remove();
    }

    // reload video so it frees up resources
    const video: HTMLVideoElement = this.elementRef.nativeElement.getElementsByTagName(
      'video'
    )[0];
    if (video) {
      try {
        video.load();
      } catch (err) {}
    }
  }
}
