import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Client } from '../../../../services/api';
import isMobile from '../../../../helpers/is-mobile';

export type VideoSource = {
  id: string;
  type: string;
  size: number;
  src: string;
};

@Injectable()
export class VideoPlayerService {
  /**
   * @var string
   */
  guid: string;

  /**
   * @var VideoSource[]
   */
  sources: VideoSource[];

  /**
   * @var string
   */
  status: string;

  /**
   * A poster is thumbnail
   * @var string
   */
  poster: string;

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
   * Observable for if ready
   */
  onReady$: Subject<void> = new Subject();

  constructor(private client: Client) {}

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
    this.shouldPlayInModal = shouldPlayInModal;
    return this;
  }

  /**
   * Return the sources for a video
   * @return Promise<void>
   */
  async load(): Promise<void> {
    try {
      let response = await this.client.get('api/v2/media/video/' + this.guid);
      this.sources = (<any>response).sources;
      this.poster = (<any>response).poster;
      this.status = (<any>response).transcode_status;
      this.onReady$.next();
      this.onReady$.complete();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * @return boolean
   */
  private canPlayInModal(): boolean {
    const isNotTablet: boolean = Math.min(screen.width, screen.height) < 768;
    return isMobile() && isNotTablet;
  }

  /**
   * Returns if the video is able to be played
   * @return boolean
   */
  isPlayable(): boolean {
    return (
      this.isModal || // Always playable in modal
      !this.shouldPlayInModal || // Equivalent of asking to play inline
      (this.canPlayInModal() && !this.isModal)
    ); // We can play in the modal and this isn't a modal
  }

  /**
   * Record play
   */
  async recordPlay(): Promise<void> {
    // TODO
  }
}
