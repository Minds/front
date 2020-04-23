import { Injectable } from '@angular/core';
import { Client } from '../../../common/api/client.service';
import { Session } from '../../../services/session';
import { BehaviorSubject } from 'rxjs';
import fakeData from './fake-data';

export interface YoutubeChannel {
  id: string;
  title: string;
  connected: boolean;
  auto_import: boolean;
}

@Injectable()
export class YoutubeMigrationService {
  initChannels: boolean = false;
  endpoint = 'api/v3/media/youtube-importer/';
  initVideos: any = [
    {
      video_id: '',
    },
  ];
  selectedChannel: YoutubeChannel = {
    id: '123',
    title: 'Moonboot',
    connected: true,
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
    if (!user.yt_channels || user.yt_channels.length < 1) {
      // TODOOJM delete fake-data;
      // TODOOJM toggle comment
      this.connected$.next(false);
      return false;
      // this.connected = true;
      // this.connected$.next(true);
      return true;
    } else {
      this.connected = false;
      this.connected$.next(true);
      return true;
    }
  }

  getChannels(): YoutubeChannel[] | null {
    if (!this.connected) {
      return;
    }

    //TODOOJM toggle comments
    // this.channels = [this.selectedChannel];
    this.channels = this.session.getLoggedInUser().yt_channels;
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
  async getAllVideos(channelId: string): Promise<{ videos: any }> {
    const opts = {
      channel_id: channelId,
      status: null,
    };

    try {
      const response = <any>(
        await this.client.get(`${this.endpoint}videos`, opts)
      );

      console.log('getAllVideos: ', response);

      this.unmigratedVideos$.next(
        // fakeData.unmigrated
        response.filter(v => v.status !== 'completed')
      );
      this.migratedVideos$.next(
        // fakeData.migrated
        response.filter(v => v.status === 'completed')
      );
      // return response;
    } catch (e) {
      console.error(e);
      return e;
    }
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
      console.error(e);
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
      console.error(e);
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
      console.error(e);
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
      console.error(e);
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
      console.error(e);
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
        console.error(e);
        return e;
      }
    }
    console.error('User must be logged in to disconnect youtube account');
  }
}
