import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FeedsService } from '../../../../common/services/feeds.service';
import { ChannelsV2Service } from '../channels-v2.service';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

/**
 * Channel groups component
 */
@Component({
  selector: 'm-channelList__groups',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'groups.component.html',
  providers: [FeedsService],
})
export class ChannelListGroupsComponent implements OnDestroy {
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
    this.guidSubscription = this.service.guid$
      .pipe(distinctUntilChanged())
      .subscribe(guid => {
        if (guid) {
          this.feed
            .clear()
            .setCastToActivities(false)
            .setExportUserCounts(false)
            .setLimit(12)
            .setEndpoint(`api/v3/channel/${guid}/groups`)
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
