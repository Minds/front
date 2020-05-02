import { Injectable } from '@angular/core';
import { Client } from '../../../common/api/client.service';
import { Session } from '../../../services/session';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';

export interface YoutubeChannel {
  id: string;
  title: string;
  connected: number;
  auto_import: boolean;
}

@Injectable()
export class YoutubeMigrationService {
  endpoint = 'api/v3/media/youtube-importer/';
  initChannels: boolean = false;
  channels: YoutubeChannel[];

  // Prime behavior subjects with dummy data
  selectedChannelPrimer: YoutubeChannel = {
    id: '',
    title: '',
    connected: 1,
    auto_import: false,
  };
  statusCountsPrimer: any = {
    queued: 0,
    transferring: 0,
  };

  // Set up behavior subjects
  connected$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  autoImport$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  importingAllVideos$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  selectedChannel$: BehaviorSubject<YoutubeChannel> = new BehaviorSubject(
    this.selectedChannelPrimer
  );
  statusCounts$: BehaviorSubject<any> = new BehaviorSubject(
    this.statusCountsPrimer
  );

  // These current values of the behavior subjects are used inside the service
  connected: boolean = false;
  selectedChannel: YoutubeChannel;

  constructor(private client: Client, protected session: Session) {}

  /**
   * Check if current user has connected a YouTube account
   */
  isConnected(): boolean {
    const user = this.session.getLoggedInUser();
    this.connected$.subscribe(connected => {
      this.connected = connected;
    });
    if (!user.yt_channels || user.yt_channels.length < 1) {
      this.connected$.next(false);
    } else {
      this.connected$.next(true);
    }
    return this.connected;
  }

  /**
   * Get array of youtube channels associated with user
   */
  getChannels(): YoutubeChannel[] | null {
    if (!this.connected) {
      return;
    }
    this.channels = this.session.getLoggedInUser().yt_channels;

    // On load, select the first channel by default
    if (!this.initChannels) {
      this.selectChannel(this.channels[0].id);
    }
    this.initChannels = true;
    return this.channels;
  }

  /**
   * (Planning ahead to support multiple channel drop-down)
   * @param channelId
   */
  selectChannel(channelId: string): YoutubeChannel | null {
    if (!this.connected) {
      return;
    }
    this.selectedChannel$.subscribe(channel => {
      this.selectedChannel = channel;
    });

    const selectedChannel =
      this.channels.find(c => c.id === channelId) || this.channels[0];

    this.selectedChannel$.next(selectedChannel);
    this.autoImport$.next(selectedChannel.auto_import);

    return selectedChannel;
  }

  /**
   * Get videos from selected youtube channel
   *
   * Null status returns from youtube SDK and joins with Cassandra where exists
   * Status value queries Cassandra only
   *
   * Additional fields (owner entity, video entity) included in response for
   * videos that have been transferred to Minds (or are queued/transcoding)
   * @param status
   */
  async getVideos(
    status: string | null = null,
    nextPageToken: string | null = null
  ): Promise<{ void }> {
    if (!this.connected) {
      return;
    }

    const opts = {
      status: status,
      nextPageToken: nextPageToken,
      channelId: this.selectedChannel.id,
    };

    try {
      const response = <any>(
        await this.client.get(`${this.endpoint}videos`, opts)
      );

      response.videos = this.formatVideos(response.videos);

      return response;
    } catch (e) {
      console.error('getAllVideos(): ', e);
      return e;
    }
  }

  /**
   * Get status of a single video
   * (after importing has been triggered or cancelled)
   *
   * @param youtubeId
   */
  async getVideoStatus(youtubeId: string): Promise<{ void }> {
    if (!this.connected) {
      return;
    }

    const opts = {
      youtubeId: youtubeId,
      status: null,
      channelId: this.selectedChannel.id,
    };

    try {
      const response = <any>(
        await this.client.get(`${this.endpoint}videos`, opts)
      );

      return response.videos[0].status;
    } catch (e) {
      console.error('getVideoStatus(): ', e);
      return e;
    }
  }

  /**
   * Get count of video statuses (queued, transferred) from selected youtube channel
   */
  async getStatusCounts(): Promise<any> {
    if (!this.connected) {
      return;
    }
    try {
      const response = <any>await this.client.get(
        `${this.endpoint}videos/count`,
        {
          channelId: this.selectedChannel.id,
        }
      );

      this.statusCounts$.next(response.counts);

      return response.counts;
    } catch (e) {
      console.error('count(): ', e);
      return e;
    }
  }

  /**
   * Migrate youtube video(s) to Minds
   *
   * (videoId === 'all' will migrate all)
   * @param videoId
   */
  async import(videoId: string): Promise<any> {
    if (!this.connected) {
      return;
    }
    const opts = {
      channelId: this.selectedChannel.id,
      videoId: videoId,
    };

    try {
      const response = <any>(
        await this.client.post(`${this.endpoint}videos/import`, opts)
      );

      // Send out a trigger to refresh unmigrated video list so
      // video transfer statuses are visually updated
      if (videoId === 'all') {
        this.importingAllVideos$.next(true);
      }
      this.getStatusCounts();

      return response;
    } catch (e) {
      console.error('import(): ', e);
      return e;
    }
  }

  /**
   * Cancel a video that has been marked for import
   *
   * @param videoId
   */
  async cancelImport(videoId: string): Promise<any> {
    if (!this.connected) {
      return;
    }
    // const opts = {
    //   channelId: this.selectedChannel.id,
    //   videoId: videoId,
    // };
    try {
      const response = <any>(
        await this.client.delete(
          `${this.endpoint}videos/import?channelId=${this.selectedChannel.id}&videoId=${videoId}`
        )
      );
      this.getStatusCounts();
      return response;
    } catch (e) {
      console.error('cancelImport()', e);
      return e;
    }
  }

  /**
   * Automatically transfer of newly-uploaded youtube videos to Minds
   */
  async enableAutoImport(): Promise<any> {
    if (!this.connected) {
      this.getChannels();
    }
    const opts = {
      channelId: this.selectedChannel.id,
    };
    try {
      const response = <any>(
        await this.client.post(`${this.endpoint}subscribe`, opts)
      );

      this.autoImport$.next(true);
      return response;
    } catch (e) {
      console.error('enableAutoImport: ', e);
      return e;
    }
  }

  /**
   * Disable automatic transfer of newly-uploaded youtube videos to Minds
   */
  async disableAutoImport(): Promise<any> {
    if (!this.connected) {
      return;
    }

    try {
      const response = <any>(
        await this.client.delete(
          `${this.endpoint}subscribe?channelId=${this.selectedChannel.id}`
        )
      );
      this.autoImport$.next(false);
      return response;
    } catch (e) {
      console.error('disableAutoImport(): ', e);
      return e;
    }
  }

  /**
   * Connect youtube account to Minds using google oauth.
   * Need to redirect to response.url, then will be automatically redirected back
   * to previous location after user authorizes
   */
  async connectAccount(): Promise<{ url: string }> {
    try {
      const response = <any>await this.client.get(`${this.endpoint}account`);

      this.connected$.next(true);
      return response;
    } catch (e) {
      console.error('connectAccount(): ', e);
      return e;
    }
  }

  /**
   * Disconnect youtube account from Minds
   * @param channelId
   */
  async disconnectAccount(): Promise<any> {
    if (this.session.isLoggedIn()) {
      try {
        const response = <any>(
          await this.client.delete(
            `${this.endpoint}account?channelId=${this.selectedChannel.id}`
          )
        );

        this.connected$.next(false);
        return response;
      } catch (e) {
        console.error('disconnectAccount(): ', e);
        return e;
      }
    }
    console.error('User must be logged in to disconnect youtube account');
  }

  // UTILITY /////////////////////////////////////////////////////////////
  /**
   * Format video response for display template
   */
  formatVideos(videos: any): any {
    if (!videos) {
      return;
    }
    videos.forEach(v => {
      v.display = {};
      v.display.duration = this.formatDuration(v.duration);

      if (v.status === 'completed') {
        v.display.title = v.entity.title;
        v.display.thumb = v.entity.thumbnail_src;
        v.display.date = this.formatDate(v.entity.time_created);
      } else {
        v.display.title = v.title;
        v.display.thumb = v.thumbnail;
        v.display.date = this.formatDate(v.youtubeCreationDate);
      }
      // Handle null view count
      v.views = v.views || 0;
    });
    return videos;
  }

  /**
   * Format duration for video display template
   */
  formatDuration(duration: string | number): string {
    const durationFormat = duration >= 3600 ? 'H:mm:ss' : 'mm:ss';
    return moment
      .utc(moment.duration(Number(duration), 'seconds').asMilliseconds())
      .format(durationFormat);
  }

  /**
   * Format create date for video display template
   */
  formatDate(date: string | number): string {
    return moment(date, 'X').format('MMM Do YYYY');
  }
}
