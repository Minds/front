import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ChannelContentService } from './content.service';
import { Session } from '../../../../services/session';
import { Subscription } from 'rxjs';

/**
 * A container for channel loading errors.
 * (channel not found, channel banned ect).
 *
 * @author Ben Hayward
 */
@Component({
  selector: 'm-channel__content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'content.component.html',
  providers: [ChannelContentService],
  host: { '[class.m-channelContent--nsfw]': 'channelIsNsfw' },
})
export class ChannelContentComponent implements OnInit, OnDestroy {
  /**
   * Assets CDN URL
   */
  readonly cdnAssetsUrl: string;

  protected stateSubscription: Subscription;

  protected channelIsNsfw: boolean = false;

  /**
   * Constructor
   * @param content
   * @param session
   * @param configs
   */
  constructor(
    public content: ChannelContentService,
    public session: Session,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    this.stateSubscription = this.content.state$.subscribe(state => {
      this.channelIsNsfw = state === 'nsfw';
    });
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }
}
