import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subscription,
  take,
} from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  pairwise,
  share,
  startWith,
  tap,
  throttleTime,
} from 'rxjs/operators';
import { ApiService } from '../../../common/api/api.service';
import { ActivityEntity } from '../../newsfeed/activity/activity.service';
import { RichEmbed, RichEmbedService } from './rich-embed.service';
import { Attachment, AttachmentService } from './attachment.service';
import { AttachmentPreviewResource, PreviewService } from './preview.service';
import { FeedsUpdateService } from '../../../common/services/feeds-update.service';
import { HashtagsFromStringService } from '../../../common/services/parse-hashtags.service';
import {
  AttachmentValidationPayload,
  AttachmentValidatorService,
} from './attachment-validator.service';
import { OnboardingV3Service } from '../../onboarding-v3/onboarding-v3.service';
import { UploaderService } from './uploader.service';
import {
  AccessIdSubjectValue,
  AttachmentsMetadataMappedValue,
  AttachmentSubjectValue,
  ComposerSize,
  Data,
  LicenseSubjectValue,
  MessageSubjectValue,
  MonetizationSubjectValue,
  NsfwSubjectValue,
  PendingMonetizationSubjectValue,
  PostToPermawebSubjectValue,
  RemindSubjectValue,
  RichEmbedMetadataMappedValue,
  RichEmbedSubjectValue,
  ScheduleSubjectValue,
  SiteMembershipGuidsSubjectValue,
  SupermindReplySubjectValue,
  SupermindRequestSubjectValue,
  TagsSubjectValue,
  TitleSubjectValue,
  PaywallThumbnail,
  RichEmbedTitleSubjectValue,
  AudioThumbnailSubjectValue,
} from './composer-data-types';
import { ToasterService } from '../../../common/services/toaster.service';
import { ClientMetaData } from '../../../common/services/client-meta.service';
import {
  ActivityContainer,
  ComposerAudienceSelectorService,
} from './audience.service';
import { LivestreamService } from './livestream.service';
import { isPlatformBrowser } from '@angular/common';
import { ComposerBoostService } from './boost.service';

/**
 * Default values
 */
export const DEFAULT_MESSAGE_VALUE: MessageSubjectValue = '';
export const DEFAULT_TITLE_VALUE: TitleSubjectValue = null;
export const DEFAULT_RICH_EMBED_TITLE_VALUE: RichEmbedTitleSubjectValue = null;
export const DEFAULT_REMIND_VALUE: RemindSubjectValue = null;
export const DEFAULT_ATTACHMENT_VALUE: AttachmentSubjectValue = null;
export const DEFAULT_PAYWALL_THUMBNAIL_VALUE: PaywallThumbnail = null;
export const DEFAULT_AUDIO_THUMBNAIL_VALUE: string = null;
export const DEFAULT_RICH_EMBED_VALUE: RichEmbedSubjectValue = null;
export const DEFAULT_NSFW_VALUE: NsfwSubjectValue = [];
export const DEFAULT_POST_TO_PERMAWEB_VALUE: PostToPermawebSubjectValue = false;
export const DEFAULT_MONETIZATION_VALUE: MonetizationSubjectValue = null;
export const DEFAULT_SITE_MEMBERSHIP_GUIDS_VALUE: SiteMembershipGuidsSubjectValue =
  null;
export const DEFAULT_PENDING_MONETIZATION_VALUE: PendingMonetizationSubjectValue =
  null;
export const DEFAULT_TAGS_VALUE: TagsSubjectValue = [];
export const DEFAULT_SCHEDULE_VALUE: ScheduleSubjectValue = null;
export const DEFAULT_ACCESS_ID_VALUE: AccessIdSubjectValue = '2';
export const DEFAULT_LICENSE_VALUE: LicenseSubjectValue = 'all-rights-reserved';
export const DEFAULT_COMPOSER_SIZE: ComposerSize = 'full';

export * from './composer-data-types';

/**
 * Store/process class for activity composer.
 * It should be injected into each component that uses it
 * (via the `providers` array), as it is used as a store.
 * */
@Injectable()
export class ComposerService implements OnDestroy {
  /**
   * Message subject
   */
  public message$: BehaviorSubject<MessageSubjectValue> =
    new BehaviorSubject<MessageSubjectValue>(DEFAULT_MESSAGE_VALUE);

  /**
   * Title subject
   */
  readonly title$: BehaviorSubject<TitleSubjectValue> =
    new BehaviorSubject<TitleSubjectValue>(DEFAULT_TITLE_VALUE);

  /**
   * Rich-embed title subject
   */
  readonly richEmbedTitle$: BehaviorSubject<RichEmbedTitleSubjectValue> =
    new BehaviorSubject<TitleSubjectValue>(DEFAULT_RICH_EMBED_TITLE_VALUE);

  /**
   * NSFW subject
   */
  readonly nsfw$: BehaviorSubject<NsfwSubjectValue> =
    new BehaviorSubject<NsfwSubjectValue>(DEFAULT_NSFW_VALUE);

  /**
   * Monetization subject
   */
  monetization$: BehaviorSubject<MonetizationSubjectValue> =
    new BehaviorSubject<MonetizationSubjectValue>(DEFAULT_MONETIZATION_VALUE);

  /**
   * Pending monetization subject
   */
  readonly pendingMonetization$: BehaviorSubject<PendingMonetizationSubjectValue> =
    new BehaviorSubject<PendingMonetizationSubjectValue>(
      DEFAULT_PENDING_MONETIZATION_VALUE
    );

  /**
   * Memberships subject
   * For tenant membership posts
   * might need to change this to membershipGuids$
   */
  siteMembershipGuids$: BehaviorSubject<SiteMembershipGuidsSubjectValue> =
    new BehaviorSubject<SiteMembershipGuidsSubjectValue>(
      DEFAULT_SITE_MEMBERSHIP_GUIDS_VALUE
    );

  /**
   * Whether the prevew pane (where users set title/thumbnail for site membership posts) is visible - instead of the normal composer base
   */
  showSiteMembershipPostPreview$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * Tags subject
   */
  readonly tags$: BehaviorSubject<TagsSubjectValue> =
    new BehaviorSubject<TagsSubjectValue>(DEFAULT_TAGS_VALUE);

  /**
   * Schedule subject
   */
  readonly schedule$: BehaviorSubject<ScheduleSubjectValue> =
    new BehaviorSubject<ScheduleSubjectValue>(DEFAULT_SCHEDULE_VALUE);

  /**
   * Access ID subject
   */
  readonly accessId$: BehaviorSubject<AccessIdSubjectValue> =
    new BehaviorSubject<AccessIdSubjectValue>(DEFAULT_ACCESS_ID_VALUE);

  /**
   * License subject
   */
  readonly license$: BehaviorSubject<LicenseSubjectValue> =
    new BehaviorSubject<LicenseSubjectValue>(DEFAULT_LICENSE_VALUE);

  /**
   * Remind subject
   */
  readonly remind$: BehaviorSubject<RemindSubjectValue> =
    new BehaviorSubject<RemindSubjectValue>(DEFAULT_REMIND_VALUE);

  /**
   * Attachments subject
   */
  readonly attachments$: BehaviorSubject<AttachmentSubjectValue> =
    new BehaviorSubject<AttachmentSubjectValue>(DEFAULT_ATTACHMENT_VALUE);

  /**
   * Paywall Thumbnail subject
   */
  paywallThumbnail$: BehaviorSubject<PaywallThumbnail> = new BehaviorSubject(
    null
  );

  /**
   * Audio thumbnail subject
   */
  readonly audioThumbnail$: BehaviorSubject<string> = new BehaviorSubject(
    DEFAULT_AUDIO_THUMBNAIL_VALUE
  );

  /**
   * Rich embed subject
   */
  readonly richEmbed$: BehaviorSubject<RichEmbedSubjectValue> =
    new BehaviorSubject<RichEmbedSubjectValue>(DEFAULT_RICH_EMBED_VALUE);

  /**
   * Preview subject (state)
   */
  readonly attachmentPreviews$: BehaviorSubject<AttachmentPreviewResource[]> =
    new BehaviorSubject<AttachmentPreviewResource[]>([]);

  /**
   * Preview subject (state)
   */
  readonly richEmbedPreview$: BehaviorSubject<RichEmbed | null> =
    new BehaviorSubject<RichEmbed | null>(null);

  /**
   * In progress flag subject (state)
   */
  readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Is posting flag subject (state)
   */
  readonly isPosting$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Attachment error subject (state)
   */
  readonly attachmentError$: BehaviorSubject<AttachmentValidationPayload> =
    new BehaviorSubject<AttachmentValidationPayload>(null);

  /**
   * Post-ability check subject (state)
   */
  readonly canPost$: Observable<boolean>;

  /**
   * Have any form fields changed from default values?
   */
  readonly isDirty$: Observable<boolean>;

  /**
   * Is this an edit operation? (state)
   */
  readonly isEditing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * The payload for the supermind request (null if not a supermind)
   */
  readonly supermindRequest$: BehaviorSubject<SupermindRequestSubjectValue> =
    new BehaviorSubject(null);

  /**
   * True/False helper for if we have a supermind request payload
   */
  readonly isSupermindRequest$: Observable<boolean> =
    this.supermindRequest$.pipe(map((supermindRequest) => !!supermindRequest));

  /**
   * The supermind entity (used for supermind reply payload building)
   */
  readonly supermindReply$: BehaviorSubject<SupermindReplySubjectValue> =
    new BehaviorSubject(null);

  /**
   * True/False helper for if we have a supermind reply payload
   */
  readonly isSupermindReply$: Observable<boolean> = this.supermindReply$.pipe(
    map((supermindReply) => !!supermindReply)
  );

  /**
   * True/False helper to determine if the criteria to make a supermind has been met
   * Conditions listed below per business rules
   */
  readonly canCreateSupermindRequest$: Observable<boolean> = combineLatest([
    this.isEditing$,
    this.nsfw$,
    this.monetization$,
    this.schedule$,
    this.isSupermindReply$,
  ]).pipe(
    map(([isEditing, nsfw, monetization$, schedule, isSupermindReply]) => {
      return (
        !isEditing &&
        !nsfw.length &&
        !monetization$ &&
        !schedule &&
        !isSupermindReply
      );
    })
  );

  /**
   * If we are editing and we have a scheduled value
   */
  readonly canSchedule$ = combineLatest([
    this.schedule$,
    this.isEditing$,
    this.isSupermindRequest$,
    this.isSupermindReply$,
  ]).pipe(
    map(([schedule, isEditing, isSupermindRequest, isSupermindReply]) => {
      return (
        !isSupermindRequest &&
        !isSupermindReply &&
        (!isEditing || schedule * 1000 > Date.now())
      );
    })
  );

  /**
   * Are we currently moving part of this service's state to another place? (i.e. blog editor)
   */
  readonly isMovingContent$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  readonly isSiteMembershipPost$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * Is group post subject
   */
  isGroupPost$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Too many tags subject
   */
  readonly tooManyTags$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * Determines whether content is to be posted to Permaweb.
   */
  readonly postToPermaweb$: BehaviorSubject<boolean> =
    new BehaviorSubject<PostToPermawebSubjectValue>(
      DEFAULT_POST_TO_PERMAWEB_VALUE
    );

  /**
   * Tag count subject
   */
  readonly tagCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  /**
   * Size of composer
   */
  readonly size$: BehaviorSubject<ComposerSize> =
    new BehaviorSubject<ComposerSize>(DEFAULT_COMPOSER_SIZE);

  /**
   * Whether post button is disabled
   */
  readonly postButtonDisabled$: Observable<boolean>;

  /**
   * Whether next button is disabled
   * (used for site membership posts)
   */
  readonly nextButtonDisabled$: Observable<boolean>;

  /**
   * URL in the message
   */
  readonly messageUrl$: Observable<string>;

  /**
   * Data structure observable
   */
  readonly data$: Observable<Data>;

  /**
   * Subscription to data structure observable
   */
  protected readonly dataSubscription: Subscription;

  /**
   * Subscription to pending monetization observable
   */
  protected readonly pendingMonetizationSubscription: Subscription;

  /**
   * Subscription to selected audience observable
   */
  protected readonly selectedAudienceSubscription: Subscription;

  /**
   * Subscription to a rich embed extractor observable
   */
  protected readonly richEmbedExtractorSubscription: Subscription;

  /**
   * Subscription to attachment upload progress
   */
  protected readonly videoPermissionsErrorSubscription: Subscription;

  /** Container for this instance */
  protected container: ActivityContainer = null;

  /**
   * If we're editing, this holds a clone of the original activity
   */
  public entity: any = null;

  /**
   * Current payload to be consumed by DTO builder
   */
  protected payload: any = null;

  /**
   * message input selection range
   */
  public selection$: BehaviorSubject<{
    start: number;
    end: number;
  }> = new BehaviorSubject({ start: 0, end: 0 });

  private livestreamSubscription: Subscription;

  /**
   * Sets up data observable and its subscription
   *
   * @param api
   * @param attachment
   * @param richEmbed
   * @param preview
   */
  constructor(
    protected api: ApiService,
    protected attachment: AttachmentService,
    protected richEmbed: RichEmbedService,
    protected preview: PreviewService,
    protected feedsUpdate: FeedsUpdateService,
    private hashtagsFromString: HashtagsFromStringService,
    private attachmentValidator: AttachmentValidatorService,
    private audienceSelectorService: ComposerAudienceSelectorService,
    private onboardingService: OnboardingV3Service,
    private uploaderService: UploaderService,
    private toasterService: ToasterService,
    private livestreamService: LivestreamService,
    private composerBoostService: ComposerBoostService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    // Setup data stream using the latest subject values
    // This should emit whenever any subject changes.

    this.data$ = combineLatest<
      [
        MessageSubjectValue,
        TitleSubjectValue,
        RichEmbedTitleSubjectValue,
        NsfwSubjectValue,
        MonetizationSubjectValue,
        TagsSubjectValue,
        ScheduleSubjectValue,
        AccessIdSubjectValue,
        LicenseSubjectValue,
        AttachmentsMetadataMappedValue,
        RichEmbedMetadataMappedValue,
        PaywallThumbnail,
        AudioThumbnailSubjectValue,
        PostToPermawebSubjectValue,
        RemindSubjectValue,
        SupermindRequestSubjectValue,
        SupermindReplySubjectValue,
        SiteMembershipGuidsSubjectValue,
        ActivityContainer,
      ]
    >([
      this.message$.pipe(distinctUntilChanged()),
      this.title$.pipe(distinctUntilChanged()),
      this.richEmbedTitle$.pipe(distinctUntilChanged()),
      this.nsfw$, // TODO: Implement custom distinctUntilChanged comparison
      this.monetization$, // TODO: Implement custom distinctUntilChanged comparison
      this.tags$, // TODO: Implement custom distinctUntilChanged comparison
      this.schedule$, // TODO: Implement custom distinctUntilChanged comparison
      // ----------------------
      // ACCESSID$
      // ----------------------
      this.accessId$.pipe(
        distinctUntilChanged(),
        tap((accessId) => {
          // This will trigger a warning about an illegal access ID operation
          if (
            this.container &&
            this.container.guid &&
            this.container.guid !== accessId
          ) {
            console.warn(
              "Access ID will be overriden by container's GUID",
              this.container.guid
            );
          }
        })
      ),
      // ----------------------
      // LICENSE$
      // ----------------------
      this.license$.pipe(distinctUntilChanged()),
      // ----------------------
      // ATTACHMENTS$
      // ----------------------
      // Builds attachments guids
      combineLatest([
        this.uploaderService.files$.pipe(
          startWith([]), // will not ever resolve combineLatest unless we do this
          map((fileUpload) => {
            if (!fileUpload) {
              return [];
            }
            this.setPreview(fileUpload);

            return fileUpload.map((fileUpload) => fileUpload.guid);
          })
        ),
        this.attachments$.pipe(
          map((attachments) => {
            if (!attachments) return [];

            this.setPreview(attachments);

            return attachments.map((attachment) => attachment.guid);
          })
        ),
      ]).pipe(
        map(([uploadedGuids, existingGuids]) => [
          ...uploadedGuids,
          ...existingGuids,
        ])
      ),
      // ----------------------
      // RICHEMBED$
      // ----------------------
      // Builds rich-embeds
      this.richEmbed$.pipe(
        // Only react to rich-embed URL changes
        distinctUntilChanged(),

        // Trigger in progress state of indeterminate length.
        tap(() => this.setProgress(true)),

        // Call the engine endpoint to resolve the URL, debouncing the request to avoid server overload,
        this.richEmbed.resolve(200),

        // Set preview
        tap((richEmbed: RichEmbed) => {
          this.richEmbedPreview$.next(richEmbed);
          this.richEmbedTitle$.next(richEmbed?.title || null);
        }),

        // Set in progress state to null.
        tap(() => this.inProgress$.next(null))

        // Value will be either a RichEmbed interface object or null
      ),
      this.paywallThumbnail$.pipe(distinctUntilChanged()),
      this.audioThumbnail$.pipe(distinctUntilChanged()),
      this.postToPermaweb$,
      this.remind$.pipe(distinctUntilChanged()),
      this.supermindRequest$.pipe(distinctUntilChanged()),
      this.supermindReply$.pipe(distinctUntilChanged()),
      this.siteMembershipGuids$.pipe(distinctUntilChanged()),
      this.audienceSelectorService.selectedAudience$.pipe(
        distinctUntilChanged()
      ),
    ]).pipe(
      map(
        // Create an JSON object based on an array of Subject values
        ([
          message,
          title,
          richEmbedTitle,
          nsfw,
          monetization,
          tags,
          schedule,
          accessId,
          license,
          attachmentGuids,
          richEmbed,
          paywallThumbnail,
          audioThumbnail,
          postToPermaweb,
          remind,
          supermindRequest,
          supermindReply,
          siteMembershipGuids,
          container,
        ]) => ({
          message,
          title,
          richEmbedTitle,
          nsfw,
          monetization,
          tags,
          schedule,
          accessId,
          license,
          attachmentGuids,
          richEmbed,
          paywallThumbnail,
          audioThumbnail,
          postToPermaweb,
          remind,
          supermindRequest,
          supermindReply,
          siteMembershipGuids,
          container,
        })
      ),
      tap((values) => {
        ////
        // TODO: move this to its own pipe, it shouldn't be in a tap!
        ////

        // get tags from title and body.
        const bodyTags = this.hashtagsFromString
          .parseHashtagsFromString(values.message)
          .concat(
            this.hashtagsFromString.parseHashtagsFromString(values.title)
          );

        const cashTags = this.hashtagsFromString
          .parseCashtagsFromString(values.message)
          .concat(
            this.hashtagsFromString.parseCashtagsFromString(values.title)
          );

        // merge into one array.
        const tags = [...bodyTags, ...values.tags, ...cashTags];

        // get unique tags.
        const uniqueTags = tags.filter(function (item, pos) {
          return tags.indexOf(item) == pos;
        });

        const tagCount = uniqueTags.length;

        this.tagCount$.next(tagCount);

        const tooManyTags = tagCount > 5;

        this.tooManyTags$.next(tooManyTags);
      }),
      share()
    );

    /**
     * Below is the logic which determines the state of the post button
     */
    this.canPost$ = combineLatest([
      this.tooManyTags$,
      this.data$,
      this.uploaderService.isUploadingFinished$,
    ]).pipe(
      map(([tooManyTags, data, isUploadingFinished]) => {
        return Boolean(
          !tooManyTags &&
            isUploadingFinished &&
            (data.message || data.richEmbed || data.attachmentGuids?.length)
        );
      })
    );

    /**
     * True if any composer field has changed from its default value
     * (currently always returns true if editing an existing post)
     */
    this.isDirty$ = combineLatest([
      this.data$,
      this.isEditing$,
      this.uploaderService.isUploadingFinished$,
      this.attachments$,
      this.richEmbed$,
    ]).pipe(
      map(([data, isEditing, isUploadingFinished, attachments, richEmbed]) => {
        // TODO: implement custom rules for when a post is being edited
        // by comparing mapped fields in this.payload and this.entity
        if (!isUploadingFinished || isEditing) {
          return true;
        } else {
          // COMPOSING A NEW POST
          // We handle attachments and richEmbeds differently bc their
          // values are transformed when the data obj is built
          const dirty = Boolean(
            data.accessId !== DEFAULT_ACCESS_ID_VALUE ||
              attachments !== DEFAULT_ATTACHMENT_VALUE ||
              data.license !== DEFAULT_LICENSE_VALUE ||
              data.message !== DEFAULT_MESSAGE_VALUE ||
              data.monetization !== DEFAULT_MONETIZATION_VALUE ||
              data.nsfw !== DEFAULT_NSFW_VALUE ||
              data.postToPermaweb !== DEFAULT_POST_TO_PERMAWEB_VALUE ||
              data.remind !== DEFAULT_REMIND_VALUE ||
              richEmbed !== DEFAULT_RICH_EMBED_VALUE ||
              data.schedule !== DEFAULT_SCHEDULE_VALUE ||
              data.supermindReply !== null ||
              data.supermindRequest !== null ||
              data.tags !== DEFAULT_TAGS_VALUE ||
              data.title !== DEFAULT_TITLE_VALUE ||
              data.paywallThumbnail !== DEFAULT_PAYWALL_THUMBNAIL_VALUE ||
              JSON.stringify(data.siteMembershipGuids) !==
                JSON.stringify(DEFAULT_SITE_MEMBERSHIP_GUIDS_VALUE) ||
              data.audioThumbnail !== DEFAULT_AUDIO_THUMBNAIL_VALUE
          );
          return dirty;
        }
      })
    );

    // Subscribe to data stream and re-build API payload when it changes

    if (isPlatformBrowser(platformId)) {
      this.dataSubscription = this.data$.subscribe((data) => {
        return this.buildPayload(data);
      });
    }

    this.postButtonDisabled$ = combineLatest([
      this.canPost$,
      this.isPosting$,
      this.inProgress$,
    ]).pipe(
      map(([canPost, isPosting, inProgress]) => {
        return !canPost || isPosting || inProgress;
      })
    );

    this.nextButtonDisabled$ = combineLatest([
      this.canPost$,
      this.inProgress$,
    ]).pipe(
      map(([canPost, isPosting]) => {
        return !canPost || isPosting;
      })
    );

    // Subscribe to selected audience
    this.selectedAudienceSubscription =
      this.audienceSelectorService.selectedAudience$.subscribe((audience) => {
        if (audience) {
          // Can't have monetization when audience is selected
          this.pendingMonetization$.next(null);
        }
      });

    this.videoPermissionsErrorSubscription =
      this.uploaderService.videoPermissionsError$
        .pipe(
          throttleTime(2000) // Fire at most 2x/sec
        )
        .subscribe((error) => {
          if (error) {
            // Reset attachments & previews
            this.uploaderService.reset();
            this.attachments$.next(DEFAULT_ATTACHMENT_VALUE);
            this.setPreview(null);
          }
        });

    // Subscribe to pending monetization and format monetization$
    this.pendingMonetizationSubscription = this.pendingMonetization$.subscribe(
      (pendingMonetization) => {
        if (pendingMonetization) {
          this.monetization$.next({
            support_tier: pendingMonetization.support_tier,
          });

          // Revert to default audience (i.e. my channel)when monetization is selected
          this.audienceSelectorService.selectedAudience$.next(null);
        } else {
          this.monetization$.next(null);
        }
      }
    );

    // Subscribe to message and extract any URL it finds
    this.messageUrl$ = this.message$.pipe(
      map((message) => this.richEmbed.extract(message))
    );

    // Subscribe to message URL and rich embed in order to know if a URL should be resolved
    this.richEmbedExtractorSubscription = combineLatest([
      this.messageUrl$.pipe(distinctUntilChanged()),
      // get last 2 emissions - start with '' for first emission.
      this.richEmbed$.pipe(distinctUntilChanged(), startWith(''), pairwise()),
      this.attachments$.pipe(distinctUntilChanged()),
      this.remind$.pipe(distinctUntilChanged()),
    ])
      .pipe(debounceTime(isPlatformBrowser(platformId) ? 500 : 0))
      .subscribe(
        ([messageUrl, [previousRichEmbed, richEmbed], attachment, remind]) => {
          // Use current message URL when:
          // a) there's no rich embed already set; or
          // b) rich embed's type is a string (locally extracted); or
          // c) loaded activity don't have the entity GUID set (which mean is a blog)
          //
          // It won't emit an empty extraction to allow keeping embeds when deleting text
          // thanks to debounceTime pipe above.
          //
          // Be very careful, as it depends on the same observable we're modifying
          if (
            (!richEmbed ||
              typeof richEmbed === 'string' ||
              !richEmbed.entityGuid) &&
            !attachment
          ) {
            if (!this.canEditMetadata()) {
              return;
            }

            if (messageUrl && messageUrl !== previousRichEmbed) {
              this.richEmbed$.next(messageUrl);
            }
          }

          // If there is an attachment already provided then reset the rich embed
          // as we can't have both values
          if (richEmbed && attachment) {
            this.richEmbed$.next(DEFAULT_RICH_EMBED_VALUE);
          }
        }
      );
  }

  /**
   * Runs when dependant component is destroyed
   */
  ngOnDestroy(): void {
    this.tearDown();
  }

  /**
   * Destroys the service and its state
   */
  tearDown(): void {
    // Reset state and free resources
    this.reset();

    // Unsubscribe to data stream
    this.dataSubscription?.unsubscribe();

    // Unsubscribe from pending monetization
    this.pendingMonetizationSubscription.unsubscribe();

    // Unsubscribe from rich embed extractor
    this.richEmbedExtractorSubscription.unsubscribe();

    this.videoPermissionsErrorSubscription?.unsubscribe();

    this.livestreamSubscription?.unsubscribe();
  }

  /**
   * Sets the container for this instance.
   * @param { ActivityContainer } container - container to post to.
   * @returns { this }
   */
  public setContainer(container: ActivityContainer | null): this {
    this.audienceSelectorService.selectedAudience$.next(container);

    if (container && container.guid) {
      this.isGroupPost$.next(true);
    }
    return this;
  }

  /**
   * Gets the container GUID for this instance.
   * @returns { string } container guid if one is set.
   */
  public getContainerGuid(): string {
    return this.container?.guid ?? null;
  }

  /**
   * Resets composer data and state
   */
  reset(): void {
    // Reset data
    this.message$.next(DEFAULT_MESSAGE_VALUE);
    this.title$.next(DEFAULT_TITLE_VALUE);
    this.richEmbedTitle$.next(DEFAULT_RICH_EMBED_TITLE_VALUE);
    this.nsfw$.next(DEFAULT_NSFW_VALUE);
    this.pendingMonetization$.next(DEFAULT_PENDING_MONETIZATION_VALUE);
    this.monetization$.next(DEFAULT_MONETIZATION_VALUE);
    this.tags$.next(DEFAULT_TAGS_VALUE);
    this.schedule$.next(DEFAULT_SCHEDULE_VALUE);
    this.accessId$.next(DEFAULT_ACCESS_ID_VALUE);
    this.license$.next(DEFAULT_LICENSE_VALUE);
    this.attachments$.next(DEFAULT_ATTACHMENT_VALUE);
    this.richEmbed$.next(DEFAULT_RICH_EMBED_VALUE);
    this.paywallThumbnail$.next(DEFAULT_PAYWALL_THUMBNAIL_VALUE);
    this.audioThumbnail$.next(DEFAULT_AUDIO_THUMBNAIL_VALUE);
    this.remind$.next(DEFAULT_REMIND_VALUE);

    // Reset state
    this.inProgress$.next(false);
    this.isPosting$.next(false);
    this.attachmentError$.next(null);
    this.isEditing$.next(false);
    this.isMovingContent$.next(false);
    this.isGroupPost$.next(false);

    // Reset preview (state + blob URL)
    this.setPreview(null);

    // Reset rich embed preview
    this.richEmbedPreview$.next(null);

    this.postToPermaweb$.next(false);

    // Reset upload state
    this.uploaderService.reset();

    // Reset supermind state
    this.supermindRequest$.next(null);
    this.supermindReply$.next(null);

    // Reset audience
    this.audienceSelectorService.selectedAudience$.next(null);
    this.audienceSelectorService.shareToGroupMode$.next(false);

    // Reset livestream
    this.livestreamService.setStream(null);

    // Reset site membership
    this.siteMembershipGuids$.next(null);
    this.showSiteMembershipPostPreview$.next(false);

    // Reset boost state.
    this.composerBoostService.reset();

    // Reset original source
    this.entity = null;
  }

  /**
   * Loads an activity from API payload
   *
   * @param activity
   */
  load(activity: any) {
    if (!activity) {
      return;
    }

    this.reset();

    // Save a clone of the original activity that was loaded
    this.entity = JSON.parse(JSON.stringify(activity));

    // Build the fields
    const message = activity.message || DEFAULT_MESSAGE_VALUE;
    const title = activity.title || DEFAULT_TITLE_VALUE;
    const nsfw = activity.nsfw || DEFAULT_NSFW_VALUE;
    const monetization = activity.wire_threshold || DEFAULT_MONETIZATION_VALUE;
    const tags = activity.tags || DEFAULT_TAGS_VALUE;
    const schedule =
      activity.time_created && activity.time_created * 1000 > Date.now() + 15000
        ? activity.time_created
        : null;
    const accessId =
      activity.access_id !== null
        ? activity.access_id
        : DEFAULT_ACCESS_ID_VALUE;
    const license = activity.license || DEFAULT_LICENSE_VALUE;

    // Build attachment and rich embed data structure

    let attachments: AttachmentSubjectValue = DEFAULT_ATTACHMENT_VALUE;
    let richEmbed: RichEmbedSubjectValue = DEFAULT_RICH_EMBED_VALUE;

    if (activity.custom_type === 'batch') {
      attachments = activity.custom_data.map((item) => {
        return {
          type: 'image',
          guid: item.guid,
        } as Attachment;
      });
    } else if (activity.custom_type === 'video') {
      attachments = [
        {
          type: 'video',
          guid: activity.entity_guid,
        } as Attachment,
      ];
    } else if (activity.custom_type === 'audio') {
      attachments = [
        {
          type: 'audio',
          guid: activity.entity_guid,
        } as Attachment,
      ];
      this.audioThumbnail$.next(activity.custom_data?.thumbnail_src ?? null);
    } else if (activity.entity_guid || activity.perma_url) {
      // Rich embeds (blogs included)
      richEmbed = {
        entityGuid: activity.entity_guid || null,
        url: activity.perma_url,
        title: activity.title || '',
        description: activity.blurb || '',
        thumbnail: activity.thumbnail_src || '',
      };
    }

    // Priority service state elements

    this.remind$.next(activity.remind_object || null);
    this.attachments$.next(attachments);
    this.richEmbed$.next(richEmbed);

    // Apply them to the service state

    this.message$.next(message);
    this.title$.next(title);
    this.nsfw$.next(nsfw);
    this.monetization$.next(monetization);
    this.tags$.next(tags);
    this.schedule$.next(schedule);
    this.accessId$.next(accessId);
    this.license$.next(license);
    this.isSiteMembershipPost$.next(activity?.site_membership);

    // Define container

    if (typeof activity.container_guid !== 'undefined') {
      this.setContainer({
        guid: activity.containerGuid,
        type: 'group',
        name: '', // not available in this context.
      });
      this.isGroupPost$.next(true);
    }

    this.isEditing$.next(true);
  }

  /**
   * Updates the preview. Frees resources, if needed.
   * @param attachment
   */
  setPreview(attachments: AttachmentSubjectValue) {
    const currentPreviews = this.attachmentPreviews$.getValue();

    for (let i in currentPreviews) {
      this.preview.prune(currentPreviews[i]);
    }

    this.attachmentPreviews$.next(this.preview.build(attachments));
  }

  /**
   * Deletes the current attachment, if any
   */
  removeAttachment() {
    if (!this.canEditMetadata()) {
      return;
    }

    const payload = this.payload;

    // Clean up attachment ONLY if the new entity GUID is different from the original source, if any
    if (
      payload &&
      payload.entity_guid &&
      !this.isOriginalEntity(payload.entity_guid)
    ) {
      this.attachment.prune(payload.entity_guid);
    }

    this.attachments$.next(null);
    this.paywallThumbnail$.next(null);
    this.title$.next(null);
  }

  /**
   * Removes an audio attachment.
   * @returns { void }
   */
  public removeAudioAttachment(): void {
    this.uploaderService.reset();
    this.attachmentPreviews$.next([]);
    this.audioThumbnail$.next(DEFAULT_AUDIO_THUMBNAIL_VALUE);
    this.removeAttachment();
  }

  /**
   * Deletes the current rich embed
   */
  removeRichEmbed(): void {
    if (!this.canEditMetadata()) {
      return;
    }

    this.richEmbed$.next(DEFAULT_RICH_EMBED_VALUE);
  }

  /**
   * Used to prevent original entity deletion when editing an activity. That operation is handled in the engine.
   * @param entityGuid
   */
  protected isOriginalEntity(entityGuid): boolean {
    if (!this.entity || typeof this.entity.entity_guid === 'undefined') {
      return false;
    }

    return (entityGuid || '') === (this.entity.entity_guid || '');
  }

  /**
   * Can metadata be edited? Only if the original activity doesn't have both a URL and an entity_guid, or it's not a remind
   */
  canEditMetadata(): boolean {
    if (!this.entity) {
      return true;
    } else if (this.entity.remind_object) {
      return false;
    }

    return !this.entity.perma_url || !this.entity.entity_guid;
  }

  /**
   * Builds the API payload and sets to a property
   * @param message
   * @param title
   * @param attachmentGuids
   * @param nsfw
   * @param monetization
   * @param tags
   * @param accessId
   * @param license
   * @param schedule
   * @param richEmbed
   * @param paywallThumbnail
   * @param audioThumbnail
   * @param postToPermaweb
   * @param remind
   * @param supermindRequest
   * @param supermindReply
   * @param siteMembershipGuids
   * @param container
   */
  buildPayload({
    message,
    title,
    richEmbedTitle,
    nsfw,
    monetization,
    tags,
    schedule,
    accessId,
    license,
    attachmentGuids,
    richEmbed,
    paywallThumbnail,
    audioThumbnail,
    postToPermaweb,
    remind,
    supermindRequest,
    supermindReply,
    siteMembershipGuids,
    container,
  }: Data): any {
    if (this.container && this.container.guid) {
      // Override accessId if there's a container set
      accessId = this.container.guid;
      this.isGroupPost$.next(true);
    }

    // Preventing paywallception: you cannot paywall an already paywalled remind
    const monetized = !remind?.paywall && monetization;

    this.payload = {
      message: message || '',
      wire_threshold: monetized ? monetization : null,
      paywall: monetized,
      time_created: schedule || null,
      mature: nsfw && nsfw.length > 0,
      nsfw: nsfw || [],
      tags: tags || [],
      access_id: accessId,
      license: license,
      post_to_permaweb: postToPermaweb,
    };

    if (richEmbedTitle) {
      this.payload.link_title = richEmbedTitle;
    }

    if (remind) {
      this.payload.remind_guid = remind.guid;
    }

    if (supermindRequest) {
      this.payload.supermind_request = supermindRequest;
    }

    if (supermindReply) {
      this.payload.supermind_reply_guid = supermindReply.guid;
    }

    if (this.canEditMetadata()) {
      if (attachmentGuids?.length > 0) {
        this.payload.title = title;
        this.payload.attachment_guids = attachmentGuids;
        this.payload.is_rich = false; // Can never have rich embed with media posts
      } else if (richEmbed && !richEmbed.entityGuid) {
        this.payload.url = richEmbed.url;
        this.payload.description = richEmbed.description;
        this.payload.thumbnail = richEmbed.thumbnail;
        this.payload.is_rich = true;
        this.payload.link_title = richEmbed.title;

        if (!this.isOriginalEntity(richEmbed.entityGuid)) {
          this.payload.entity_guid_update = true;
        }
      } else if (!this.isOriginalEntity(null)) {
        this.payload.entity_guid_update = true;
      }
    }

    if (container && container.guid) {
      this.payload.container_guid = container.guid;
    }

    if (paywallThumbnail && paywallThumbnail.fileBase64) {
      this.payload.paywall_thumbnail = paywallThumbnail.fileBase64;
    }

    if (audioThumbnail) {
      this.payload.audio_thumbnail = audioThumbnail;
    }

    if (siteMembershipGuids) {
      this.payload.title = title;
      this.payload.site_membership_guids = siteMembershipGuids;
    }
  }

  /**
   * Sets the current progress state
   *
   * @param inProgress
   * @private
   */
  setProgress(inProgress: boolean): void {
    this.inProgress$.next(inProgress);
  }

  /**
   * Posts a new activity
   */
  async post(clientMeta: ClientMetaData = null): Promise<ActivityEntity> {
    this.isPosting$.next(true);
    this.setProgress(true);

    const editing = this.entity && this.entity.guid;

    try {
      let activity;

      if (clientMeta) {
        this.payload['client_meta'] = clientMeta;
      }

      if (editing) {
        activity = await this.api
          .post(`api/v3/newsfeed/activity/${this.entity.guid}`, this.payload)
          .toPromise();
      } else {
        // New activity
        this.livestreamSubscription = this.livestreamService
          .getCreatedStream()
          .pipe(take(1))
          .subscribe((stream) => {
            if (stream) {
              this.payload.is_rich = true;
              this.payload.url = `https://minds-player.vercel.app?v=${stream.playbackId}`;
              this.payload.title = `https://minds-player.vercel.app?v=${stream.playbackId}`;
              this.payload.description = `https://minds-player.vercel.app?v=${stream.playbackId}`;
              this.payload.thumbnail = `https://minds-player.vercel.app?v=${stream.playbackId}`;
              this.livestreamService.toggleRecordLivestream(stream.id, true);
            }
          });
        activity = await this.api
          .put(`api/v3/newsfeed/activity`, this.payload)
          .toPromise();

        this.feedsUpdate.postEmitter.emit(activity);
        this.onboardingService.forceCompletion('CreatePostStep');
        this.livestreamService.setStream(null);

        if (this.composerBoostService.isBoostMode$.getValue()) {
          this.composerBoostService.openBoostModal(activity);
        }
      }

      if (this.payload.supermind_reply_guid) {
        this.toasterService.success(
          'Your Supermind reply was posted, and you’ve collected the offer.'
        );
      }

      this.reset();
      this.isPosting$.next(false);
      this.setProgress(false);

      activity.boostToggle = true;
      return activity;
    } catch (e) {
      this.isPosting$.next(false);
      this.setProgress(false);
      throw e; // Re-throw
    }
  }
}
