import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
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
import * as Plyr from 'plyr';
import { PlyrComponent } from 'ngx-plyr-mg';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { Session } from '../../../../services/session';
import { map, take } from 'rxjs/operators';
import { HlsjsPlyrDriver } from './hls-driver';
import { GlobalAudioPlayerService } from '../audio/services/global-audio-player.service';

@Component({
  selector: 'm-videoPlayer',
  templateUrl: 'player.component.html',
  animations: PLAYER_ANIMATIONS,
  providers: [VideoPlayerService, Session],
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
   * Controls events
   */
  @Output() onControlsShown: EventEmitter<any> = new EventEmitter<any>();
  @Output() onControlsHidden: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Autoplay (if set to false, then placeholder will be displayed)
   * calling .play() will override this
   */
  @Input() set autoplay(autoplay: boolean) {
    if (autoplay) {
      this.service.isPlayable$.next(true);
    }
  }

  @Input() embedded?: boolean = false;

  /**
   * This is the video player component
   */
  player: PlyrComponent;

  useEmptySource: boolean = false;

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
   * If the plyr component should be displayed
   */
  showPlyr = false;

  /**
   * When the player firsts starts to play, we mark as ready
   */
  ready = false;

  /**
   * True if player is muted when ready event fires.
   * Allows us to track initial unmute event.
   */
  public shouldTrackUnmuteEvent: boolean = false;

  /**
   * Plyr driver detrmined by source types (detects hls)
   */
  plyrDriver$: Observable<HlsjsPlyrDriver | null> = this.service.sources$.pipe(
    map((sources) => {
      if (
        sources[0].type === 'application/vnd.apple.mpegURL' &&
        isPlatformBrowser(this.platformId) &&
        !document
          .createElement('video')
          .canPlayType('application/vnd.apple.mpegURL')
      ) {
        return new HlsjsPlyrDriver(true);
      }
      return null;
    })
  );

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
    loop: { active: true },
  };

  /**
   * Flag that gets set to true in ngAfterViewInit
   */
  protected init: boolean = false;

  subscriptions: Subscription[] = [];

  constructor(
    public elementRef: ElementRef,
    private service: VideoPlayerService,
    private cd: ChangeDetectorRef,
    private globalAudioPlayerService: GlobalAudioPlayerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.service.onReady$.subscribe(() => {
        this.cd.markForCheck();
        this.cd.detectChanges();
      }),
      combineLatest([
        this.service.isPlayable$,
        this.service.sources$,
      ]).subscribe(([isPlayable, sources]) => {
        this.showPlyr =
          isPlatformBrowser(this.platformId) &&
          isPlayable &&
          sources.length > 0;
      }),
      this.globalAudioPlayerService.played$.subscribe((_: unknown): void => {
        if (this.isPlaying()) {
          this.player.player.pause();
        }
      })
    );
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
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  @Input('guid')
  set guid(guid: string) {
    const oldGuid = this.service.guid;
    this.service.setGuid(guid);
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

  get isModal(): boolean {
    return this.service.isModal;
  }

  get awaitingTranscode(): Observable<boolean> {
    return this.service.awaitingTranscode();
  }

  /**
   * Placeholder clicked
   * @param e
   * @return void
   */
  onPlaceholderClick(e: MouseEvent): void {
    // If we have a player, then play
    if (this.player && this.service.isPlayable$.getValue()) {
      this.play({ muted: false, hideControls: false });
      return;
    }

    // Play in modal if required
    if (this.service.shouldPlayInModal) {
      return this.mediaModalRequested.next();
    }

    this.service.isPlayable$.next(true);
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

  async play(opts: { muted: boolean; hideControls?: boolean }) {
    this.options.muted = opts.muted;
    this.options.hideControls = opts.hideControls;

    this.service.isPlayable$.next(true);

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

      // Clean up sources
      this.removeSources();
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

  /**
   * Fired on ready state trigger.
   * @returns { void }
   */
  public onReady(): void {
    // track whether player is muted on ready state in a class variable.
    this.shouldTrackUnmuteEvent = this.isMuted();
  }

  /**
   * Fired when player video ends.
   * @returns { void }
   */
  public onEnded(): void {}

  /**
   * Fired on volume change.
   * @returns { void }
   */
  public onVolumeChange(): void {
    // only track unmute event if the player started muted.
    if (this.shouldTrackUnmuteEvent) {
      this.service.trackClick('video-player-unmuted');
      this.shouldTrackUnmuteEvent = false;
    }
  }

  /**
   * Called on Plyr seek.
   * @returns { void }
   */
  public onSeeking(): void {}

  /**
   * Fired on played event trigger.
   * @returns { void }
   */
  public onPlayed(): void {
    // pause global audio player to prevent audio bleeding.
    this.globalAudioPlayerService.pause();
  }

  onPlay(): void {
    this.ready = true;
  }

  removeSources() {
    const sources =
      this.elementRef.nativeElement.getElementsByTagName('source');

    // remove <source> from the DOM
    for (const source of sources) {
      source.remove();
    }

    // reload video so it frees up resources
    const video: HTMLVideoElement =
      this.elementRef.nativeElement.getElementsByTagName('video')[0];
    if (video) {
      try {
        video.load();
      } catch (err) {}
    }

    // if we're not autoplaying, we need to set the src attribute to ''
    this.service.isPlayable$.next(false);
  }

  /**
   * Whether player is muted (or volume is 0).
   * @returns { boolean } - true if player is muted.
   */
  private isMuted(): boolean {
    return this.player
      ? this.player.player.muted || this.player.player.volume === 0
      : false;
  }
}
