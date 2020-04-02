import { Injectable } from '@angular/core';

import { Client } from '../../common/api/client.service';
import { Storage } from '../../services/storage';
import { CookieService } from '../../common/services/cookie.service';

type ExperimentBucket = {
  experimentId: string;
  bucketId: string;
};

@Injectable()
export class ExperimentsService {
  experiments = [];
  fetching: boolean = false;

  constructor(private client: Client, private cookieService: CookieService) {}

  getExperimentBucket(experiment) {
    return this.cookieService.get(`experiments:${experiment}`);
  }

  // Return if the bucket is valid
  async shouldRender(opts: ExperimentBucket) {
    if (this.cookieService.get(`experiments:${opts.experimentId}`)) {
      this.experiments[opts.experimentId] = this.cookieService.get(
        `experiments:${opts.experimentId}`
      );
    }

    let bucket = this.experiments[opts.experimentId];

    if (bucket) {
      return bucket === opts.bucketId;
    }

    if (this.fetching) {
      await new Promise((res, rej) => setTimeout(res, 50));
      return this.shouldRender(opts);
    }

    try {
      this.fetching = true;
      let response: any = await this.client.get(
        `api/v2/experiments/${opts.experimentId}`
      );
      bucket = response.bucketId;
    } catch (err) {
      bucket = 'base';
    }

    this.experiments[opts.experimentId] = bucket;
    this.cookieService.put(`experiments:${opts.experimentId}`, bucket);
    this.fetching = false;

    return bucket === opts.bucketId;
  }
}
