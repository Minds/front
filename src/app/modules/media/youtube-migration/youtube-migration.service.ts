import { Injectable } from '@angular/core';
import { Client } from '../../../common/api/client.service';
import { Session } from '../../../services/session';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import fakeData from './fake-data';

export interface YoutubeChannel {
  id: string;
  title: string;
  connected: number;
  auto_import: boolean;
}

@Injectable()
export class YoutubeMigrationService {
  initChannels: boolean = false;
  endpoint = 'api/v3/media/youtube-importer/';
  initVideos: Array<any> = [
    {
      video_id: '',
    },
  ];
  // TODOOJM remove moonboot 123
  selectedChannel: YoutubeChannel = {
    id: '',
    title: '',
    connected: 1588013297,
    auto_import: false,
  };
  channels: YoutubeChannel[];
  connected: boolean = false;

  connected$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  selectedChannel$: BehaviorSubject<YoutubeChannel> = new BehaviorSubject(
    this.selectedChannel
  );
  unmigratedVideos$: BehaviorSubject<any> = new BehaviorSubject(
    this.initVideos
  );
  migratedVideos$: BehaviorSubject<any> = new BehaviorSubject(this.initVideos);

  constructor(private client: Client, protected session: Session) {}

  /**
   * Check if current user has connected a YouTube account
   */
  isConnected(): boolean {
    const user = this.session.getLoggedInUser();
    console.log('888 isconnected ch', user.yt_channels);
    if (!user.yt_channels || user.yt_channels.length < 1) {
      this.connected = false;
      this.connected$.next(false);
      return false;
    } else {
      this.connected = true;
      this.connected$.next(true);
      return true;
    }
  }

  getChannels(): YoutubeChannel[] | null {
    if (!this.connected) {
      console.log('888 getchannels is connected?', this.connected);
      return;
    }
    this.channels = this.session.getLoggedInUser().yt_channels;

    console.log('888getchannels()', this.channels);
    if (!this.initChannels) {
      this.selectChannel(this.channels[0].id);
    }
    this.initChannels = true;
    return this.channels;
  }

  /**
   * Planning ahead to support multiple channel drop-down
   * @param channelId
   */
  selectChannel(channelId: string): YoutubeChannel | null {
    if (!this.connected) {
      return;
    }
    const selectedChannel =
      this.channels.find(c => c.id === channelId) || this.channels[0];
    if (!this.selectedChannel.connected) {
      return;
    }
    //todoojm remove
    console.log('888 selected channel', selectedChannel);

    this.selectedChannel$.next(selectedChannel);

    // Refresh unmigratedVideos$ and migratedVideos$
    this.getAllVideos(selectedChannel.id);

    return selectedChannel;
  }

  /**
   *
   * Get all videos from youtube account with given channelId
   *
   * Null status returns from youtube SDK and joins with Cassandra where exists
   *
   * Additional fields (owner entity, video entity) included on
   * videos that have been transferred to Minds (or are queued/transcoding)
   * @param channelId
   */
  async getAllVideos(channelId: string): Promise<{ void }> {
    console.log('888 getallvids run?');
    if (!channelId) {
      console.log('888 not giving an id to getallvideos');
    }
    const opts = {
      channelId: channelId,
      status: null,
    };

    try {
      const response = <any>(
        await this.client.get(`${this.endpoint}videos`, opts)
      );

      console.log('888 getAllVideos: ', response);
      response.videos.forEach(v => {
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
      });

      console.log(
        '888 formatted vids',
        response.videos,
        response.videos[0].display
      );
      this.unmigratedVideos$.next(
        response.filter(v => v.status !== 'completed')
      );
      this.migratedVideos$.next(response.filter(v => v.status === 'completed'));
    } catch (e) {
      console.error('getAllVideos(): ', e);
      return e;
    }
  }

  formatDuration(duration: string | number): string {
    const durationFormat = duration >= 3600 ? 'H:mm:ss' : 'mm:ss';
    return moment
      .utc(moment.duration(Number(duration), 'seconds').asMilliseconds())
      .format(durationFormat);
  }

  formatDate(date: string | number): string {
    return moment(date, 'X').format('MMM Do YYYY');
  }

  /**
   * Migrate youtube video(s) to Minds
   *
   * (videoId === 'all' will migrate all)
   * @param channelId
   * @param videoId
   */
  async import(channelId: string, videoId: string): Promise<any> {
    try {
      const response = <any>await this.client.post(
        `${this.endpoint}videos/import`,
        {
          channelId,
          videoId,
        }
      );

      console.log('import: ', response);

      // Refresh unmigratedVideos$ and migratedVideos$
      this.getAllVideos(channelId);
      return response;
    } catch (e) {
      console.error('import(): ', e);
      return e;
    }
  }

  /**
   * Cancel a video that has been marked for import
   *
   * @param channelId
   * @param videoId
   */
  async cancelImport(channelId: string, videoId: string): Promise<any> {
    try {
      const response = <any>await this.client.delete(
        `${this.endpoint}videos/import`,
        {
          channelId,
          videoId,
        }
      );

      console.log('cancel import: ', response);
      this.getAllVideos(channelId);
      return response;
    } catch (e) {
      console.error('cancelImport()', e);
      return e;
    }
  }

  /**
   * Automatically transfer of newly-uploaded youtube videos to Minds
   * @param channelId
   */
  async enableAutoImport(channelId): Promise<any> {
    try {
      const response = <any>await this.client.post(
        `${this.endpoint}subscribe`,
        {
          channelId,
        }
      );

      console.log('EnableAutoTransfer: ', response);
      return response;
    } catch (e) {
      console.error('enableAutoImport: ', e);
      return e;
    }
  }

  /**
   * Disable automatic transfer of newly-uploaded youtube videos to Minds
   * @param channelId
   */
  async disableAutoImport(channelId): Promise<any> {
    try {
      const response = <any>await this.client.delete(
        `${this.endpoint}subscribe`,
        {
          channelId,
        }
      );

      console.log('DisableAutoTransfer: ', response);
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
      console.log('connectAccount:', response, response.url);
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
  async disconnectAccount(channelId: string): Promise<any> {
    if (this.session.isLoggedIn()) {
      try {
        const response = <any>(
          await this.client.delete(`${this.endpoint}account`, { channelId })
        );

        this.connected$.next(false);
        console.log('disconnectAccount:', response);
        return response;
      } catch (e) {
        console.error('disconnectAccount(): ', e);
        return e;
      }
    }
    console.error('User must be logged in to disconnect youtube account');
  }
}
