import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { UniqueId } from '../../../../helpers/unique-id.helper';
import {
  ComposerService,
  ComposerSize,
  RemindSubjectValue,
} from '../../services/composer.service';
import { PopupService } from '../popup/popup.service';
import { PopupComponent } from '../popup/popup.component';
import { TextAreaComponent } from '../text-area/text-area.component';
import { Router } from '@angular/router';
import { InMemoryStorageService } from '../../../../services/in-memory-storage.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { distinctUntilChanged, first, map } from 'rxjs/operators';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  firstValueFrom,
} from 'rxjs';
import { BlogPreloadService } from '../../../blogs/v2/edit/blog-preload.service';
import { UploaderService } from '../../services/uploader.service';
import { ComposerSupermindComponent } from '../popup/supermind/supermind.component';
import { ClientMetaDirective } from '../../../../common/directives/client-meta.directive';
import { ClientMetaData } from '../../../../common/services/client-meta.service';
import { ComposerModalService } from '../modal/modal.service';
import { ComposerAudienceSelectorPanelComponent } from '../popup/audience-selector/audience-selector.component';
import { ComposerAudienceSelectorService } from '../../services/audience.service';
import { PermissionsService } from '../../../../common/services/permissions.service';

/**
 * Base component for composer. It contains all the parts.
 * Used to compose all activity types except for blogs and reminds.
 */
@Component({
  selector: 'm-composer__base',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'base.component.html',
  providers: [PopupService],
})
export class BaseComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  /**
   * Post event emitter
   */
  @Output('onPost') onPostEmitter: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Is the composer in a modal?
   */
  @Input() isModal: boolean = false;

  /**
   * We use this to ensure we don't show the preview pane in the composer preview trigger
   */
  private isModalSubject = new BehaviorSubject<boolean>(this.isModal);

  /**
   * If we should show the default composer pane,
   * or the membership preview pane that comes afterwards
   */
  showMembershipPreviewPane$: Observable<boolean>;

  /**
   * Popup component ref
   */
  @ViewChild('popupComponent', { static: true }) popupComponent: PopupComponent;

  /**
   * Text area component ref
   */
  @ViewChild('textAreaComponent', { static: false })
  textAreaComponent: TextAreaComponent;

  /**
   * Unique ID for textarea
   */
  textareaId: string = UniqueId.generate('m-composer__textarea');

  /**
   * Last error
   */
  error: string;

  /**
   * The urn of the Minds+ support tier
   */
  private readonly plusTierUrn: string;

  /**
   * Remind subject
   */
  remind$: Observable<RemindSubjectValue> = this.service.remind$;

  subscriptions: Subscription[] = [];

  isDirty: boolean = false;

  @ViewChild(ClientMetaDirective) clientMeta: ClientMetaDirective;

  /** Is this an edit? */
  public readonly isEditing$: Observable<boolean> = this.service.isEditing$;

  /**
   * Constructor
   * @param service
   * @param popup
   * @param router
   * @param inMemoryStorage
   * @param cd
   * @param injector
   */
  constructor(
    protected service: ComposerService,
    protected popup: PopupService,
    protected audienceSelectorService: ComposerAudienceSelectorService,
    protected router: Router,
    protected inMemoryStorage: InMemoryStorageService,
    protected cd: ChangeDetectorRef,
    protected injector: Injector,
    protected toasterService: ToasterService,
    protected blogPreloadService: BlogPreloadService,
    private composerModal: ComposerModalService,
    configs: ConfigsService,
    protected uploaderService: UploaderService,
    protected permissions: PermissionsService
  ) {
    this.plusTierUrn = configs.get('plus').support_tier_urn;

    this.attachmentError$.pipe(distinctUntilChanged()).subscribe((error) => {
      if (error) {
        this.service.removeAttachment();
      }
    });
  }

  ngOnInit(): void {
    // Show the preview pane only if we're in a modal (i.e. not embedded)
    this.showMembershipPreviewPane$ = combineLatest([
      this.service.showSiteMembershipPostPreview$,
      this.isModalSubject.asObservable(),
    ]).pipe(map(([showPreview, isModal]) => showPreview && isModal));
  }

  /**
   * Whenever isModal changes, update its BehaviorSubject
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isModal) {
      this.isModalSubject.next(this.isModal);
    }
  }

  /**
   * Initializes after all components were injected
   */
  ngAfterViewInit(): void {
    this.popup.setUp(this.popupComponent, this.injector);

    /**
     * When we initialize, if we already have a supermind request payload, open the
     * supermind popup
     */
    if (this.service.supermindRequest$.getValue()) {
      this.displaySupermindRequestPopup();
    }

    // if the audience selector is in share to group mode, open popup on load.
    if (this.audienceSelectorService.shareToGroupMode$.getValue()) {
      this.displayAudienceSelectorPopup();
    }

    this.subscriptions.push(
      this.service.isDirty$.subscribe((isDirty) => {
        this.isDirty = isDirty;
      })
    );

    if (this.isModal) {
      setTimeout(() => {
        this.focus();
      });
    }
  }

  ngOnDestroy(): void {
    this.service.reset();

    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Attachment preview subject in service
   */
  get attachmentPreviews$() {
    return this.service.attachmentPreviews$;
  }

  /**
   * Rich embed preview subject in service
   */
  get richEmbedPreview$() {
    return this.service.richEmbedPreview$;
  }

  /**
   * In progress boolean subject in service
   */
  get inProgress$() {
    return this.service.inProgress$;
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
   * Attachment error subject in service
   */
  get attachmentError$() {
    return this.service.attachmentError$;
  }

  /**
   * Focuses the main text area
   */
  focus() {
    setTimeout(() => {
      this.textAreaComponent.focus();
    }, 100);
  }

  /**
   * Creates a blog using the current message
   */
  createBlog() {
    const message = this.service.message$.getValue();

    this.service.isMovingContent$.next(true);
    this.inMemoryStorage.set('newBlogContent', message);

    if (this.popupComponent) {
      this.popup.close();
    }

    this.blogPreloadService.next(message);
    this.router.navigate(['/blog/v2/edit/new']);
    this.composerModal.dismiss();
  }

  /**
   * Updates the attachment. Called when pasting an image or video.
   * @param file
   */
  onAttachmentPaste(file) {
    this.uploaderService.file$$.next(file);
  }

  /**
   * Ensure Minds+ posts follow the rules
   */
  async meetsPlusPostRequirements(): Promise<boolean> {
    const mon = this.service.monetization$.getValue();
    const isPlusPost =
      mon && mon.support_tier && mon.support_tier.urn === this.plusTierUrn;

    if (!isPlusPost) {
      return true;
    }

    // Cannot be an external link
    const richEmbed = this.service.richEmbed$.getValue();
    const messageUrl = await this.service.messageUrl$.pipe(first()).toPromise();

    if (
      messageUrl ||
      (richEmbed && !this.richEmbedPreview$.getValue().entityGuid)
    ) {
      this.toasterService.error('Minds+ posts cannot be external links');
      return false;
    }

    // Must have 1+ hashtags
    if (this.service.tagCount$.getValue() < 1) {
      this.toasterService.error('Minds+ posts must have at least one hashtag');
      return false;
    }

    // Can not be NSFW
    if (this.service.nsfw$.getValue().length > 0) {
      this.toasterService.error('Minds+ posts can not be NSFW');
      return false;
    }

    return true;
  }

  /**
   * Post intent
   * @param event
   */
  async onPost(event) {
    if (!(await this.meetsPlusPostRequirements())) {
      return;
    }

    try {
      this.error = '';
      this.detectChanges();

      let clientMeta: ClientMetaData = null;
      const quoteEntity = this.service.remind$.getValue();
      if (quoteEntity) {
        let newMetaData = {
          campaign: quoteEntity['urn'],
        };
        if (quoteEntity['boosted']) {
          newMetaData['medium'] = 'boost';
        }
        clientMeta = this.clientMeta.build(newMetaData);
      }

      const activity = await this.service.post(clientMeta);
      this.onPostEmitter.next(activity);
    } catch (e) {
      this.error = (e && e.message) || 'Internal error';

      if (e.error && e.error.message) {
        this.error = e.error.message;
      }

      if (e?.error?.errors?.length > 0) {
        for (let i in e.error.errors) {
          this.toasterService.error(e.error.errors[i].message);
        }
      } else {
        this.toasterService.error(this.error);
      }
    }

    this.detectChanges();
  }

  /**
   * Will launch the supermind request popup
   */
  async displaySupermindRequestPopup() {
    await this.popup
      .create(ComposerSupermindComponent)
      .present()
      .toPromise(/* Promise is needed to boot-up the Observable */);
  }

  /**
   * Launch audience selector panel popup.
   * @returns { Promise<void> }
   */
  private async displayAudienceSelectorPopup(): Promise<void> {
    await firstValueFrom(
      this.popup.create(ComposerAudienceSelectorPanelComponent).present()
    );
  }

  /**
   * Displays a dialog if there are any unsaved change
   */
  canDeactivate(): boolean | Promise<boolean> {
    if (
      this.service.message$.getValue() ||
      this.service.attachments$.getValue()
    ) {
      const confirmation = confirm(
        this.service.isMovingContent$.getValue()
          ? `Are you sure? The existing text will be moved into the blog editor.`
          : `Discard changes?`
      );

      this.service.isMovingContent$.next(false);

      return confirmation;
    }

    return true;
  }

  /**
   * Detect async changes
   */
  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
