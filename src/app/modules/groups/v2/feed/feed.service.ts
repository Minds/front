// import { Injectable } from '@angular/core';
// import {
//   BehaviorSubject,
//   combineLatest,
//   EMPTY,
//   Observable,
//   Subscription,
// } from 'rxjs';
// import {
//   FeedFilterDateRange,
//   FeedFilterSort,
//   FeedFilterType,
// } from '../../../../common/components/feed-filter/feed-filter.component';
// import {
//   distinctUntilChanged,
//   map,
//   switchAll,
//   filter,
//   catchError,
//   debounceTime,
// } from 'rxjs/operators';
// import { FeedsService } from '../../../../common/services/feeds.service';
// import { ApiService } from '../../../../common/api/api.service';
// import { Router } from '@angular/router';
// import { ToasterService } from '../../../../common/services/toaster.service';
// import { GroupService } from '../group.service';

// ojm TODO
// // Compare objs
// const deepDiff = (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr);

// /**
//  * Channel feed component service, handles filtering and pagination
//  */
// @Injectable()
// export class FeedService {
//   /**
//    * Channel GUID state
//    */
//   readonly guid$: BehaviorSubject<string> = new BehaviorSubject<string>('');

//   /**
//    * Algorithm
//    */
//   readonly sort$: BehaviorSubject<FeedFilterSort> = new BehaviorSubject<
//     FeedFilterSort
//   >('latest');

//   /**
//    * Filter type state
//    */
//   readonly type$: BehaviorSubject<FeedFilterType> = new BehaviorSubject<
//     FeedFilterType
//   >('activities');

//   /**
//    * Scheduled count observable
//    */
//   readonly scheduledCount$: Observable<number>;

//   /**
//    * Filter change subscription
//    */
//   protected filterChangeSubscription: Subscription;

//   /**
//    * Constructor. Sets the main observable subscription.
//    * @param service
//    * @param api
//    */
//   constructor(
//     public service: FeedsService,
//     protected api: ApiService,
//     protected router: Router,
//     private toast: ToasterService,
//     protected groupService: GroupService
//   ) {
//     // Fetch when GUID or filter change
//     this.filterChangeSubscription = combineLatest([
//       this.guid$,
//       this.sort$,
//       this.type$,
//       this.channelsService.query$,
//       this.dateRange$,
//     ])
//       .pipe(distinctUntilChanged(deepDiff))
//       .subscribe(values => {
//         this.service.clear();
//         if (!values[0] || !values[1] || !values[2]) {
//           return;
//         }

//         const endpoint = `api/v2/feeds`;
//         const guid = values[0];
//         let sort = values[1] === 'scheduled' ? 'scheduled' : 'container';
//         const type = values[2];
//         const query = values[3];
//         const dateRange = values[4];

//         const dateRangeEnabled = !!dateRange.fromDate && !!dateRange.toDate;

//         const params: any = {
//           query: query ? query : '',
//         };

//         if (dateRangeEnabled) {
//           // Reversed from<->to because feeds are displayed
//           // in reverse chronological order
//           this.service.setFromTimestamp(dateRange.toDate);
//           params['to_timestamp'] = dateRange.fromDate;
//         } else {
//           this.service.setFromTimestamp('');
//         }

//         // Don't allow using search or date filters for scheduled posts
//         if (query || dateRangeEnabled) {
//           params['all'] = 1;
//           params['period'] = 'all';
//           sort = 'container';
//         }

//         this.service.setParams(params);

//         this.service
//           .setEndpoint(`${endpoint}/${sort}/${guid}/${type}`)
//           .setLimit(12)
//           .fetch();
//       });

//   /**
//    * Service cleanup
//    */
//   ngOnDestroy() {
//     if (this.filterChangeSubscription) {
//       this.filterChangeSubscription.unsubscribe();
//     }
//   }

//   /**
//    * Load next batch of entities
//    */
//   loadNext() {
//     if (
//       this.service.canFetchMore &&
//       !this.service.inProgress.getValue() &&
//       this.service.offset.getValue()
//     ) {
//       this.service.fetch(); // load the next 150 in the background
//     }
//     this.service.loadMore();
//   }

//   /**
//    * Handles activity deletion
//    */
//   onDelete(entity: any) {
//     if (!entity || !entity.guid) {
//       return;
//     }

//     this.service.deleteItem(entity, (item, entity) => item.urn === entity.urn);
//   }
// }
