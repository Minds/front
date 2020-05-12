import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { FeedsService } from '../../../../common/services/feeds.service';
import { ChannelsV2Service } from '../channels-v2.service';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

/**
 * Channel connections (subscribers/subscriptions) component
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
   * Subscribe endpoint parameter subject
   */
  subscribeEndpointParam$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >(null);

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
    ])
      .pipe(distinctUntilChanged((a, b) => a.join(':') === b.join(':')))
      .subscribe(([guid, subscribeEndpointParam]) => {
        if (guid && subscribeEndpointParam) {
          this.feed
            .clear()
            .setCastToActivities(false)
            .setExportUserCounts(true)
            .setLimit(12)
            .setEndpoint(`api/v1/subscribe/${subscribeEndpointParam}/${guid}`)
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
