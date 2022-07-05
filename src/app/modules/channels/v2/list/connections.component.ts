import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { FeedsService } from '../../../../common/services/feeds.service';
import { ChannelsV2Service } from '../channels-v2.service';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * Channel connections (subscribers/subscriptions) component
 * List of a channel's subscribers or subscriptions.
 * Located in the channel "about" section
 */
@Component({
  selector: 'm-channelList__connections',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'connections.component.html',
  providers: [FeedsService],
})
export class ChannelListConnectionsComponent implements OnDestroy {
  /**
   * Subscribe endpoint parameter binding
   * @param value
   * @private
   */
  @Input('subscribeEndpointParam') set _subscribeEndpointParam(value: string) {
    this.subscribeEndpointParam$.next(value);
  }

  /**
   * Can search flag binding
   * @param value
   * @private
   */
  @Input() canSearch: boolean = false;

  /**
   * Subscribe endpoint parameter subject
   */
  readonly subscribeEndpointParam$: BehaviorSubject<
    string
  > = new BehaviorSubject<string>(null);

  /**
   * Search query
   */
  readonly searchQuery$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  /**
   * GUID subscription
   */
  protected guidSubscription: Subscription;

  /**
   * Constructor
   * @param service
   * @param feed
   */
  constructor(public service: ChannelsV2Service, public feed: FeedsService) {
    this.guidSubscription = combineLatest([
      this.service.guid$,
      this.subscribeEndpointParam$,
      this.searchQuery$.pipe(debounceTime(300)),
    ])
      .pipe(distinctUntilChanged((a, b) => a.join(':') === b.join(':')))
      .subscribe(([guid, subscribeEndpointParam, searchQuery]) => {
        if (guid && subscribeEndpointParam) {
          let endpoint;

          switch (subscribeEndpointParam) {
            case 'subscriptions':
              endpoint = `api/v3/subscriptions/graph/${guid}/${subscribeEndpointParam}`;
              break;

            default:
              endpoint = `api/v1/subscribe/${subscribeEndpointParam}/${guid}`;
          }

          this.feed
            .clear()
            .setCastToActivities(false)
            .setExportUserCounts(true)
            .setLimit(12)
            .setEndpoint(endpoint)
            .setParams({
              q: searchQuery,
            })
            .fetch();
        }
      });
  }

  /**
   * Component destroy lifecycle hook
   */
  ngOnDestroy() {
    if (this.guidSubscription) {
      this.guidSubscription.unsubscribe();
    }
  }
}
