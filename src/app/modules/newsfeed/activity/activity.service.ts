import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { MindsGroup, MindsUser } from '../../../interfaces/entities';
import { map } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { ConfigsService } from '../../../common/services/configs.service';
import { Session } from '../../../services/session';
import getActivityContentType from '../../../helpers/activity-content-type';
import { FeaturesService } from '../../../services/features.service';

export type ActivityDisplayOptions = {
  autoplayVideo: boolean;
  showOwnerBlock: boolean;
  showComments: boolean;
  showOnlyCommentsInput: boolean;
  showToolbar: boolean;
  showBoostMenuOptions: boolean;
  showEditedTag: boolean;
  showVisibilityState: boolean;
  showTranslation: boolean;
  fixedHeight: boolean;
  fixedHeightContainer: boolean; // Will use fixedHeight but relies on container to set the height
  isModal: boolean;
};

export type ActivityEntity = {
  guid: string;
  remind_object?: Object;
  ownerObj: MindsUser;
  containerObj: MindsGroup | null;
  message: string;
  title: string;
  blurb: string;
  custom_type: 'video' | 'batch';
  custom_data: any;
  entity_guid: string | null;
  thumbnail_src: string;
  perma_url: string;
  time_created: number;
  edited: boolean;
  modal_source_url?: string;
  ephemeral?: boolean;
  nsfw: Array<number>;
  paywall: boolean;
  impressions: number;
  boostToggle: boolean;
  url?: string;
  urn?: string;
  boosted_guid?: string;
  activity_type?: string; // all blogs are rich-embeds
  content_type?: string; // blogs and rich-embeds are separate
  paywall_unlocked?: boolean;
};

// Constants of blocks
export const ACTIVITY_OWNERBLOCK_HEIGHT = 76;
export const ACTIVITY_TOOLBAR_HEIGHT = 52;
export const ACTIVITY_COMMENTS_POSTER_HEIGHT = 58;
export const ACTIVITY_COMMENTS_MORE_HEIGHT = 42;
export const ACTIVITY_CONTENT_PADDING = 16;

// Constants of fixed heights
export const ACTIVITY_FIXED_HEIGHT_HEIGHT = 600;
export const ACTIVITY_FIXED_HEIGHT_WIDTH = 500;
export const ACTIVITY_FIXED_HEIGHT_RATIO =
  ACTIVITY_FIXED_HEIGHT_WIDTH / ACTIVITY_FIXED_HEIGHT_HEIGHT;

//export const ACTIVITY_FIXED_HEIGHT_CONTENT_HEIGHT = ACTIVITY_FIXED_HEIGHT_HEIGHT - ACTIVITY_OWNERBLOCK_HEIGHT;

@Injectable()
export class ActivityService {
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
   * Allows for components to give nsfw consent
   */
  isNsfwConsented$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * Will be true if not consented and is nsfw
   */
  shouldShowNsfwConsent$: Observable<boolean> = combineLatest(
    this.entity$,
    this.isNsfwConsented$
  ).pipe(
    map(([entity, isConsented]: [ActivityEntity, boolean]) => {
      return (
        entity.nsfw &&
        entity.nsfw.length > 0 &&
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
      if (this.featuresService.has('paywall-2020')) {
        return (
          !!entity.paywall &&
          entity.ownerObj.guid !== this.session.getLoggedInUser().guid
        );
      }
      return !!entity.paywall;
    })
  );

  /**
   * We do not render the contents if nsfw (and no consent)
   */
  shouldShowContent$: Observable<boolean> = combineLatest(
    this.entity$,
    this.shouldShowNsfwConsent$
  ).pipe(
    map(([entity, shouldShowNsfwConsent]: [ActivityEntity, boolean]) => {
      if (this.featuresService.has('paywall-2020')) {
        return !shouldShowNsfwConsent;
      }
      return !shouldShowNsfwConsent && !entity.paywall;
    })
  );

  /**
   * Show the paywall badge both before and after the paywall is unlocked
   */
  shouldShowPaywallBadge$: Observable<boolean> = this.entity$.pipe(
    map((entity: ActivityEntity) => {
      // TODO: handle entity.flags.paywall here?
      return !!entity.paywall || entity.paywall_unlocked;
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
    map(user => user !== null)
  );

  /**
   * TODO
   */
  isBoost$: Observable<boolean> = this.entity$.pipe();

  /**
   * If the post is a remind this will emit true
   */
  isRemind$: Observable<boolean> = this.entity$.pipe(
    map((entity: ActivityEntity) => {
      return entity && !!entity.remind_object;
    })
  );

  /**
   * If the post has been editied this will emit true
   */
  isEdited$: Observable<boolean> = this.entity$.pipe(
    map((entity: ActivityEntity) => {
      return entity && entity.edited;
    })
  );

  /**
   * TODO
   */
  isUnlisted$: Observable<boolean> = this.entity$.pipe();

  /**
   * The height of the activity post may be dynamic
   */
  height$: BehaviorSubject<number> = new BehaviorSubject(
    ACTIVITY_FIXED_HEIGHT_HEIGHT
  );

  displayOptions: ActivityDisplayOptions = {
    autoplayVideo: true,
    showOwnerBlock: true,
    showComments: true,
    showOnlyCommentsInput: true,
    showToolbar: true,
    showBoostMenuOptions: false,
    showEditedTag: false,
    showVisibilityState: false,
    showTranslation: false,
    fixedHeight: false,
    fixedHeightContainer: false,
    isModal: false,
  };

  paywallUnlockedEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    private configs: ConfigsService,
    private session: Session,
    private featuresService: FeaturesService
  ) {
    this.siteUrl = configs.get('site_url');
  }

  /**
   * Emits new entity
   * @param entity
   * @return ActivityService
   */
  setEntity(entity): ActivityService {
    if (entity.type !== 'activity') entity = this.patchForeignEntity(entity);

    if (!entity.content_type) {
      entity.content_type = getActivityContentType(entity, true);
    }
    if (!entity.activity_type) {
      entity.activity_type = getActivityContentType(entity);
    }
    this.entity$.next(entity);
    return this;
  }

  /**
   * Sets display options
   * @param options
   * @return ActivityService
   */
  setDisplayOptions(options: Object = {}): ActivityService {
    this.displayOptions = Object.assign(this.displayOptions, options);
    return this;
  }

  buildCanonicalUrl(entity: ActivityEntity, full: boolean): string {
    const guid = entity.entity_guid || entity.guid;
    const prefix = full ? this.siteUrl : '/';
    return `${prefix}newsfeed/${guid}`;
  }

  private patchForeignEntity(entity): ActivityEntity {
    switch (entity.subtype) {
      case 'image':
        entity.message = entity.description;
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
        entity.message = entity.description;
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
}
