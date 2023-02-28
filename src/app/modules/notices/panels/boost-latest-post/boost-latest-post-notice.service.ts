import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, map, share, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../../common/api/api.service';
import { Session } from '../../../../services/session';
import { ActivityEntity } from '../../../newsfeed/activity/activity.service';

/**
 * Channel feed response from server.
 */
export type ChannelFeedResponse = {
  status: string;
  entities: ActivityEntity[];
};

@Injectable()
export class BoostLatestPostNoticeService {
  /**
   * Logged in user guid
   */
  loggedInUserGuid$: BehaviorSubject<string> = new BehaviorSubject(
    this.session.getLoggedInUser().guid
  );

  /**
   * Latest post made by logged in user, if any
   */
  latestPost$: Observable<any> = this.loggedInUserGuid$.pipe(
    switchMap(guid => {
      return this.api.get(`api/v2/feeds/container/${guid}/activities`, {
        sync: 1,
        limit: 1,
      });
    }),
    catchError(e => this.handleApiError(e)),
    map((apiResponse: ChannelFeedResponse) => {
      return apiResponse.entities[0] || null;
    })
    // ,share()
  );

  constructor(private api: ApiService, private session: Session) {}

  /**
   * Handle errors from API.
   * @param { any } e - error
   * @returns { Observable<never> } RXJS EMPTY;
   */
  private handleApiError(e: any): Observable<never> {
    console.error(e);
    return EMPTY;
  }
}
