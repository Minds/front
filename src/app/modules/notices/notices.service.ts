import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';

const NOTICES_JSON_URL = 'https://cdn-assets.minds.com/notices.json';

@Injectable()
export class NoticesService {
  notices: any[] = [];

  constructor(
    protected client: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async getNotices() {
    if (isPlatformServer(this.platformId)) return; // Do not fetch on server side
    if (this.notices.length) return this.notices;
    const timestamp = Date.now();
    this.notices = (<{ notices }>(
      await this.client.get(`${NOTICES_JSON_URL}?t=${timestamp}`).toPromise()
    )).notices;
    // console.log(this.notices);
    return this.notices;
  }
}
