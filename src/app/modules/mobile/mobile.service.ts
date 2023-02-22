import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Session } from '../../services/session';

const RELEASES_JSON_URL =
  'https://cdn-assets.minds.com/android/releases/releases.json';

@Injectable()
export class MobileService {
  releases: any[] = [];

  constructor(protected client: HttpClient, protected session: Session) {}

  async getReleases() {
    const user = this.session.getLoggedInUser();

    const timestamp = Date.now();
    this.releases = (<{ versions }>(
      await this.client.get(`${RELEASES_JSON_URL}?t=${timestamp}`).toPromise()
    )).versions;

    const latest = this.releases.findIndex(release => !release.unstable);
    if (latest > -1) {
      this.releases[latest].latest = true;
    }

    const releases = this.releases.filter(
      release => !this.shouldBeStable() || !release.unstable
    );

    if (user.canary) {
      releases.sort((r1, r2) => (r1.unstable && !r2.unstable ? -1 : 0));
    } else {
      releases.sort((r1, r2) => (r2.unstable && !r1.unstable ? -1 : 0));
    }

    return releases;
  }

  shouldBeStable() {
    // ojm what to do here
    // return !this.featuresService.has('mobile-canary');
    return true;
  }

  static _(client: HttpClient, session: Session) {
    return new MobileService(client, session);
  }
}
