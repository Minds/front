import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  SkipSelf,
} from '@angular/core';
import { ChannelsV2Service } from './channels-v2.service';
import { MindsUser } from '../../../interfaces/entities';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, fromEvent, Subscription } from 'rxjs';
import { ChannelEditIntentService } from './services/edit-intent.service';
import { WireModalService } from '../../wire/wire-modal.service';
import { SeoService } from './seo.service';
import { Session } from '../../../services/session';
import { RecentService } from '../../../services/ux/recent';
import { ClientMetaDirective } from '../../../common/directives/client-meta.directive';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { FormToastService } from '../../../common/services/form-toast.service';
import { PublisherSearchModalService } from '../../../common/services/publisher-search-modal.service';

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
  styleUrls: ['channel.component.ng.scss'],
  providers: [ChannelsV2Service, ChannelEditIntentService, SeoService],
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
   * Active layout
   */
  public layout: string = 'list';

  /**
   * Subscription to current view
   */
  protected viewSubscription: Subscription;

  /**
   * Subscription to current active route
   */
  protected routeSubscription: Subscription;

  /**
   * Subscription to router events
   */
  protected routerSubscription: Subscription;

  /**
   * Query param subscription
   */
  protected queryParamSubscription: Subscription;

  /**
   * Subscription to user
   */
  protected userSubscription: Subscription;

  /**
   * Last user GUID that emitted an Analytics beacon
   */
  protected lastChannel: string;

  protected currentChannel: MindsUser;
  /**
   * True if the selected tab is 'feed'
   */
  isFeedView: boolean = true;

  /**
   * Constructor
   * @param service
   * @param router
   * @param route
   * @param session
   * @param seo
   * @param channelEditIntent
   * @param wireModal
   * @param recent
   * @param parentClientMeta
   * @param clientMetaService
   */
  constructor(
    public service: ChannelsV2Service,
    protected router: Router,
    protected route: ActivatedRoute,
    protected session: Session,
    protected seo: SeoService,
    protected channelEditIntent: ChannelEditIntentService,
    protected wireModal: WireModalService,
    protected recent: RecentService,
    @Optional() @SkipSelf() protected parentClientMeta: ClientMetaDirective,
    protected clientMetaService: ClientMetaService,
    protected cd: ChangeDetectorRef,
    protected toasterService: FormToastService,
    protected injector: Injector,
    protected publisherSearchModal: PublisherSearchModalService
  ) {}

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

    this.viewSubscription = this.view$.subscribe(view => {
      this.isFeedView = ['activities', 'images', 'videos', 'blogs'].includes(
        view
      );
    });

    // Initialize SEO
    this.seo.set('Channel');

    // Subscribe to user entity and username changes for SEO
    this.userSubscription = combineLatest([
      this.service.channel$,
      this.service.username$,
      this.session.user$,
    ]).subscribe(([user, username, currentUser]) => {
      this.currentChannel = user;
      this.onChannelChange(user, username, currentUser);
    });

    this.queryParamSubscription = this.route.queryParamMap.subscribe(params => {
      if (params.has('layout')) {
        this.layout = params.get('layout');
        this.detectChanges();
      }

      if (params.has('editing') && JSON.parse(params.get('editing'))) {
        this.channelEditIntent.edit();
      }
    });

    // update seo on navigation events
    this.routerSubscription = this.router.events.subscribe(
      (navigationEvent: NavigationEnd) => {
        if (navigationEvent instanceof NavigationEnd) {
          this.seo.set(this.currentChannel);
        }
      }
    );
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
      this.clientMetaService.recordView(user, this.parentClientMeta, {
        source: 'single',
        medium: 'single',
      });

      if (currentUser && currentUser.guid !== user.guid) {
        this.recent.storeSuggestion(
          'publisher',
          user,
          entry => entry.guid === user.guid
        );
      }

      if (user.blocked_by) {
        this.toasterService.warn(
          `${user.name} has blocked you. You will not be able to interact with them.`
        );
      }
    }
  }

  /**
   * Opens search modal
   */
  async openSearchModal(event): Promise<void> {
    const query = await this.publisherSearchModal
      .present(this.injector, this.currentChannel)
      .toPromise();

    if (query) {
      this.service.query$.next(query);
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

    if (this.queryParamSubscription) {
      this.queryParamSubscription.unsubscribe();
    }
  }

  /**
   * Can navigate away?
   */
  canDeactivate(): boolean {
    // TODO
    return true;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
