import {
  Component,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  ElementRef,
  ChangeDetectorRef,
  HostBinding,
  HostListener,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';

import { MindsVideoPlayerComponent } from './player.component';
import { ScrollService } from '../../../../services/ux/scroll';
import { Subscription } from 'rxjs';
import { Session } from '../../../../services/session';
import { VideoJsExperimentService } from '../../../experiments/sub-services/videojs-experiment.service';

@Component({
  selector: 'm-videoPlayer--scrollaware',
  templateUrl: './scrollaware-player.component.html',
})
export class ScrollAwareVideoPlayerComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() guid: string;
  @Input() shouldPlayInModal: boolean;
  @Input() autoplay = true;
  @Input() isModal: boolean = false;
  @Input() isLivestream: boolean = false;

  @Output() mediaModalRequested: EventEmitter<void> = new EventEmitter();
  @ViewChild('player') player: MindsVideoPlayerComponent;

  hasMousedOver = false;
  isInViewport = false;

  scrollSubscription: Subscription;

  constructor(
    private el: ElementRef,
    private scrollService: ScrollService,
    private session: Session,
    private cd: ChangeDetectorRef,
    private videoJsExperiment: VideoJsExperimentService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.scrollSubscription = this.scrollService
      .listenForView()
      .subscribe(() => {
        this.onVisibilityCheck();
      });
  }

  ngOnDestroy() {
    this.scrollSubscription?.unsubscribe();
  }

  ngAfterViewInit() {
    this.onVisibilityCheck();
  }

  onVisibilityCheck(): void {
    if (isPlatformServer(this.platformId)) return;

    if (this.el.nativeElement) {
      if (
        this.scrollService.isVisible(this.el.nativeElement, 50) ||
        this.isModal
      ) {
        if (!this.isInViewport) this.onEnterViewport();
      } else {
        if (this.isInViewport) this.onExitViewport();
      }
    }
  }

  onEnterViewport(): void {
    const user = this.session.getLoggedInUser();
    this.isInViewport = true;
    if (
      user && // Must be logged in
      this.autoplay &&
      !user.disable_autoplay_videos
    ) {
      this.player.play({
        muted: !this.isModal,
        hideControls: true,
      });
      this.detectChanges();
    }
  }

  onExitViewport(): void {
    this.isInViewport = false;
    this.player.shouldTrackUnmuteEvent = false;
    this.player.pause();
    this.detectChanges();
  }

  openModal(e: MouseEvent): void {
    this.mediaModalRequested.next();
  }

  onOverlayClick(e: MouseEvent): void {
    if (this.shouldPlayInModal && !this.player.isPlaying()) {
      this.mediaModalRequested.next();
      return;
    }
  }

  forcePlay(): void {
    this.player.play({
      muted: true,
      hideControls: true,
    });
  }

  @HostListener('mouseenter')
  onMouseOver(e: MouseEvent) {
    if (this.hasMousedOver) return;
    this.hasMousedOver = true;
    // TODO: should we unmute on mouseover?
    // this.player.play({ muted: false, hideControls: false });
  }

  /**
   * Whether video.js player should be used site-wide, else will just be used for live streams.
   * @returns { boolean } true if video.js player should be used.
   */
  public shouldUseVideoJSPlayer(): boolean {
    return this.videoJsExperiment.isActive() || this.isLivestream;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
