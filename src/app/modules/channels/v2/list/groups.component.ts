import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FeedsService } from '../../../../common/services/feeds.service';
import { ChannelsV2Service } from '../channels-v2.service';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * Channel groups component
 * List of groups a channel is a member of.
 * Located in the channel "about" section
 */
@Component({
  selector: 'm-channelList__groups',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'groups.component.html',
  providers: [FeedsService],
})
export class ChannelListGroupsComponent implements OnDestroy {
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
  constructor(
    public service: ChannelsV2Service,
    public feed: FeedsService
  ) {
    this.guidSubscription = combineLatest([
      this.service.guid$,
      this.searchQuery$.pipe(debounceTime(300)),
    ])
      .pipe(distinctUntilChanged((a, b) => a.join(':') === b.join(':')))
      .subscribe(([guid, searchQuery]) => {
        if (guid) {
          this.feed
            .clear()
            .setCastToActivities(false)
            .setExportUserCounts(false)
            .setLimit(12)
            .setEndpoint(`api/v3/channel/${guid}/groups`)
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
