import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { Client } from '../../../../services/api';
import { ModalService } from '../../../../services/ux/modal.service';
import { AnalyticsService } from '../../../../services/analytics';
import { isPlatformBrowser } from '@angular/common';

// key for click events.
export type ClickEventRef = 'video-player-unmuted';

export type VideoSource = {
  id: string;
  type: string;
  size: number;
  src: string;
};

@Injectable()
export class VideoPlayerService implements OnDestroy {
  /**
   * @var string
   */
  guid: string;

  /**
   * @var BehaviorSubject<VideoSource>
   */
  sources$: BehaviorSubject<VideoSource[]> = new BehaviorSubject<VideoSource[]>(
    []
  );

  isPlayable$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * @var string
   */
  status: string;

  /**
   * A poster is thumbnail
   * @var BehaviorSubject<string>
   */
  poster$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * Video entity loaded from guid.
   */
  private readonly entity$: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  /**
   * False would be inline
   * @var boolean
   */
  shouldPlayInModal = true;

  /**
   * If its a modal or not
   * @var boolean
   */
  isModal = false;

  /**
   * Force playable
   */
  forcePlayable = false;

  /**
   * Observable for if ready
   */
  onReady$: Subject<void> = new Subject();

  constructor(
    private client: Client,
    private modalService: ModalService,
    private analytics: AnalyticsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.setShouldPlayInModal(true);
  }

  ngOnDestroy(): void {
    if (this.sources$) {
      this.sources$.unsubscribe();
    }
    if (this.poster$) {
      this.poster$.unsubscribe();
    }
  }

  /**
   * Set the guid that we are interacting with
   * @param string guid
   * @return VideoPlayerService
   */
  setGuid(guid: string): VideoPlayerService {
    this.guid = guid;
    return this;
  }

  /**
   * Set the guid that we are interacting with
   * @param boolean is
   * @return VideoPlayerService
   */
  setIsModal(isModal: boolean): VideoPlayerService {
    this.isModal = isModal;
    return this;
  }

  setShouldPlayInModal(shouldPlayInModal: boolean): VideoPlayerService {
    this.shouldPlayInModal =
      shouldPlayInModal && this.modalService.canOpenInModal();
    return this;
  }

  /**
   * Return the sources for a video
   * @return Promise<void>
   */
  async load(): Promise<void> {
    try {
      const response: any = await this.client.get(
        'api/v2/media/video/' + this.guid
      );
      this.sources$.next(response.sources);
      this.poster$.next(response.poster);
      this.entity$.next(response.entity);
      this.status = response.transcode_status;
      this.onReady$.next();
      this.onReady$.complete();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Record play
   */
  async recordPlay(): Promise<void> {
    // TODO
  }

  /**
   * Check whether the video's are still awaiting transcode.
   * @returns { Observable<boolean> } true if video has no sources and is not failed.
   */
  awaitingTranscode(): Observable<boolean> {
    return of(this.status === 'transcoding');
  }

  /**
   * Tracks click event.
   * @param { ClickEventRef } clickEventKey - click event reference.
   * @returns { void }
   */
  public trackClick(clickEventKey: ClickEventRef): void {
    if (isPlatformBrowser(this.platformId)) {
      this.analytics.trackClick(clickEventKey, [
        this.analytics.buildEntityContext(this.entity$.getValue()),
      ]);
    }
  }
}
