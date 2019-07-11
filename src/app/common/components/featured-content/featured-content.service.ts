import { Injectable } from "@angular/core";
import { filter, first, map, switchMap } from 'rxjs/operators';
import { FeedsService } from "../../services/feeds.service";

@Injectable()
export class FeaturedContentService {

  offset: number = -1;

  constructor(
    protected feedsService: FeedsService,
  ) {
    this.feedsService
      .setLimit(50)
      .setOffset(0)
      .setEndpoint('api/v2/boost/feed')
      .fetch();
  }

  async fetch() {
    return await this.feedsService.feed
      .pipe(
        filter(feed => feed.length > 0),
        first(),
        map(feed => feed[this.offset++]),
        switchMap(async entity => {
          if (!entity)
            return false;
          return await entity.pipe(first()).toPromise();
        }),
      ).toPromise();
  }
}
