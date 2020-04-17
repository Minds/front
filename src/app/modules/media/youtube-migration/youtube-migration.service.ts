import { Injectable } from '@angular/core';
import { Client } from '../../../common/api/client.service';
import { Session } from '../../../services/session';

@Injectable()
export class YoutubeMigrationService {
  constructor(private client: Client, protected session: Session) {}

  async requestAuthorization() {
    const response = <any>(
      await this.client.get('api/v3/media/youtube-importer/oauth')
    );

    console.log('oauthresponse', response, response.url);
    window.location.replace(response.url);
    // return response;
  }
}
