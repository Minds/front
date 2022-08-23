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
} from '@angular/core';
import { ComposerService } from '../../services/composer.service';
import { isPlatformBrowser } from '@angular/common';
import { AutocompleteSuggestionsService } from '../../../suggestions/services/autocomplete-suggestions.service';

/**
 * Composer message and title components.
 */
@Component({
  selector: 'm-composer__textArea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'text-area.component.html',
})
export class TextAreaComponent implements AfterViewInit {
  /**
   * Textarea input ID. Used for external label.
   */
  @Input() inputId: string = '';

  /**
   * Compact mode
   */
  @Input() compactMode: boolean = false;

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

  /**
   * Constructor
   * @param service
   * @param platformId
   */
  constructor(
    protected service: ComposerService,
    @Inject(PLATFORM_ID) protected platformId: Object,
    public suggestions: AutocompleteSuggestionsService
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
   * Attachment subject from service
   */
  get attachment$() {
    return this.service.attachments$;
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
