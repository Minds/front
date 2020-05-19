import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  SkipSelf,
} from '@angular/core';
import { ChannelsV2Service } from './channels-v2.service';
import { MindsUser } from '../../../interfaces/entities';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { ChannelEditIntentService } from './services/edit-intent.service';
import { WireModalService } from '../../wire/wire-modal.service';
import { SeoService } from './seo.service';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { Session } from '../../../services/session';
import { RecentService } from '../../../services/ux/recent';

/**
 * Views
 */
type ChannelView =
  | 'activities'
  | 'images'
  | 'videos'
  | 'blogs'
  | 'shop'
  | 'about'
  | 'subscribers'
  | 'subscriptions'
  | 'groups';

/**
 * 2020 Design channel component
 */
@Component({
  selector: 'm-channel-v2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'channel.component.html',
  providers: [
    ChannelsV2Service,
    ClientMetaService,
    ChannelEditIntentService,
    SeoService,
  ],
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
   * Subscription to user
   */
  protected userSubscription: Subscription;

  /**
   * Last user GUID that emitted an Analytics beacon
   */
  protected lastChannel: string;

  /**
   * Constructor
   * @param service
   * @param router
   * @param route
   * @param session
   * @param clientMeta
   * @param seo
   * @param channelEditIntent
   * @param wireModal
   * @param recent
   * @param injector
   */
  constructor(
    public service: ChannelsV2Service,
    protected router: Router,
    protected route: ActivatedRoute,
    protected session: Session,
    protected clientMeta: ClientMetaService,
    protected seo: SeoService,
    protected channelEditIntent: ChannelEditIntentService,
    protected wireModal: WireModalService,
    protected recent: RecentService,
    injector: Injector
  ) {
    this.clientMeta
      .inherit(injector)
      .setSource('single')
      .setMedium('single');
  }

  /**
   * Component initialization
   */
  ngOnInit(): void {
    // Subscribe to the active route param
    // TODO: When v1 channels are deprecated, move this and Pro to router-outlet
    this.routeSubscription = this.route.params.subscribe(params => {
      if (typeof params['filter'] !== 'undefined') {
        if (params['filter'] === 'wire') {
          this.view$.next('activities');
          this.wireModal.present(this.service.channel$.getValue()).toPromise();
          this.router.navigate([{}]);
        } else {
          this.view$.next(params['filter'] || 'activities');

          if (params['editToggle']) {
            this.channelEditIntent.edit();
            this.router.navigate([{}]);
          }
        }
      }
    });

    // Initialize SEO
    this.seo.set('Channel');

    // Subscribe to user entity and username changes for SEO
    this.userSubscription = combineLatest([
      this.service.channel$,
      this.service.username$,
      this.session.user$,
    ]).subscribe(([user, username, currentUser]) => {
      this.onChannelChange(user, username, currentUser);
    });
  }

  /**
   * Initialization per-channel load
   * @param user
   * @param username
   * @param currentUser
   */
  onChannelChange(user, username, currentUser) {
    this.seo.set(user || username || 'Channel');

    if (user && user.guid && this.lastChannel !== user.guid) {
      this.lastChannel = user.guid;
      this.clientMeta.recordView(user);

      if (currentUser && currentUser.guid !== user.guid) {
        this.recent
          .store('recent', user, entry => entry.guid == user.guid)
          .splice('recent', 50);
      }
    }
  }

  /**
   * Component destruction
   */
  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }

    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
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
