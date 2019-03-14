import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {FeaturesService} from "../../services/features.service";

const RELEASES_JSON_URL = 'https://cdn-assets.minds.com/android/releases/releases.json';

@Injectable()
export class MobileService {
  releases: any[] = [];

  constructor(
    protected client: HttpClient,
    protected featuresService: FeaturesService
  ) {
  }

  async getReleases() {
    this.releases = (<{ versions }>await this.client.get(RELEASES_JSON_URL).toPromise()).versions;

    const latest = this.releases.findIndex(release => !release.unstable);
    if (latest > -1) {
      this.releases[latest].latest = true;
    }

    return this.releases.filter(release => !this.shouldBeStable() || !release.unstable);
  }

  shouldBeStable() {
    return !this.featuresService.has('mobile-canary');
  }

  static _(client: HttpClient, featuresService: FeaturesService) {
    return new MobileService(client, featuresService);
  }
}
