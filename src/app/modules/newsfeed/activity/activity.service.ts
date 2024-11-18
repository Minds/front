import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import { MindsGroup, MindsUser } from '../../../interfaces/entities';
import {
  catchError,
  distinctUntilChanged,
  map,
  skip,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  Injectable,
  EventEmitter,
  OnDestroy,
  Optional,
  OnInit,
} from '@angular/core';
import { ConfigsService } from '../../../common/services/configs.service';
import { Session } from '../../../services/session';
import getActivityContentType from '../../../helpers/activity-content-type';
import { EntityMetricsSocketService } from '../../../common/services/entity-metrics-socket';
import { BoostGoalButtonText } from '../../boost/boost.types';
import { AccessId } from '../../../common/enums/access-id.enum';
import { ApiResponse, ApiService } from '../../../common/api/api.service';
import { ActivityHasRemindedResponse } from './activity.types';
import { ToasterService } from '../../../common/services/toaster.service';

export interface Supermind {
  request_guid: string;
  is_reply: boolean;
  receiver_user?: any;
  reply_guid?: string;
}

export type ActivityDisplayOptions = {
  autoplayVideo: boolean;
  showOwnerBlock: boolean;
  showComments: boolean;
  showOnlyCommentsInput: boolean;
  showOnlyCommentsToggle: boolean;
  showToolbar: boolean;
  showToolbarButtonsRow: boolean; // (Assuming showToolbar is true), set this to false if you only want to see boost CTA/supermind buttons
  showExplicitVoteButtons: boolean; // Display thumb buttons on own row with "see more/less of this" text
  showInteractions: boolean;
  canShowLargeCta: boolean; // Show large CTA buttons if appropriate (boost, supermind, etc.)
  showEditedTag: boolean;
  showVisibilityState: boolean;
  showTranslation: boolean;
  isModal: boolean;
  minimalMode: boolean; // For grid layouts
  bypassMediaModal: boolean; // Go to media page instead - i.e. by clicking on suggested sidebar post or image in notification preview
  showPostMenu: boolean; // Can be hidden for things like previews
  showPinnedBadge: boolean; // show pinned badge if a post is pinned
  showMetrics?: boolean; // sub counts
  sidebarMode: boolean; // activity is a sidebar suggestion
  boostRotatorMode: boolean; // is the activity in the boost rotator?
  isSidebarBoost: boolean; // activity is a sidebar boost (has owner block, etc.)
  isFeed: boolean; // is the activity a part of a feed?
  isSingle: boolean; // is this the activity featured on a single post page?
  permalinkBelowContent: boolean; // show permalink below content instead of in ownerblock (modals, single pages)
  hasLoadingPriority: boolean; // whether to load image content eagerly - should usually be first 1 or 2 activities in a feed.
  inSingleGroupFeed: boolean; // whether the activity is being presented in the feed of a single specific group page
  isComposerPreview: boolean; // is the activity being presented in the composer as a preview (e.g. to display a quote post)
  hideTopBorder: boolean; // hides the top border of an activity.
};

export type ActivityEntity = {
  guid: string;
  remind_object?: any;
  remind_users?: Array<MindsUser>;
  ownerObj: MindsUser;
  containerObj: MindsGroup | null;
  message: string;
  title: string;
  blurb: string;
  custom_type: 'video' | 'batch' | 'audio';
  custom_data: any;
  entity_guid: string | null;
  thumbnail_src: string;
  perma_url: string;
  time_created: number;
  edited: boolean;
  ephemeral?: boolean;
  nsfw: Array<number>;
  paywall: boolean;
  impressions: number;
  boostToggle: boolean;
  access_id?: string;
  container_guid?: string;
  owner_guid?: string;
  url?: string;
  urn?: string;
  allow_comments?: boolean; // whether comments are allowed on the activity.
  boosted_guid?: string;
  activity_type?: string; // all blogs are rich-embeds
  content_type?: string; // blogs and rich-embeds are separate
  paywall_unlocked?: boolean;
  permaweb_id?: string;
  type?: string;
  description?: string; // xml for inline rich-embeds
  excerpt?: string; // for blogs
  remind_deleted?: boolean;
  pinned?: boolean; // pinned to top of channel
  subtype?: string;
  reminds?: number; // count of reminds
  quotes?: number; // count of quotes
  blurhash?: string;
  supermind?: Supermind; // supermind details, if applicable
  boosted?: boolean; // may be exported if activity is a boost
  goal_button_text: BoostGoalButtonText; // may be exported if activity is a boost
  goal_button_url: string; // may be exported if activity is a boost
  auto_caption?: string; // AI generated captions for images
  spam?: boolean;
  site_membership?: boolean; // The post has a membership attached
  site_membership_unlocked?: boolean; // The post can be viewed with no restrictions. False will show the cta.
  paywall_thumbnail?: {
    width: number;
    height: number;
    blurhash: string;
  };
  link_title?: string;
  canonical_url?: string; // for federated posts (via activity pub)
};

// Constants of blocks
export const ACTIVITY_V2_MAX_MEDIA_HEIGHT = 500;

// Constants for grid layout
export const ACTIVITY_GRID_LAYOUT_MAX_HEIGHT = 200;

// Constants for content-specific displays
export const ACTIVITY_SHORT_STATUS_MAX_LENGTH = 300;

export const ACTIVITY_V2_SHORT_STATUS_MAX_LENGTH = 100;
export const ACTIVITY_V2_MEDIUM_STATUS_MAX_LENGTH = 250;

// entity for which metrics events can be subscribed to.
type MetricsSubscribableEntity = { guid: string };

@Injectable()
export class ActivityService implements OnDestroy {
  protected subscriptions: Subscription[] = [];
  readonly siteUrl: string;

  entity$ = new BehaviorSubject(null);

  /**
   * Resolves media posts to a single guid and url
   */
  canonicalUrl$: Observable<string> = this.entity$.pipe(
    map((entity: ActivityEntity) => {
      if (!entity) return '';
      return this.buildCanonicalUrl(entity, false);
    })
  );

  /**
   * If false, the template will be empty (used for deleted)
   */
  canShow$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  /**
   * Subject for Activity's canDelete property
   */
  canDeleteOverride$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Returns whether or not the user can edit an activity
   */
  canDelete$: Observable<boolean> = combineLatest([
    this.entity$,
    this.canDeleteOverride$,
    this.session.user$,
  ]).pipe(
    map(
      ([entity, override, user]) =>
        entity &&
        user &&
        (entity.owner_guid === user.guid || user.is_admin || override)
    )
  );

  /**
   * The index of the image that is "active" in a multi-image post
   * (where applicable)
   * e.g. which image is currently displayed in the activity modal
   */
  activeMultiImageIndex$: BehaviorSubject<number> = new BehaviorSubject(0);

  /**
   * Allows for components to give nsfw consent
   */
  isNsfwConsented$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * Will be true if not consented and is nsfw.
   */
  shouldShowNsfwConsent$: Observable<boolean> = combineLatest(
    this.entity$,
    this.isNsfwConsented$
  ).pipe(
    map(([entity, isConsented]: [ActivityEntity, boolean]) => {
      return (
        (entity.nsfw?.length > 0 ||
          entity.ownerObj?.nsfw?.length > 0 ||
          entity.remind_object?.nsfw?.length > 0 ||
          entity.remind_object?.ownerObj?.nsfw?.length > 0) &&
        !isConsented &&
        !(this.session.isLoggedIn() && this.session.getLoggedInUser().mature)
      );
    })
  );

  /**
   * If a paywall is required
   */
  shouldShowPaywall$: Observable<boolean> = this.entity$.pipe(
    map((entity: ActivityEntity) => {
      return (
        !!entity.paywall &&
        // don't show a paywall if the entity is a quote of another paywalled post
        !entity.remind_object?.paywall &&
        entity.ownerObj.guid !== this.session.getLoggedInUser().guid
      );
    })
  );

  /**
   * We do not render the contents if nsfw (and no consent)
   */
  shouldShowContent$: Observable<boolean> = this.shouldShowNsfwConsent$.pipe(
    map((shouldShowNsfwConsent: boolean) => {
      return !shouldShowNsfwConsent;
    })
  );

  /**
   * Show the paywall badge both before and after the paywall is unlocked
   */
  shouldShowPaywallBadge$: Observable<boolean> = this.entity$.pipe(
    map((entity: ActivityEntity) => {
      return !!entity.paywall || entity.paywall_unlocked;
    })
  );

  /**
   * Show view counts for owners and admins
   */
  shouldShowViewCount$: Observable<boolean> = this.entity$.pipe(
    map((entity: ActivityEntity) => {
      return (
        (this.session.getLoggedInUser() &&
          entity.ownerObj.guid === this.session.getLoggedInUser().guid) ||
        (this.session.isAdmin() && entity.impressions > 0)
      );
    })
  );

  /** Only allow downloads of images */
  canDownload$: Observable<boolean> = this.entity$.pipe(
    map((entity: ActivityEntity) => {
      let contentType = entity.content_type;
      if (entity.activity_type && entity.activity_type === 'quote') {
        contentType = getActivityContentType(entity.remind_object, true, true);
      }
      return contentType === 'image';
    })
  );

  /**
   * Only allow translation menu item if there is content to translate
   */
  isTranslatable$: Observable<boolean> = this.entity$.pipe(
    map((entity: ActivityEntity) => {
      if (typeof entity.message !== 'undefined' && entity.message) {
        return true;
      } else if (
        entity.custom_type &&
        ((typeof entity.title !== 'undefined' && entity.title) ||
          (typeof entity.blurb !== 'undefined' && entity.blurb))
      ) {
        return true;
      }
      return false;
    })
  );

  isLoggedIn$: Observable<boolean> = this.session.user$.pipe(
    map((user) => user !== null)
  );

  isBoost$: Observable<boolean> = this.entity$.pipe(
    map((entity: ActivityEntity) => {
      return entity && entity?.boosted;
    })
  );

  /**
   * If the post is a quote this will emit true
   */
  isQuote$: Observable<boolean> = this.entity$.pipe(
    map((entity: ActivityEntity) => {
      return entity && !!entity.remind_object;
    })
  );

  /**
   * True if this post is a remind
   */
  isRemind$: Observable<boolean> = this.entity$.pipe(
    map((entity: ActivityEntity) => {
      return entity && entity.subtype && entity.subtype === 'remind';
    })
  );

  /**
   * True if this post is a remind from this user
   */
  isUsersRemind$: Observable<boolean> = this.entity$.pipe(
    map((entity: ActivityEntity) => {
      return entity &&
        entity?.remind_users &&
        entity.remind_users.filter(
          (user) => user.guid === this.session.getLoggedInUser().guid
        ).length > 0
        ? true
        : false;
    })
  );

  /**
   * Whether the user has reminded this post (even if this entity$ isn't the reminded post)
   * Null until we've performed an async check
   */
  userHasReminded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );

  /**
   * If the post has multiple images this will emit true
   */
  isMultiImage$: Observable<boolean> = this.entity$.pipe(
    map((entity: ActivityEntity) => {
      return (
        entity && entity.custom_type == 'batch' && entity.custom_data.length > 1
      );
    })
  );

  /**
   * Emits true if the post is a supermind reply
   */
  isSupermindReply$: Observable<boolean> = this.entity$.pipe(
    map((entity: ActivityEntity) => {
      return (
        entity &&
        entity.remind_object &&
        entity.supermind &&
        entity.supermind.is_reply
      );
    })
  );

  /**
   * Emits true if the post is a supermind request
   */
  isSupermindRequest$: Observable<boolean> = this.entity$.pipe(
    map((entity: ActivityEntity) => {
      return (
        entity &&
        entity.supermind &&
        !entity.supermind.is_reply &&
        !!entity.supermind.receiver_user
      );
    })
  );

  /**
   * Emits true if the post is a supermind request
   * that has been replied to
   */
  isSupermindRequestWithReply$: Observable<boolean> = this.entity$.pipe(
    map((entity: ActivityEntity) => {
      return Boolean(
        entity &&
          entity.supermind &&
          !entity.supermind.is_reply &&
          entity.supermind.reply_guid
      );
    })
  );

  /**
   * If the post has been edited this will emit true
   */
  isEdited$: Observable<boolean> = this.entity$.pipe(
    map((entity: ActivityEntity) => {
      return entity && entity.edited;
    })
  );

  /**
   * Whether entity has an access id indicating that it is private.
   */
  public readonly isPrivate$: Observable<boolean> = this.entity$.pipe(
    map(
      (entity: any): boolean => Number(entity?.access_id) === AccessId.Private
    )
  );

  /**
   * Called when this post is deleted
   */
  onDelete$: Subject<boolean> = new Subject();

  /**
   * If this is a group post being displayed outside the group's feed,
   * we need to provide additional context about the group
   * in the owner block (e.g. avatar, group name)
   */
  showGroupContext$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * Whether to show a row at the top of the activity that informs
   * whether the post was boosted, reminded, or is a supermind offer
   */
  readonly showFlagRow$: Observable<boolean> = combineLatest([
    this.isSupermindRequest$,
    this.isBoost$,
    this.isRemind$,
  ]).pipe(
    map(([isSupermindRequest, isBoost, isRemind]) => {
      // Don't show in boost rotator, minimal mode, etc.
      const isInApprovedContext =
        !this.displayOptions.minimalMode &&
        !this.displayOptions.isComposerPreview &&
        !this.displayOptions.boostRotatorMode;

      const contentRequiresFlag = isSupermindRequest || isBoost || isRemind;

      return !!isInApprovedContext && !!contentRequiresFlag;
    })
  );

  displayOptions: ActivityDisplayOptions = {
    autoplayVideo: true,
    showOwnerBlock: true,
    showComments: true,
    showOnlyCommentsInput: true,
    showOnlyCommentsToggle: false,
    showToolbar: true,
    showToolbarButtonsRow: true,
    showExplicitVoteButtons: false,
    showInteractions: false,
    canShowLargeCta: false,
    showEditedTag: false,
    showVisibilityState: false,
    showTranslation: false,
    showPostMenu: true,
    showPinnedBadge: true,
    showMetrics: true,
    isModal: false,
    minimalMode: false,
    bypassMediaModal: false,
    sidebarMode: false,
    boostRotatorMode: false,
    isSidebarBoost: false,
    isFeed: false,
    isSingle: false,
    permalinkBelowContent: false,
    hasLoadingPriority: false,
    inSingleGroupFeed: false,
    isComposerPreview: false,
    hideTopBorder: false,
  };

  paywallUnlockedEmitter: EventEmitter<any> = new EventEmitter();

  // subscriptions for metric events.
  private thumbsUpMetricSubscription: Subscription;

  constructor(
    private configs: ConfigsService,
    private session: Session,
    private api: ApiService,
    private toast: ToasterService,
    @Optional() private entityMetricsSocket: EntityMetricsSocketService
  ) {
    this.siteUrl = configs.get('site_url');
  }

  ngOnDestroy() {
    this.teardownMetricsSocketListener();
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Emits new entity
   * @param entity
   * @return ActivityService
   */
  setEntity(entity): ActivityService {
    if (entity.type !== 'activity') entity = this.patchForeignEntity(entity);

    if (!entity.content_type) {
      entity.content_type = getActivityContentType(entity, true, true);
    }
    if (!entity.activity_type) {
      entity.activity_type = getActivityContentType(entity);
    }
    this.entity$.next(entity);

    const showGroupContext =
      entity.containerObj &&
      entity.containerObj.type === 'group' &&
      !this.displayOptions.inSingleGroupFeed;

    this.showGroupContext$.next(showGroupContext);
    return this;
  }

  /**
   * Sets display options
   * @param options
   * @return ActivityService
   */
  setDisplayOptions(
    options: Partial<ActivityDisplayOptions> = {}
  ): ActivityService {
    this.displayOptions = Object.assign(this.displayOptions, options);

    this.displayOptions.showOnlyCommentsInput = false;
    this.displayOptions.showOnlyCommentsToggle = true;

    return this;
  }

  buildCanonicalUrl(entity: ActivityEntity, full: boolean): string {
    let guid = entity.entity_guid || entity.guid;
    // use the entity guid for media quotes
    if (entity.remind_object && entity.entity_guid) {
      guid = entity.guid;
    }
    const prefix = full ? this.siteUrl : '/';
    return `${prefix}newsfeed/${guid}`;
  }

  private patchForeignEntity(entity): ActivityEntity {
    switch (entity.subtype) {
      case 'image':
        if (!entity.message) {
          entity.message = entity.description;
        }
        entity.entity_guid = entity.guid;
        entity.custom_type = 'batch';
        entity.custom_data = [
          {
            src: entity.thumbnail_src,
            width: entity.width,
            height: entity.height,
          },
        ];
        break;
      case 'video':
        if (!entity.message) {
          entity.message = entity.description;
        }
        entity.custom_type = 'video';
        entity.entity_guid = entity.guid;
        entity.custom_data = {
          thumbnail_src: entity.thumbnail_src,
        };
        if (entity.height || entity.width) {
          entity.custom_data.height = entity.height;
          entity.custom_data.width = entity.width;
        }
        break;
      case 'album':
        // Not supported
        break;
      case 'blog':
        break;
    }

    return entity;
  }

  /**
   * Setup listener for metrics socket for this activity.
   * @param { MetricsSubscribableEntity } subscribableEntity - entity to subscribe to.
   * @returns { this }
   */
  public setupMetricsSocketListener(): this {
    if (!this.entityMetricsSocket) {
      console.error('No EntityMetricsSocketService provider to connect with');
      return;
    }

    this.thumbsUpMetricSubscription = this.entityMetricsSocket.thumbsUpCount$
      .pipe(
        skip(1),
        withLatestFrom(this.entity$),
        tap(([thumbsUpCount, entity]) => {
          entity['thumbs:up:count'] = thumbsUpCount;
          this.entity$.next(entity);
        })
      )
      .subscribe();

    this.entityMetricsSocket.listen(this.getMetricSubscriptionGuid());
    return this;
  }

  /**
   * Teardown listener for metrics socket for this activity.
   * @returns { this }
   */
  public teardownMetricsSocketListener(): this {
    if (!this.entityMetricsSocket) {
      return;
    }

    this.thumbsUpMetricSubscription?.unsubscribe();
    this.entityMetricsSocket.leave(this.getMetricSubscriptionGuid());
    return this;
  }

  /**
   * Get GUID to subscribe to for metrics.
   * @returns { string } guid to subscribe to for metrics events.
   */
  private getMetricSubscriptionGuid(): string {
    if (this.entity$.getValue().entity_guid) {
      return this.entity$.getValue().entity_guid;
    } else {
      return this.entity$.getValue().guid;
    }
  }

  /**
   * Removes user's downvote when it was removed from
   * some place other than the downvote button
   * (e.g. from the downvote notice)
   */
  public undoDownvote(): void {
    let entity = this.entity$.getValue();

    entity['thumbs:down:user_guids'] = entity['thumbs:down:user_guids'].filter(
      (guid) => guid !== this.session.getLoggedInUser().guid
    );

    this.entity$.next(entity);
  }

  /**
   * Whether the user has reminded this post OR
   * this is that remind
   */
  public async getUserHasReminded(): Promise<void> {
    this.subscriptions.push(
      combineLatest([this.entity$, this.isUsersRemind$])
        .pipe(
          distinctUntilChanged(),
          switchMap(
            ([entity, isUsersRemind]): Observable<
              ApiResponse | { redirect: boolean; errorMessage: any }
            > => {
              if (isUsersRemind) {
                // We already know this is the user's remind, no need to ask api
                this.userHasReminded$.next(true);
                return null;
              }

              if (!this.session.getLoggedInUser()) {
                this.userHasReminded$.next(false);
                return null;
              }

              try {
                // Check if the original post has been reminded by this user
                return this.api.get(
                  `api/v3/newsfeed/activity/has-reminded/${entity.guid}`
                );
              } catch (err) {
                return null;
              }
            }
          ),
          catchError((_) => of(null))
        )
        .subscribe((response: ActivityHasRemindedResponse | null) => {
          if (response) {
            this.userHasReminded$.next(response?.has_reminded);
          }
        })
    );
  }

  /**
   * Delete all the reminds this user has made of this post
   */
  public async undoRemind(): Promise<void> {
    this.entity$
      .pipe(
        take(1), // No need to unsubscribe from finite subscription
        switchMap((entity) => {
          try {
            //
            return this.api.delete(
              `api/v3/newsfeed/activity/remind/${entity.guid}`
            );
          } catch (err) {
            return null;
          }
        }),
        catchError((e) =>
          this.handleError(
            e,
            'Sorry, there was an error removing this Remind. Please try again later.'
          )
        ),
        withLatestFrom(this.isUsersRemind$)
      )
      .subscribe(([response, isUsersRemind]) => {
        if (response && response.status === 'success') {
          this.userHasReminded$.next(false);
        }
        if (isUsersRemind) {
          this.onDelete();
        }
      });
  }

  /**
   * Handles error.
   * @param e error.
   * @returns { Observable<null> } returns EMPTY.
   */
  private handleError(
    e,
    altMessage: string = 'An unexpected error occured'
  ): Observable<null> {
    console.error(e);
    this.toast.error(e.message ?? altMessage);
    return EMPTY;
  }

  /**
   * Called after a post has been deleted. Removes it from the feed
   * and emits to parent components so they can perform cleanup tasks
   */
  public onDelete(): void {
    this.onDelete$.next(this.entity$.getValue());
    this.canShow$.next(false);
  }
}
