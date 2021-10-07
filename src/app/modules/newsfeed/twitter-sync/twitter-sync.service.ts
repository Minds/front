import { Injectable } from '@angular/core';
import { ApiService } from '../../../common/api/api.service';

@Injectable()
export class TwitterSyncService {
  constructor(protected api: ApiService) {}

  /**
   * Returns account. Null means its not setup
   */
  async getConnectedAccount(): Promise<any> {
    return await this.api.get('api/v3/twitter-sync').toPromise();
  }

  /**
   * Creates or updates account
   */
  async createConnectAccount(twitterUsername: string): Promise<void> {
    await this.api
      .post('api/v3/twitter-sync/connect', {
        username: twitterUsername,
      })
      .toPromise();
  }

  /**
   * Disconnect account (backend deletes record)
   */
  async disconnectAccount(): Promise<void> {
    await this.api.delete('api/v3/twitter-sync').toPromise();
  }

  /**
   * Update an already connected account
   */
  async updateSettings(settings: { discoverable: boolean }): Promise<void> {
    await this.api.post('api/v3/twitter-sync', settings).toPromise();
  }
}
