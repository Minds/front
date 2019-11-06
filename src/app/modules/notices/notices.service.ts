import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const NOTICES_JSON_URL = 'https://cdn-assets.minds.com/notices.json';

@Injectable()
export class NoticesService {
  notices: any[] = [];

  constructor(protected client: HttpClient) {}

  async getNotices() {
    if (this.notices.length) return this.notices;
    const timestamp = Date.now();
    this.notices = (<{ notices }>(
      await this.client.get(`${NOTICES_JSON_URL}?t=${timestamp}`).toPromise()
    )).notices;
    // console.log(this.notices);
    return this.notices;
  }
}
