/**
 * @author Ben Hayward
 * @desc Service containing admin related functions.
 */
import { Injectable } from '@angular/core';
import { Client } from '../../services/api/client';

@Injectable()
export class AdminService {
  constructor(private client: Client) {}

  /**
   * Manually transcode a video.
   * @param { string } guid - the video's guid.
   * @returns { boolean } true if response returns success.
   */
  public async transcode(guid: string): Promise<boolean> {
    try {
      const response: any = await this.client.post('api/v2/admin/transcode', {
        guid: guid,
      });
      if (response.status === 'success') {
        return true;
      } else {
        console.error(response.message);
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
