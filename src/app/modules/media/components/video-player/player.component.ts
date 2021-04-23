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
import * as Plyr from 'plyr';
import { PlyrComponent } from 'ngx-plyr';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { Session } from '../../../../services/session';
import { AutoProgressVideoService } from '../video/auto-progress-overlay/auto-progress-video.service';
import { map, take } from 'rxjs/operators';
import { HlsjsPlyrDriver } from './hls-driver';
import { PlatformService } from '../../../../common/services/platform.service';

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
   * Plyr driver determined by source types (detects hls)
   */
  plyrDriver$: Observable<HlsjsPlyrDriver | null> = this.service.sources$.pipe(
    map(sources => {
      if (this.isIOS) {
        return null;
      } else if (
        sources[0].type === 'video/hls' &&
        isPlatformBrowser(this.platformId)
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
  };

  isIOS: boolean = false;

  /**
   * Flag that gets set to true in ngAfterViewInit
   */
  protected init: boolean = false;

  subscriptions: Subscription[] = [
    this.service.onReady$.subscribe(() => {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }),
  ];

  constructor(
    public elementRef: ElementRef,
    private service: VideoPlayerService,
    private cd: ChangeDetectorRef,
    public autoProgress: AutoProgressVideoService,
    protected platformService: PlatformService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.platformService.isIOS$.subscribe(isIOS => {
      this.isIOS = isIOS;
    });

    this.subscriptions.push(
      combineLatest([
        this.service.isPlayable$,
        this.service.sources$,
      ]).subscribe(([isPlayable, sources]) => {
        this.showPlyr =
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

    // if (changes.autoplay) {
    //   this.setAutoplay(changes.autoplay.currentValue);
    // }
  }

  ngOnDestroy(): void {
    this.autoProgress.cancel(); // hide autoplay window

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
   * Plyr call when play event is emitted
   * @param event
   */
  onPlayed(event: Plyr.PlyrEvent): void {
    // console.log('played', event);
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

  isMuted(): boolean {
    return this.player ? this.player.player.muted : false;
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

  onReady() {}

  onVolumeChange(): void {}

  onPlay(): void {}

  removeSources() {
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

  onEnded($event: any): void {
    this.autoProgress.next();
  }

  /**
   * Called on Plyr seek.
   */
  onSeeking(): void {
    this.subscriptions.push(
      this.autoProgress.timer$.pipe(take(1)).subscribe(timer => {
        if (timer > 0) {
          this.autoProgress.cancel();
        }
      })
    );
  }
}
