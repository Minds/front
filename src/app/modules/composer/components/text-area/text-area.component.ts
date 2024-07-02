import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
  PLATFORM_ID,
  ViewChild,
  HostListener,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ComposerService } from '../../services/composer.service';
import { isPlatformBrowser } from '@angular/common';
import { AutocompleteSuggestionsService } from '../../../suggestions/services/autocomplete-suggestions.service';
import { ComposerBoostService } from '../../services/boost.service';
import { Observable, Subscription, map } from 'rxjs';
import { isFirefox } from '../../../../helpers/is-firefox';

/** Placeholder text for text input. */
export const DEFAULT_PLACEHOLDER_TEXT: string = 'Speak your mind...';

/** Placeholder text for when in boost mode. */
export const BOOST_PLACEHOLDER_TEXT: string =
  'Advertising is as simple as creating a post and filling this with text and image content.\n\nOnce you’re happy with your post, click Post and launch your very own ad campaign! Get views, increase your reach, and even link people out to another site.';

/**
 * Composer message and title components.
 */
@Component({
  selector: 'm-composer__textArea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'text-area.component.html',
})
export class TextAreaComponent implements AfterViewInit, OnDestroy {
  /**
   * Textarea input ID. Used for external label.
   */
  @Input() inputId: string = '';

  /**
   * Compact mode
   */
  @Input() compactMode: boolean = false;

  /**
   * Whether this component is within a composer modal.
   */
  @Input() isModal: boolean = false;

  /**
   * Emits pasted file
   */
  @Output()
  filePaste: EventEmitter<File> = new EventEmitter<File>();

  /**
   * Temporary storage for title to avoid re-writing it in case of removing it by mistake.
   */
  titleCache: string = '';

  /**
   * Title input DOM element
   */
  @ViewChild('titleInput')
  titleInput: ElementRef<HTMLInputElement>;

  /**
   * Message textarea DOM element
   */
  @ViewChild('messageInput')
  messageInput: ElementRef<HTMLTextAreaElement>;

  /** Placeholder text for input. */
  protected textAreaPlaceholderText$: Observable<string> =
    this.composerBoostService.isBoostMode$.pipe(
      map((isBoostMode: boolean): string => {
        /**
         * Firefox does not correctly report placeholder text as being part of scrollHeight.
         * This makes our auto-resize functionality break when using multi-line placeholders.
         * https://bugzilla.mozilla.org/show_bug.cgi?id=1239595
         */
        if (isPlatformBrowser(this.platformId) && isFirefox()) {
          return DEFAULT_PLACEHOLDER_TEXT;
        }
        return isBoostMode && this.isModal
          ? BOOST_PLACEHOLDER_TEXT
          : DEFAULT_PLACEHOLDER_TEXT;
      })
    );

  /** Subscription to whether we are in boost mode. */
  private boostModeSubscription: Subscription;

  /**
   * Constructor
   * @param service
   * @param platformId
   */
  constructor(
    protected service: ComposerService,
    @Inject(PLATFORM_ID) protected platformId: Object,
    public suggestions: AutocompleteSuggestionsService,
    private composerBoostService: ComposerBoostService
  ) {}

  /**
   * Message subject from service
   */
  get message$() {
    return this.service.message$;
  }

  /**
   * Title subject from service
   */
  get title$() {
    return this.service.title$;
  }

  /**
   * Is posting flag from the service
   */
  get isPosting$() {
    return this.service.isPosting$;
  }

  ngAfterViewInit(): void {
    if (this.message$ && isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.resizeMessageHeight(), 100);
    }

    // Re-calculate height as Boost mode changes due to placeholder size shift.
    if (isPlatformBrowser(this.platformId) && !isFirefox()) {
      this.boostModeSubscription =
        this.composerBoostService.isBoostMode$.subscribe(
          (isBoostMode: boolean): void => {
            setTimeout(() => this.resizeMessageHeight(), 0); // Push to back of event queue.
          }
        );
    }
  }

  ngOnDestroy(): void {
    this.boostModeSubscription?.unsubscribe();
  }

  /**
   * Focuses the message input. Due to browser constraints it needs a time. Only on browser.
   */
  focus() {
    if (this.messageInput.nativeElement && isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.messageInput.nativeElement.focus(), 100);
    }
  }

  /**
   * Emits the message to the service
   * @param message
   */
  onMessageChange(message: string) {
    this.service.message$.next(message);
  }

  /**
   * Emits the title to the service
   * @param title
   */
  onTitleChange(title: string) {
    this.service.title$.next(title);
  }

  /**
   * Toggles the title on/off. Caches the current one before deleting.
   */
  toggleTitle() {
    const currentTitle = this.service.title$.getValue();

    if (currentTitle !== null) {
      this.titleCache = currentTitle;
      this.service.title$.next(null);
    } else {
      this.service.title$.next(this.titleCache || '');

      if (this.titleInput.nativeElement && isPlatformBrowser(this.platformId)) {
        setTimeout(() => this.titleInput.nativeElement.focus(), 100);
      }
    }
  }

  // Re-calculate height/width when window resizes
  @HostListener('window:resize', ['$resizeEvent'])
  onResize(resizeEvent) {
    this.resizeMessageHeight();
  }

  resizeMessageHeight(): void {
    const textareaEl = this.messageInput.nativeElement;
    textareaEl.style.height = 'auto';
    textareaEl.style.height = `${textareaEl.scrollHeight}px`;
  }

  /**
   * sets message input text selection
   * @param input textarea reference
   */
  setSelection(input) {
    if (input.selectionStart || input.selectionStart == '0') {
      this.service.selection$.next({
        start: input.selectionStart,
        end: input.selectionEnd,
      });
    }
  }
}
