import {
  Component,
  EventEmitter,
  Inject,
  Input,
  PLATFORM_ID,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Session } from '../../../services/session';
import { ContextService } from '../../../services/context.service';
import { EntitiesService } from '../../../common/services/entities.service';
import { Client } from '../../../services/api/client';
import {
  MetaService,
  MIN_METRIC_FOR_ROBOTS,
} from '../../../common/services/meta.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { HeadersService } from '../../../common/services/headers.service';
import { AuthModalService } from '../../auth/modal/auth-modal.service';
import { JsonLdService } from '../../../common/services/jsonld.service';
import { isPlatformBrowser, Location } from '@angular/common';
import { RouterHistoryService } from '../../../common/services/router-history.service';
import { BoostModalV2LazyService } from '../../boost/modal-v2/boost-modal-v2-lazy.service';
import getMetaAutoCaption from '../../../helpers/meta-auto-caption';
import { EmbedLinkWhitelistService } from '../../../services/embed-link-whitelist.service';
import { IsTenantService } from '../../../common/services/is-tenant.service';
import { ActivityEntity } from '../activity/activity.service';
import { PermissionsService } from '../../../common/services/permissions.service';

/**
 * Base component to display an activity on a standalone page
 *
 * See it by clicking the permalink (aka timestamp) in the ownerblock of an activity in the feed
 */
@Component({
  selector: 'm-newsfeed--single',
  templateUrl: 'single.component.html',
  styleUrls: ['single.component.ng.scss'],
})
export class NewsfeedSingleComponent {
  readonly cdnAssetsUrl: string;
  readonly siteUrl: string;
  inProgress: boolean = false;
  activity: ActivityEntity | any;
  error: string = '';
  focusedCommentGuid: string = '';
  editing = false;
  private siteName: string;
  private siteTitle: string;

  private paramsSubscription: Subscription;
  private queryParamsSubscription: Subscription;
  private singleGuidSubscription: Subscription;

  private shouldReuseRouteFn; // For comment focusedUrn reloading

  showBackButton: boolean = false;

  boostModalDelayMs: number;

  /** Whether the user has permission to boost. */
  protected hasBoostPermission: boolean = false;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public context: ContextService,
    public session: Session,
    public entitiesService: EntitiesService,
    protected client: Client,
    private metaService: MetaService,
    configs: ConfigsService,
    private headersService: HeadersService,
    private authModal: AuthModalService,
    protected jsonLdService: JsonLdService,
    private location: Location,
    private routerHistory: RouterHistoryService,
    private boostModal: BoostModalV2LazyService,
    private embedLinkWhitelist: EmbedLinkWhitelistService,
    private permissionsService: PermissionsService,
    private isTenant: IsTenantService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.siteUrl = configs.get('site_url');
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.siteName = configs.get('site_name');
  }

  ngOnInit() {
    this.context.set('activity');

    this.siteTitle = this.isTenant.is() ? this.siteName : 'Minds';

    this.hasBoostPermission = this.permissionsService.canBoost();

    // If the user arrived at this page by clicking a link
    // somewhere within the site, they will see a back button
    let previousUrl = this.routerHistory.getPreviousUrl();
    this.showBackButton = !!previousUrl;

    this.paramsSubscription = this.route.params.subscribe((params) => {
      if (params['guid']) {
        this.error = '';
        this.activity = void 0;
        if (this.route.snapshot.queryParamMap.has('comment_guid')) {
          this.focusedCommentGuid =
            this.route.snapshot.queryParamMap.get('comment_guid');
        }
        this.load(params['guid']);
      }
    });

    this.queryParamsSubscription = this.route.queryParamMap.subscribe(
      (params) => {
        if (params.has('editing')) {
          this.editing = !!params.get('editing');
        }
      }
    );

    /**
     * Comments rely on focusedCommentUrn being sent through to the comments
     * component. It is required to allow the router to know that this query parameter
     * has changed.
     * It is in the component as having it in the comment can render multiple times, creating
     * a race condition for resettig the default shouldReuseRoute (as it happens on ngOnDestroy)
     */
    this.shouldReuseRouteFn = this.router.routeReuseStrategy.shouldReuseRoute;
    this.router.routeReuseStrategy.shouldReuseRoute = (future) => {
      return false;
    };
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.queryParamsSubscription.unsubscribe();

    if (this.singleGuidSubscription) {
      this.singleGuidSubscription.unsubscribe();
    }
    this.jsonLdService.removeStructuredData();

    // Set the router strategy back to default
    this.router.routeReuseStrategy.shouldReuseRoute = this.shouldReuseRouteFn;
  }

  /**
   * Load newsfeed
   */
  load(guid: string) {
    this.context.set('activity');

    this.inProgress = true;

    this.singleGuidSubscription = this.loadFromFeedsService(guid).subscribe(
      (activity: ActivityEntity) => {
        if (!activity) {
          return; // Not yet loaded
        }

        this.activity = activity;

        // Open up the boost modal after a delay, if logged in
        if (
          this.session.getLoggedInUser() &&
          isPlatformBrowser(this.platformId) &&
          this.route.snapshot.queryParamMap.has('boostModalDelayMs') &&
          this.hasBoostPermission
        ) {
          const ms = Number(
            this.route.snapshot.queryParamMap.get('boostModalDelayMs')
          );
          setTimeout(() => this.openBoostModal(), ms);
        }

        switch (this.activity.subtype) {
          case 'image':
          case 'video':
          case 'album':
            break;
          case 'blog':
            break;
        }

        this.updateMeta();

        if ((<any>this.activity).require_login) this.openLoginModal();

        this.inProgress = false;

        if (this.activity.ownerObj) {
          this.context.set('activity', {
            label: `@${this.activity.ownerObj.username} posts`,
            nameLabel: `@${this.activity.ownerObj.username}`,
            id: this.activity.ownerObj.guid,
          });
        } else if (this.activity.owner_guid) {
          this.context.set('activity', {
            label: `this user's posts`,
            id: this.activity.owner_guid,
          });
        } else {
          this.context.reset();
        }
      },
      (err) => {
        this.inProgress = false;

        if (err.status === 0) {
          this.error = 'Sorry, there was a timeout error.';
        } else if (err.status === 401) {
          this.error =
            err.message ?? 'You must be logged in to view this content';
          this.openLoginModal(true);
        } else {
          this.error = "Sorry, we couldn't load the activity";
          this.headersService.setCode(404);
        }
      }
    );
  }

  loadFromFeedsService(guid: string) {
    return this.entitiesService.single(guid);
  }

  goToPreviousPage(): void {
    this.location.back();
  }

  /**
   * Opens the login modal.
   * @param { boolean } reloadOnLogin - Whether to reload the route after successful login.
   * @returns { Promise<void> }
   */
  async openLoginModal(reloadOnLogin: boolean = false): Promise<void> {
    this.error = 'You must be logged in to see this post';
    this.headersService.setCode(401);

    const user = await this.authModal.open();

    if (user) {
      if (reloadOnLogin) {
        this.forceReloadRoute();
      } else {
        (<any>this.activity).require_login = false;
      }
      this.error = null;
    }
  }

  private updateMeta(): void {
    const activity = this.activity;

    let title: string = '';
    let description: string = '';
    let addTitleSuffix: boolean = true;
    let thumbnailSrc: string = ''; // will default to Minds logo if left empty.

    const isImage = activity.custom_type && activity.custom_type === 'batch';

    if (this.isLivestream(activity)) {
      title = `${activity.ownerObj.username} is streaming live on ${this.siteTitle}`;
      addTitleSuffix = false;
      description = `Subscribe to @${activity.ownerObj.username} on ${this.siteTitle}`;
    } else {
      title =
        activity.title ||
        activity.message ||
        `@${activity.ownerObj.username}'s post on ${this.siteTitle}`;
      title = title.trim();

      // Cut off the end of long titles and put them in the beginning of the description
      if (title.length > 60) {
        description = `...${title.substr(57)}`;
      } else {
        description = activity.blurb || '';
      }

      if (description) {
        description += `. `;
      }

      thumbnailSrc =
        activity.custom_type === 'batch'
          ? activity.custom_data[0]['src']
          : activity.thumbnail_src;

      if (activity.site_membership && activity.paywall_thumbnail) {
        thumbnailSrc =
          this.siteUrl +
          'api/v3/payments/site-memberships/paywalled-entities/thumbnail/' +
          activity.guid;
      }

      // Make a generic description intro for images
      // that don't have a description already
      if (isImage) {
        if (!description) {
          description = `Image from @${activity.ownerObj.username}.`;
        }
      } else {
        description += `Subscribe to @${activity.ownerObj.username} on ${this.siteTitle}`;
      }
    }

    // For images with AI captions, add the caption text to the description
    let caption = '';
    if (isImage && activity.custom_data.length > 1) {
      let multiCaptionArray = [];
      for (let i = 0; i < activity.custom_data.length; i++) {
        multiCaptionArray.push(getMetaAutoCaption(activity, i));
      }
      caption = multiCaptionArray.join('; ');
    } else if (isImage) {
      caption = getMetaAutoCaption(activity);
    }

    if (caption) {
      caption = ` (AI caption: ${caption})`;
      description = description.trim();
      description += caption;
    }

    this.metaService
      .setTitle(title, addTitleSuffix)
      .setDescription(description)
      .setOgImage(thumbnailSrc, { width: 2000, height: 1000 })
      .setThumbnail(thumbnailSrc)
      .setCanonicalUrl(activity?.canonical_url ?? `/newsfeed/${activity.guid}`)
      .setRobots(
        activity['thumbs:up:count'] >= MIN_METRIC_FOR_ROBOTS ? 'all' : 'noindex'
      );

    const author = activity?.ownerObj?.username;
    if (author) {
      this.metaService.setAuthor(author);
      this.metaService.setOgAuthor(author);
    }

    if (activity.nsfw.length) {
      this.metaService.setNsfw(true);
    }

    if (
      activity.subtype === 'video' ||
      activity.custom_type === 'video' ||
      activity.content_type === 'video'
    ) {
      const videoSchema = this.jsonLdService.getVideoSchema(activity);
      this.jsonLdService.insertSchema(videoSchema);
    }

    if (isImage) {
      const imageSchema = this.jsonLdService.getImageSchema(
        activity,
        this.metaService.getOgTitle(title),
        description
      );
      this.jsonLdService.insertSchema(imageSchema, 'm-structuredData--image');
    }

    if (activity.custom_type === 'video') {
      this.metaService.setOgType('video');
      this.metaService.setOgImage(activity.custom_data['thumbnail_src']);
    }

    if (activity.subtype === 'video' || activity.subtype === 'image') {
      this.metaService.setOEmbed(activity.guid);
    }

    if (activity.supermind?.is_reply) {
      this.metaService.setTwitterSummaryCard(
        activity.ownerObj.name + `'s reply on ${this.siteTitle}`,
        this.siteUrl +
          'api/v3/newsfeed/activity/og-image/' +
          activity.remind_object.guid,
        'Get replies from ' +
          activity.ownerObj.name +
          ` and elevate the discourse on ${this.siteTitle}.`
      );
    }
  }

  delete(activity) {
    this.router.navigate(['/newsfeed']);
  }

  async openBoostModal(): Promise<void> {
    try {
      await this.boostModal.open(this.activity);
      return;
    } catch (e) {
      // do nothing.
    }
  }

  get showLegacyActivity(): boolean {
    return this.editing;
  }

  /**
   * Whether sidebar Boost should be shown.
   * @returns { boolean } true if sidebar Boost should be shown.
   */
  public shouldShowSidebarBoost(): boolean {
    return (
      this.session.isLoggedIn() &&
      this.activity?.ownerObj?.guid &&
      this.activity?.ownerObj?.guid !== this.session.getLoggedInUser().guid
    );
  }

  /**
   * Whether an activity is a livestream.
   * @param {{ perma_url?: string }} activity - activity with optional perma_url.
   * @returns { boolean } true if activity is a livestream.
   */
  private isLivestream(activity: { perma_url?: string }): boolean {
    return Boolean(activity?.perma_url)
      ? this.embedLinkWhitelist.getRegex('livepeer').test(activity.perma_url) ||
          this.embedLinkWhitelist
            .getRegex('livepeerLegacy')
            .test(activity.perma_url)
      : false;
  }

  /**
   * Forces a route reload.
   * @returns { void }
   */
  private forceReloadRoute(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.navigate(['./'], { relativeTo: this.route });
  }
}
