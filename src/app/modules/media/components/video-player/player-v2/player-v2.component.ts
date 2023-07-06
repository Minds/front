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
import { PLAYER_ANIMATIONS } from '../player.animations';
import { VideoPlayerService, VideoSource } from '../player.service';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { Session } from '../../../../../services/session';
import { VjsPlayerComponent } from './vjs-player/vjs-player.component';
import { VideoJSCustomMetadata } from './vjs-player/vjs-player.types';

export type PlayerV2Options = Partial<{
  autoplay: boolean;
  muted: boolean;
  hideControls: boolean;
}>;

/**
 * Wrapper for v2 video player (using video.js)
 */
@Component({
  selector: 'm-videoPlayerV2',
  templateUrl: 'player-v2.component.html',
  styleUrls: ['./player-v2.component.ng.scss'],
  animations: PLAYER_ANIMATIONS,
  providers: [VideoPlayerService, Session],
})
export class MindsVideoPlayerV2Component implements OnChanges, OnDestroy {
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
   * TODO: front#5957 Maybe replace these with mouseover and mousein
   * it controls when the topbar shows.
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
  protected player: VjsPlayerComponent;

  protected useEmptySource: boolean = false;

  protected emptySource: VideoSource = {
    id: null,
    type: null,
    size: 0,
    src: '',
  };

  @ViewChild(VjsPlayerComponent) set _player(player: VjsPlayerComponent) {
    this.player = player;
  }

  /**
   * If the player component should be displayed
   */
  public showPlayer: boolean = false;

  /**
   * True if player is muted when ready event fires.
   * Allows us to track initial unmute event.
   */
  public shouldTrackUnmuteEvent: boolean = false;

  /**
   * Options for player to use
   */
  protected options: PlayerV2Options = {
    autoplay: true,
    muted: false,
    hideControls: true,
  };

  /**
   * Flag that gets set to true in ngAfterViewInit
   */
  protected init: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    public elementRef: ElementRef,
    protected service: VideoPlayerService,
    private cd: ChangeDetectorRef,
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
        this.showPlayer =
          isPlatformBrowser(this.platformId) &&
          isPlayable &&
          sources.length > 0;
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (isPlatformBrowser(this.platformId)) {
      this.service.load();
    }
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /** Set GUID via service. */
  @Input('guid')
  set guid(guid: string) {
    this.service.setGuid(guid);
  }

  /** Set isModal via service. */
  @Input('isModal')
  set isModal(isModal: boolean) {
    this.service.setIsModal(isModal);
  }

  /** Set shouldPlayInModal via service. */
  @Input('shouldPlayInModal')
  set shouldPlayInModal(shouldPlayInModal: boolean) {
    this.service.setShouldPlayInModal(shouldPlayInModal);
  }

  /**
   * Gets sources subject from service.
   * @returns { BehaviorSubject<VideoSource[]> } - sources subject.
   */
  get sources$(): BehaviorSubject<VideoSource[]> {
    return this.service.sources$;
  }

  /**
   * Gets status from service.
   * @returns { string } - status from service.
   */
  get status(): string {
    return this.service.status;
  }

  /**
   * Gets isModal from service.
   * @returns { boolean } - isModal from service.
   */
  get isModal(): boolean {
    return this.service.isModal;
  }

  /**
   * Gets awaiting transcode state from service as observable.
   * @returns { Observable<boolean> } - awaiting transcode state from service.
   */
  get awaitingTranscode(): Observable<boolean> {
    return this.service.awaitingTranscode();
  }

  /**
   * Placeholder clicked.
   * @param { MouseEvent } e - mouse event
   * @return { void }
   */
  onPlaceholderClick(e: MouseEvent): void {
    // // If we have a player, then play
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

  /**
   * Set unmuted in options.
   * @returns { void }
   */
  unmute(): void {
    this.options.muted = false;
  }

  /**
   * Set muted in options.
   * @returns { void }
   */
  mute(): void {
    this.options.muted = true;
  }

  /**
   * Manually force play, passing in muted and hideControls options.
   * @param { PlayerV2Options } opts - options.
   * @returns { Promise<void> }
   */
  async play(opts: PlayerV2Options): Promise<void> {
    this.options.muted = opts.muted ?? false;
    this.options.hideControls = opts.hideControls ?? false;

    this.service.isPlayable$.next(true);

    if (this.player) {
      try {
        this.player.setMuted(this.options.muted);
        await this.player.play();
      } catch (e) {}
    }
  }

  /**
   * Pause the player, if there is one.
   * @return { void }
   */
  pause(): void {
    if (this.player) {
      this.player.pause();

      // Clean up sources
      this.removeSources();
    }
  }

  /**
   * Determine whether player is playing currently.
   * @returns { boolean }
   */
  isPlaying(): boolean {
    return this.player ? this.player.isPlaying() : false;
  }

  /**
   * Stop player by pausing it.
   * @returns { void }
   */
  stop(): void {
    this.player.pause();
  }

  /**
   * Emits dimensions to parent component,
   * called after HTML5 metadata is loaded
   * @param { VideoJSCustomMetadata } metadata - custom metadata.
   */
  emitDimensions(metadata: VideoJSCustomMetadata) {
    try {
      if (!metadata) {
        return;
      }

      this.dimensions.emit({
        width: metadata.videoWidth,
        height: metadata.videoHeight,
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
   * Called on seek.
   * @returns { void }
   */
  public onSeeking(): void {}

  /**
   * Fired on played event trigger.
   * @returns { void }
   */
  public onPlayed(): void {}

  /**
   * Fires on play.
   * @returns { void }
   */
  onPlay(): void {}

  /**
   * Removes sources from DOM and sets isPlayable state to false.
   * @returns { void }
   */
  removeSources(): void {
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

    // if we're not autoplaying, we need to set the src attribute to ''
    this.service.isPlayable$.next(false);
  }

  /**
   * Whether player is muted (or volume is 0).
   * @returns { boolean } - true if player is muted.
   */
  private isMuted(): boolean {
    return this.player
      ? this.player.isMuted() || this.player.getVolume() === 0
      : false;
  }
}
