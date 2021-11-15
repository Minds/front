import { FeaturesService } from './../../../../services/features.service';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { Client } from '../../../../services/api';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { map } from 'rxjs/operators';

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
    private overlayModalService: OverlayModalService,
    private featuresService: FeaturesService
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
      shouldPlayInModal && this.overlayModalService.canOpenInModal();
    return this;
  }

  /**
   * Return the sources for a video
   * @return Promise<void>
   */
  async load(): Promise<void> {
    try {
      const response = await this.client.get('api/v2/media/video/' + this.guid);
      this.sources$.next((<any>response).sources);
      this.poster$.next((<any>response).poster);
      this.status = (<any>response).transcode_status;
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
    if (this.featuresService.has('cloudflare-streams')) {
      return of(this.status === 'transcoding');
    }

    // Hide transcode status when some video transcodes are available
    return this.sources$.pipe(
      map((sources: VideoSource[]) => {
        return this.status !== 'failed' && sources.length < 1;
      })
    );
  }
}
