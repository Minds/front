/**
 * @author Ben Hayward
 * @create date 2019-08-16 15:00:04
 * @modify date 2019-08-16 15:00:04
 * @desc Mock service for feed.spec.ts
 */
import { BehaviorSubject, of } from 'rxjs';

export let feedsServiceMock = {
  canFetchMore: true,
  inProgress: new BehaviorSubject(false),
  offset: new BehaviorSubject<number>(0),
  feed: new BehaviorSubject([Promise.resolve('[1,2,3,4,5]')]),
  clear() {
    of({ response: false }, { response: false }, { response: true });
  },
  response() {
    return { response: true };
  },
  setEndpoint(str) {
    return this;
  }, //chainable
  setLimit(limit) {
    return this;
  },
  setParams(params) {
    return this;
  },
  setUnseen(params) {
    return this;
  },
  fetch() {
    return this;
  },
  loadMore() {
    return this;
  },
};
