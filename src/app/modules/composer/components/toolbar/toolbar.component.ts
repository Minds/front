import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
  Input,
  Injector,
} from '@angular/core';
import { Subject, Subscription, BehaviorSubject, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  first,
  last,
  map,
  take,
} from 'rxjs/operators';
import {
  AttachmentSubjectValue,
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
import { AttachmentErrorComponent } from '../popup/attachment-error/attachment-error.component';
import isMobile from '../../../../helpers/is-mobile';
import { UploaderService } from '../../services/uploader.service';
import { ComposerSupermindComponent } from '../popup/supermind/supermind.component';
import { MediaQuotesExperimentService } from '../../../experiments/sub-services/media-quotes-experiment.service';
import { SupermindExperimentService } from '../../../experiments/sub-services/supermind-experiment.service';
import { ModalService } from '../../../../services/ux/modal.service';
import { ConfirmV2Component } from '../../../modals/confirm-v2/confirm';
import {
  SupermindComposerPayloadType,
  SUPERMIND_PAYMENT_METHODS,
} from '../popup/supermind/superminds-creation.service';

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
  @Output('onPost') onPostEmitter: EventEmitter<MouseEvent> = new EventEmitter<
    MouseEvent
  >();

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
  @ViewChild('toolbarWrapper', { static: true }) toolbarWrapper: ElementRef<
    HTMLDivElement
  >;

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
    map(count => count > 0)
  );

  canSchedule$ = this.service.canSchedule$;

  /**
   * True/False if supermind request is inprogress
   */
  isSupermindRequest: boolean = false;

  /**
   * Details of supermind request (if applicable)
   */
  supermindRequest: SupermindComposerPayloadType;

  /**
   * Flag as to if we show supermind create button
   */
  canCreateSupermindRequest$ = this.service.canCreateSupermindRequest$.pipe(
    map(canCreateSupermindRequest => {
      return this.supermindExperiment.isActive() && canCreateSupermindRequest;
    })
  );

  /**
   * Constructor
   * @param service
   * @param popup
   * @param cd
   * @param platformId
   */
  constructor(
    protected service: ComposerService,
    protected popup: PopupService,
    protected cd: ChangeDetectorRef,
    protected toaster: ToasterService,
    protected uploaderService: UploaderService,
    @Inject(PLATFORM_ID) protected platformId: Object,
    protected mediaQuotesExperiment: MediaQuotesExperimentService,
    protected supermindExperiment: SupermindExperimentService,
    public modalService: ModalService,
    private injector: Injector
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
        uploadCount => (this.uploadCount = uploadCount)
      ),
      this.service.isSupermindRequest$.subscribe(is => {
        this.isSupermindRequest = is;
      }),
      this.service.supermindRequest$.subscribe(request => {
        this.supermindRequest = request;
      })
    );

    /**
     * Don't show the monetize button if a post has a
     * legacy paywall because of potential
     * multi-currency complications.
     */
    if (this.service.monetization$.getValue()) {
      const paywall = this.service.monetization$.getValue();

      if (paywall && !paywall.hasOwnProperty('support_tier')) {
        this.legacyPaywallEnabled = true;
      }
    }
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
    return this.size$.pipe(map(size => size === 'compact' && !this.isModal));
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
    // Get confirmation before posting a supermind offer
    if (this.isSupermindRequest) {
      this.openSupermindConfirmationModal($event);
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

  fileUploadVisible$ = this.remind$.pipe(
    map(remind => {
      if (this.mediaQuotesExperiment.isActive()) {
        return true;
      }

      return !remind;
    })
  );

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

    const modal = this.modalService.present(ConfirmV2Component, {
      data: {
        title: 'Confirm Offer',
        body: `Are you sure you want to send @${username} a ${amountStr} offer?`,
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
   * Triggers change detection
   */
  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
