import { Injectable } from '@angular/core';
import { Client } from './api';

@Injectable({ providedIn: 'root' })
export class RichEmbedService {
  constructor(private client: Client) {}

  // Soundcloud
  soundcloud(url: string, maxheight: number = 320): Promise<any> {
    return this.client.get('api/v1/newsfeed/oembed/soundcloud', {
      url,
      maxheight,
    });
  }
}
