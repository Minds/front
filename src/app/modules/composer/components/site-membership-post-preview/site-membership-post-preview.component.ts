import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ComposerService,
  PaywallThumbnail,
} from '../../services/composer.service';
import {
  Observable,
  Subscription,
  combineLatest,
  map,
  startWith,
  tap,
} from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Allows users to configure a preview for a paywalled site membership
 * post. Preview consists of title (required) and thumbnail (optional).
 *
 * Shown when the user clicks 'next' after composing a
 * site membership post.
 */
@Component({
  selector: 'm-composer__siteMembershipPostPreview',
  templateUrl: 'site-membership-post-preview.component.html',
  styleUrls: ['./site-membership-post-preview.component.ng.scss'],
})
export class ComposerSiteMembershipPostPreview implements OnInit, OnDestroy {
  @Input() isModal: boolean;

  /**
   * On Post event emitter
   */
  @Output('onPost') onPostEmitter: EventEmitter<MouseEvent> = new EventEmitter<
    MouseEvent
  >();

  postPreviewForm: FormGroup;

  filePreviewUrl: SafeResourceUrl;

  // File object to be passed to payload
  paywallThumbnail: PaywallThumbnail;

  // Whether "Post" button should be disabled
  isPostButtonDisabled$: Observable<boolean>;

  subscriptions: Subscription[] = [];

  /**
   * Compact mode if size is compact and NOT in a modal.
   * @returns { Observable<boolean> } - holds true if compact mode should be applied.
   */
  get isCompactMode$(): Observable<boolean> {
    return this.service.size$.pipe(
      map(size => size === 'compact' && !this.isModal)
    );
  }

  constructor(
    public service: ComposerService,
    private formBuilder: FormBuilder,
    private domSanitizer: DomSanitizer
  ) {
    // Initialize the form group with form controls
    this.postPreviewForm = this.formBuilder.group({
      title: [null, Validators.required], // Title is required
      thumbnail: [null], // Thumbnail is optional
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.service.title$.subscribe(title => {
        this.initializeTitle(title);
      }),
      this.service.richEmbedTitle$.subscribe(richEmbedTitle => {
        this.initializeTitle(richEmbedTitle);
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  initializeTitle(initialTitle) {
    this.postPreviewForm.get('title').setValue(initialTitle);
  }

  /**
   * Emits post event
   * @param $event
   */
  onSubmit($event: MouseEvent): void {
    if (this.postPreviewForm.valid) {
      this.service.title$.next(this.postPreviewForm.get('title').value);

      if (this.paywallThumbnail) {
        this.service.paywallThumbnail$.next(this.paywallThumbnail);
      } else {
        this.service.paywallThumbnail$.next(null);
      }

      this.onPostEmitter.emit($event);
    }
  }

  /**
   * Handle file input for thumbnail and convert it to base64
   */
  async onFileSelect(event: File | Event): Promise<void> {
    let file: File | null = null;

    if (event instanceof File) {
      // Direct file from drag-and-drop
      file = event;
    } else if (
      event.target &&
      event.target instanceof HTMLInputElement &&
      event.target.files
    ) {
      // File input change event
      file = event.target.files[0];
    }

    if (file) {
      this.filePreviewUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
        URL.createObjectURL(file)
      );

      const fileBase64: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });

      this.paywallThumbnail = {
        url: URL.createObjectURL(file),
        file: file,
        fileBase64,
      };
    } else {
      console.warn('No file selected or event not recognized.');
    }
  }

  removeFile(e: MouseEvent): void {
    e.stopPropagation();
    this.filePreviewUrl = null;
    this.paywallThumbnail = null;
  }
}
