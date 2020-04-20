import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ChannelsV2Service } from './channels-v2.service';
import { MindsUser } from '../../../interfaces/entities';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

/**
 * Views
 */
type ChannelView =
  | 'activities'
  | 'images'
  | 'videos'
  | 'blogs'
  | 'shop'
  | 'about';

/**
 * 2020 Design channel component
 */
@Component({
  selector: 'm-channel-v2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'channel.component.html',
  providers: [ChannelsV2Service],
})
export class ChannelComponent implements OnInit, OnDestroy {
  /**
   * Input that sets the current channel
   * @param channel
   * @private
   */
  @Input('channel') set _channel(channel: MindsUser) {
    this.service.load(channel);
  }

  /**
   * Active view
   */
  readonly view$: BehaviorSubject<ChannelView> = new BehaviorSubject<
    ChannelView
  >('activities');

  /**
   * Subscription to current active route
   */
  protected routeSubscription: Subscription;

  /**
   * Constructor
   * @param service
   * @param route
   */
  constructor(
    public service: ChannelsV2Service,
    protected route: ActivatedRoute
  ) {}

  /**
   * Component initialization
   */
  ngOnInit(): void {
    // Subscribe to the active route param
    // TODO: When v1 channels are deprecated, move this and Pro to router-outlet
    this.routeSubscription = this.route.params.subscribe(params => {
      if (typeof params['filter'] !== 'undefined') {
        this.view$.next(params['filter'] || 'activities');
      }
    });
  }

  /**
   * Component destruction
   */
  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  /**
   * Can navigate away?
   */
  canDeactivate(): boolean {
    // TODO
    return true;
  }
}
