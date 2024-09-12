import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  combineLatest,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  take,
  tap,
} from 'rxjs/operators';
import {
  ComposerService,
  ComposerSize,
  MonetizationSubjectValue,
  NsfwSubjectValue,
  RemindSubjectValue,
  TagsSubjectValue,
} from '../../services/composer.service';
import {
  FileUploadComponent,
  FileUploadSelectEvent,
} from '../../../../common/components/file-upload/file-upload.component';
import { PopupService } from '../popup/popup.service';
import { NsfwComponent } from '../popup/nsfw/nsfw.component';
import { ComposerMonetizeV2Component } from '../popup/monetize/v2/components/monetize.component';
import { TagsComponent } from '../popup/tags/tags.component';
import { ScheduleComponent } from '../popup/schedule/schedule.component';
import { isPlatformBrowser } from '@angular/common';
import { ToasterService } from '../../../../common/services/toaster.service';
import isMobile from '../../../../helpers/is-mobile';
import { UploaderService } from '../../services/uploader.service';
import { ComposerSupermindComponent } from '../popup/supermind/supermind.component';
import { ModalService } from '../../../../services/ux/modal.service';
import { ConfirmV2Component } from '../../../modals/confirm-v2/confirm.component';
import {
  SUPERMIND_PAYMENT_METHODS,
  SupermindComposerPayloadType,
} from '../popup/supermind/superminds-creation.service';
import { SupermindReplyConfirmModalComponent } from '../../../modals/supermind-reply-confirm/supermind-reply-confirm-modal.component';
import { Supermind } from '../../../supermind/supermind.types';
import { ExperimentsService } from '../../../experiments/experiments.service';
import { PermissionsService } from '../../../../common/services/permissions.service';
import { NsfwEnabledService } from '../../../multi-tenant-network/services/nsfw-enabled.service';
import { ComposerSiteMembershipSelectorComponent } from '../popup/site-membership-selector/site-membership-selector.component';
import { SiteMembershipsCountService } from '../../../site-memberships/services/site-membership-count.service';
import { ComposerBoostService } from '../../services/boost.service';

/**
 * Composer toolbar. Displays important actions
 * on the bottom row of the composer.
 */
@Component({
  selector: 'm-composer__toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.ng.scss'],
})
export class ToolbarComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  /**
   * On Post event emitter
   */
  @Output('onPost') onPostEmitter: EventEmitter<MouseEvent> =
    new EventEmitter<MouseEvent>();

  /**
   * Is the composer in a modal?
   */
  @Input() isModal: boolean = false;

  /**
   * Upload component ref
   */
  @ViewChild('fileUploadComponent')
  fileUploadComponent: FileUploadComponent;

  /**
   * Toolbar main <div> element
   */
  @ViewChild('toolbarWrapper', { static: true })
  toolbarWrapper: ElementRef<HTMLDivElement>;

  /**
   * Show narrow style
   */
  narrow: boolean = true;

  /**
   * Window resize event observable
   */
  protected windowResize$: Subject<void> = new Subject<void>();

  /**
   * Window resize event subscription
   */
  protected attachmentSubscription: Subscription;

  public legacyPaywallEnabled: boolean = false;

  remind$: Observable<RemindSubjectValue> = this.service.remind$;

  /**
   * The count of actively selected uploads
   */
  uploadCount$ = this.uploaderService.filesCount$;
  uploadCount: number = 0;

  /**
   * Boolean of if any uploads are active (selected)
   */
  uploadActive$: Observable<boolean> = this.uploadCount$.pipe(
    map((count) => count > 0)
  );

  canSchedule$ = this.service.canSchedule$;

  /**
   * True/False if supermind request is inprogress
   */
  isSupermindRequest: boolean = false;

  /**
   * True/False if supermind reply is inprogress
   */
  isSupermindReply: boolean = false;

  /**
   * Details of supermind request (if applicable)
   */
  supermindRequest: SupermindComposerPayloadType;

  /**
   * Details of supermind request for the reply
   * @private
   */
  private supermindReply: Supermind;

  /**
   * Whether Supermind request can be created.
   */
  public readonly canCreateSupermindRequest$ =
    this.service.canCreateSupermindRequest$;

  public readonly shouldShowSiteMemberships$: Observable<boolean> =
    this.siteMembershipsCountService.count$.pipe(
      distinctUntilChanged(),
      map((count: number) => {
        return count > 0;
      })
    );

  /**
   * Whether the post (or next or save) button is disabled
   */
  postButtonDisabled: boolean = true;

  /**
   * Constructor
   * @param service
   * @param popup
   * @param cd
   * @param toaster
   * @param uploaderService
   * @param platformId
   * @param modalService
   * @param injector
   * @param experimentService
   */
  constructor(
    protected service: ComposerService,
    private composerBoostService: ComposerBoostService,
    protected popup: PopupService,
    protected cd: ChangeDetectorRef,
    protected toaster: ToasterService,
    protected uploaderService: UploaderService,
    @Inject(PLATFORM_ID) protected platformId: Object,
    public modalService: ModalService,
    private injector: Injector,
    protected permissions: PermissionsService,
    protected nsfwEnabledService: NsfwEnabledService,
    protected siteMembershipsCountService: SiteMembershipsCountService
  ) {}

  /**
   * Handles Init event
   * @internal
   */
  ngOnInit(): void {
    this.subscriptions.push(
      this.windowResize$
        .pipe(debounceTime(250))
        .subscribe(() => this.calcNarrow()),
      this.uploadCount$.subscribe(
        (uploadCount) => (this.uploadCount = uploadCount)
      ),
      this.service.isSupermindRequest$.subscribe((is) => {
        this.isSupermindRequest = is;
        this.detectChanges();
      }),
      this.service.supermindRequest$.subscribe((request) => {
        this.supermindRequest = request;
      }),
      this.service.isSupermindReply$.subscribe((is) => {
        this.isSupermindReply = is;
        this.detectChanges();
      }),
      this.service.supermindReply$.subscribe((details) => {
        this.supermindReply = details;
      }),
      this.service.monetization$.subscribe((monetized) => {
        /**
         * Don't show the monetize button if a post has a
         * legacy paywall because of potential
         * multi-currency complications.
         */
        const paywall = monetized;

        if (paywall && !paywall.hasOwnProperty('support_tier')) {
          this.legacyPaywallEnabled = true;
        }
      }),
      this.service.postButtonDisabled$.subscribe((disabled) => {
        this.postButtonDisabled = disabled;
        this.detectChanges();
      })
    );
  }

  /**
   * Handles View Init event
   * @internal
   */
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.calcNarrow(), 250);
    }
  }

  /**
   * Handles window resize event
   * @internal
   */
  @HostListener('window:resize') onWindowResize() {
    this.windowResize$.next();
  }

  /**
   * Triggers when change detection runs
   * @internal
   */
  ngOnChanges() {
    this.windowResize$.next();
  }

  /**
   * Handles Destroy event
   * @internal
   */
  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Calculates if the toolbar should be "narrow" (no labels)
   */
  calcNarrow() {
    if (
      this.toolbarWrapper.nativeElement &&
      this.toolbarWrapper.nativeElement.clientWidth
    ) {
      const narrow = this.toolbarWrapper.nativeElement.clientWidth <= 550;

      if (narrow !== this.narrow) {
        this.narrow = narrow;
        this.detectChanges(); // Be VERY CAREFUL as this runs on ngOnChanges, as well
      }
    }
  }

  /**
   * NSFW subject from service
   */
  get nsfw$(): BehaviorSubject<NsfwSubjectValue> {
    return this.service.nsfw$;
  }

  /**
   * Monetization subject from service
   */
  get monetization$(): BehaviorSubject<MonetizationSubjectValue> {
    return this.service.monetization$;
  }

  /**
   * Tags subject from service
   */
  get tags$(): BehaviorSubject<TagsSubjectValue> {
    return this.service.tags$;
  }

  /**
   * Can edit metadata? (attachment/rich embed/remind)
   */
  get canEditMetadata(): boolean {
    return this.service.canEditMetadata();
  }

  /**
   * inProgress subject from service
   */
  get inProgress$(): BehaviorSubject<boolean> {
    return this.service.inProgress$;
  }

  /**
   * Is posting flag from the service
   */
  get isPosting$() {
    return this.service.isPosting$;
  }

  /**
   * canPost subject from service
   */
  get canPost$() {
    return this.service.canPost$;
  }

  /**
   * siteMembershipGuids subject from service
   */
  get siteMembershipGuids$() {
    return this.service.siteMembershipGuids$;
  }

  /**
   * Is this an edit?
   */
  get isEditing$() {
    return this.service.isEditing$;
  }

  get showShimmer() {
    return this.isModal && !this.service.monetization$.getValue();
  }

  /**
   * Composer size from service.
   * @returns { BehaviorSubject<ComposerSize> } - Composer size.
   */
  get size$(): BehaviorSubject<ComposerSize> {
    return this.service.size$;
  }

  /**
   * Compact mode if size is compact and NOT in a modal.
   * @returns { Observable<boolean> } - holds true if compact mode should be applied.
   */
  get isCompactMode$(): Observable<boolean> {
    return this.size$.pipe(map((size) => size === 'compact' && !this.isModal));
  }

  /**
   * True if composer service is instantiated in a group context (with a container_guid).
   * @returns { Observable<boolean> } - holds true when this is in a group context.
   */
  get isGroupPost$(): Observable<boolean> {
    return this.service.isGroupPost$;
  }

  /**
   * Emits the new attachment
   * @param $event
   */
  onAttachmentSelect($event: FileUploadSelectEvent): void {
    let uploadCount = this.uploadCount;

    for (let i in $event) {
      if (uploadCount++ >= 4) {
        this.toaster.error('You may not upload more than 4 images');
        return;
      }

      const file: File = $event[i];
      this.uploaderService.file$$.next(file);
    }
  }

  /**
   * Shows NSFW popup
   * @param $event
   */
  async onNsfwClick($event?: MouseEvent): Promise<void> {
    if (this.composerBoostService.isBoostMode$.getValue()) {
      this.toaster.error('NSFW content cannot be boosted');
      return;
    }

    await this.popup
      .create(NsfwComponent)
      .present()
      .toPromise(/* Promise is needed to boot-up the Observable */);
  }

  /**
   * Shows monetization popup
   * @param $event
   */
  async onMonetizeClick($event?: MouseEvent): Promise<void> {
    if (this.service.postToPermaweb$?.getValue()) {
      this.toaster.warn('You cannot monetize permaweb posts');
      return;
    }
    await this.popup
      .create(ComposerMonetizeV2Component)
      .present()
      .toPromise(/* Promise is needed to boot-up the Observable */);
  }

  /**
   * Shows site membership popup
   * @param $event
   */
  async onSiteMembershipClick($event?: MouseEvent): Promise<void> {
    await this.popup
      .create(ComposerSiteMembershipSelectorComponent)
      .present()
      .toPromise(/* Promise is needed to boot-up the Observable */);
  }

  /**
   * Shows tags popup
   * @param $event
   */
  async onTagsClick($event?: MouseEvent): Promise<void> {
    await this.popup
      .create(TagsComponent)
      .present()
      .toPromise(/* Promise is needed to boot-up the Observable */);
  }

  /**
   * Shows supermind popup
   * @param $event
   */
  async onSupermindClick($event?: MouseEvent): Promise<void> {
    await this.popup
      .create(ComposerSupermindComponent)
      .present()
      .toPromise(/* Promise is needed to boot-up the Observable */);
  }

  /**
   * Shows scheduler popup
   * @param $event
   */
  async onSchedulerClick($event?: MouseEvent): Promise<void> {
    await this.popup
      .create(ScheduleComponent)
      .present()
      .toPromise(/* Promise is needed to boot-up the Observable */);
  }

  /**
   * Emits post event
   * @param $event
   */
  onPost($event: MouseEvent): void {
    if (this.service.siteMembershipGuids$.getValue()) {
      return;
    }

    // Get confirmation before posting a supermind offer
    if (this.isSupermindRequest) {
      this.openSupermindConfirmationModal($event);
      return;
    }

    if (this.isSupermindReply) {
      this.openSupermindReplyConfirmationModal($event);
      return;
    }

    this.onPostEmitter.emit($event);
  }

  /**
   * Inserts the emoji in the message input at the caret position
   * @param emoji
   */
  onEmoji(emoji: any): void {
    const message = this.service.message$.getValue();
    const caretPosition = this.service.selection$.getValue().start;
    const preText = message.substring(0, caretPosition);
    const postText = message.substring(caretPosition);
    this.service.message$.next(preText + emoji.native + postText);
    // move cursor after the emoji
    this.service.selection$.next({
      start: this.service.selection$.getValue().start + emoji.native.length,
      end: this.service.selection$.getValue().end + emoji.native.length,
    });
  }

  isMobile() {
    return isMobile();
  }

  /**
   * Opens modal to confirm supermind offer
   * @returns { void }
   */
  public openSupermindConfirmationModal($event: MouseEvent): void {
    if (!this.supermindRequest) return;

    // Note: this works b/c Supermind composer uses a username
    // here instead of a receiver_guid
    const username = this.supermindRequest.receiver_guid;

    const paymentOptions = this.supermindRequest.payment_options;

    const amountStr =
      paymentOptions.payment_type === SUPERMIND_PAYMENT_METHODS.CASH
        ? `$${paymentOptions.amount}`
        : `${paymentOptions.amount} token`;

    let body = `Are you sure you want to send @${username} a ${amountStr} offer? This transaction is non-refundable once the recipient approves your offer.`;

    if (paymentOptions.payment_type === SUPERMIND_PAYMENT_METHODS.CASH) {
      body += ` Your card will be authorized now, and charged once @${username} accepts your offer.`;
    }

    const modal = this.modalService.present(ConfirmV2Component, {
      data: {
        title: 'Confirm Offer',
        body,
        confirmButtonColor: 'blue',
        onConfirm: () => {
          this.onPostEmitter.emit($event);
          modal.dismiss();
        },
      },
      injector: this.injector,
    });
  }

  /**
   * Opens modal to confirm supermind reply
   * @returns { void }
   */
  openSupermindReplyConfirmationModal($event: MouseEvent): void {
    const modal = this.modalService.present(
      SupermindReplyConfirmModalComponent,
      {
        data: {
          isTwitterReplyRequired: this.supermindReply.twitter_required,
          onConfirm: () => {
            this.onPostEmitter.emit($event);
            modal.dismiss();
          },
          onClose: () => {
            modal.dismiss();
          },
        },
        size: 'lg',
        injector: this.injector,
        windowClass: 'm-modalV2__mobileFullCover',
      }
    );
  }

  /**
   * When the user clicks 'next' on a site membership post
   */
  onClickNext(): void {
    this.service.showSiteMembershipPostPreview$.next(true);
  }

  /**
   * Triggers change detection
   */
  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
