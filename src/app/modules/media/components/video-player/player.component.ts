import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { PLAYER_ANIMATIONS } from './player.animations';
import { VideoPlayerService, VideoSource } from './player.service';
import isMobile from '../../../../helpers/is-mobile';
import Plyr from 'plyr';
import { PlyrComponent } from 'ngx-plyr';

@Component({
  selector: 'm-videoPlayer',
  templateUrl: 'player.component.html',
  animations: PLAYER_ANIMATIONS,
  providers: [VideoPlayerService],
})
export class MindsVideoPlayerComponent implements OnInit, OnDestroy {
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
   * This is the video player component
   */
  @ViewChild(PlyrComponent, { static: false }) player: PlyrComponent;

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

  constructor(
    private service: VideoPlayerService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.service.load().then(() => {
      this.cd.markForCheck();
      this.cd.detectChanges();
    });
  }

  ngOnDestroy(): void {}

  @Input('guid')
  set guid(guid: string) {
    this.service.setGuid(guid);
  }

  @Input('autoplay')
  set autoplay(autoplay: boolean) {
    this.options.autoplay = autoplay;
  }

  @Input('isModal')
  set isModal(isModal: boolean) {
    this.service.setIsModal(isModal);
  }

  @Input('shouldPlayInModal')
  set shouldPlayInModal(shouldPlayInModal: boolean) {
    this.service.setShouldPlayInModal(shouldPlayInModal);
  }

  get poster(): string {
    return this.service.poster;
  }

  get sources(): Plyr.Source[] {
    return this.service.sources;
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
    return this.service.isPlayable();
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

    console.error('Placeholder was clicked but we have no action to take');
  }

  /**
   * Pause the player, if there is one
   * @return void
   */
  pause(): void {
    if (this.player) {
      this.player.player.pause();
      return;
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
}
