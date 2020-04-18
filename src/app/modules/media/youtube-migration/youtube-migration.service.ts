import { Injectable } from '@angular/core';
import { Client } from '../../../common/api/client.service';
import { Session } from '../../../services/session';

@Injectable()
export class YoutubeMigrationService {
  constructor(private client: Client, protected session: Session) {}

  async requestAuthorization(): Promise<{ url: string }> {
    const response = <any>(
      await this.client.get('api/v3/media/youtube-importer/oauth')
    );

    console.log('oauthresponse', response, response.url);
    return response;
  }

  async getVideos(channelId, status): Promise<{ videos: any }> {
    const response = <any>(
      await this.client.get('api/v3/media/youtube-importer/videos')
    );

    console.log('getVideos response', response);
    return response;
  }
}
