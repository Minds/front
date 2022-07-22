import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ApiResource } from '../../common/api/api-resource.service';

import { Client } from '../../services/api';

@Injectable()
export class CommentsService {
  queryParamsSubscription$: Subscription;
  entityGuid: string;
  focusedUrn: string;
  comments: Array<any> = [];

  commentsQuery = this.apiResource.query('', {
    cachePolicy: ApiResource.CachePolicy.cacheFirst,
    cacheStorage: ApiResource.CacheStorage.Session,
  });

  constructor(
    private route: ActivatedRoute,
    private client: Client,
    private apiResource: ApiResource
  ) {
    this.queryParamsSubscription$ = this.route.queryParamMap.subscribe(
      params => {
        this.focusedUrn = params.get('focusedCommentUrn');
      }
    );
  }

  async fetch(opts) {
    return this.commentsQuery
      .fetch(opts, {
        url: `api/v2/comments/${opts.entity_guid}/0/${opts.parent_path}`,
      })
      .data$.pipe(take(2)) // FIXME: don't use take(2)
      .toPromise();
  }

  async get(opts: {
    entity_guid;
    parent_path;
    level;
    limit;
    loadNext;
    loadPrevious;
    descending;
    includeOffset?;
  }) {
    const focusedUrnObject = this.focusedUrn
      ? this.decodeUrn(this.focusedUrn)
      : null;
    if (this.focusedUrn) {
      if (opts.entity_guid != focusedUrnObject.entity_guid)
        this.focusedUrn = null; //wrong comment thread to focus on
      if (opts.loadNext || opts.loadPrevious) this.focusedUrn = null; //can not focus and have pagination
      if (this.focusedUrn && opts.parent_path === '0:0:0') {
        opts.loadNext = focusedUrnObject.parent_guid_l1;
      }
      if (
        this.focusedUrn &&
        opts.parent_path === `${focusedUrnObject.parent_guid_l1}:0:0`
      ) {
        opts.loadNext = focusedUrnObject.parent_guid_l2;
      }
      if (
        this.focusedUrn &&
        opts.parent_path ===
          `${focusedUrnObject.parent_guid_l1}:${focusedUrnObject.parent_guid_l2}:0`
      ) {
        opts.loadNext = focusedUrnObject.guid;
      }
    }

    const options: any = {
      entity_guid: opts.entity_guid,
      parent_path: opts.parent_path,
      limit: opts.limit,
      desc: opts.descending,
      include_offset: opts.includeOffset || false,
    };

    if (this.focusedUrn) {
      options['focused_urn'] = this.focusedUrn;
    }

    if (opts.loadPrevious) {
      options['load-previous'] = opts.loadPrevious;
    }

    if (opts.loadNext) {
      options['load-next'] = opts.loadNext;
    }

    const response: any = <{ comments; 'load-next'; 'load-previous' }>(
      await this.fetch(options)
    );

    if (this.focusedUrn && focusedUrnObject) {
      for (const comment of response.comments) {
        switch (opts.level) {
          case 0:
            comment.show_replies =
              comment.child_path === `${focusedUrnObject.parent_guid_l1}:0:0`;
            break;
          case 1:
            comment.show_replies =
              comment.child_path ===
              `${focusedUrnObject.parent_guid_l1}:${focusedUrnObject.parent_guid_l2}:0`;
            break;
          default:
            console.log('Level out of scope', opts.level);
        }
        comment.focused = comment._guid === focusedUrnObject.guid;
      }
    }

    // only use once
    this.focusedUrn = null;
    return response;
  }

  async single({ entity_guid, guid, parent_path }) {
    const response: any = await this.client.get(
      `api/v2/comments/${entity_guid}/${guid}/${parent_path}`,
      {
        limit: 1,
        reversed: false,
        descending: false,
      }
    );

    if (!response.comments || response.comments.length === 0) {
      return null;
    }

    if (response.comments[0]._guid != guid) {
      return null;
    }

    return response.comments[0];
  }

  private decodeUrn(urn) {
    const parts = urn.split(':');

    const obj = {
      entity_guid: parts[2],
      parent_guid_l1: parts[3],
      parent_guid_l2: parts[4],
      parent_guid_l3: parts[5],
      guid: parts[6],
      parent_path: parts[5] ? `${parts[3]}:${parts[4]}:0` : `${parts[3]}:0:0`,
    };

    return obj;
  }
}
