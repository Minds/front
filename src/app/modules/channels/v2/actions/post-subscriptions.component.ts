import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
} from '@angular/core';
import { PostSubscriptionsService } from '../../../notifications/post-subscriptions/post-subscriptions.service';
import { ChannelsV2Service } from '../channels-v2.service';
import { PostSubscriptionFrequencyEnum } from '../../../../../graphql/generated.engine';
import { ToasterService } from '../../../../common/services/toaster.service';

/**
 * Post Notifications (bell icon)
 * Users can select to receive notifications when a user posts
 */
@Component({
  selector: 'm-channelActions__postSubscriptions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'post-subscriptions.component.html',
  styleUrls: ['post-subscriptions.component.ng.scss'],
})
export class ChannelActionsPostSubscriptionsComponent {
  channelGuid: string;
  frequency: PostSubscriptionFrequencyEnum;
  submitting = false;

  @HostBinding('hidden') get isHidden(): boolean {
    return !this.frequency;
  }

  constructor(
    private channelService: ChannelsV2Service,
    private service: PostSubscriptionsService,
    private cd: ChangeDetectorRef,
    private toaster: ToasterService
  ) {}

  ngOnInit() {
    this.channelService.guid$.subscribe(async channelGuid => {
      this.channelGuid = channelGuid;
      const postSubscription = await this.service.getPostSubscription(
        channelGuid
      );
      this.frequency = postSubscription.frequency;

      this.cd.markForCheck();
      this.cd.detectChanges();
    });
  }

  /**
   * Wires the active channel
   */
  async onClick(): Promise<void> {
    if (this.submitting) return;
    this.submitting = true;

    let newFrequency: PostSubscriptionFrequencyEnum;

    if (this.frequency === PostSubscriptionFrequencyEnum.Never) {
      newFrequency = PostSubscriptionFrequencyEnum.Always;
    } else {
      newFrequency = PostSubscriptionFrequencyEnum.Never;
    }

    try {
      await this.service.updatePostSubscription(this.channelGuid, newFrequency);
      this.frequency = newFrequency;

      this.toaster.success(
        'Post notifications are turned ' +
          (this.frequency === PostSubscriptionFrequencyEnum.Never
            ? 'off'
            : 'on')
      );
    } catch (err) {
      console.error(err);
    } finally {
      this.submitting = false;

      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }
}
