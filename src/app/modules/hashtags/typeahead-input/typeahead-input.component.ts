import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { SuggestedService } from '../service/suggested.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { MruService } from '../service/mru.service';

/**
 * Text input component that provides a list of
 * autocompleted relevant hashtags as the user types
 */
@Component({
  selector: 'm-hashtags__typeaheadInput',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'typeahead-input.component.html',
})
export class TypeaheadInputComponent implements OnInit {
  /**
   * Disabled state
   */
  @Input() disabled: boolean = false;

  /**
   * Input placeholder
   */
  @Input() placeholder: string = '';

  /**
   * Input ID
   */
  @Input() inputId: string = '';

  /**
   * Maximum entries to show
   */
  @Input() maxEntries: number = 500;

  /**
   * MRU history cache key
   */
  @Input() historyKey: string = 'default';

  /**
   * Action event emitter
   */
  @Output('onAction') onActionEmitter: EventEmitter<string> =
    new EventEmitter<string>();

  /**
   * Current tag
   */
  tag: string = '';

  /**
   * MRU (most recently used) tags list
   */
  recent: string[] = [];

  /**
   * Is the suggestions dropdown shown?
   */
  isDropdownShown: boolean = false;

  /**
   * Subject for suggestions queries
   */
  readonly typeaheadQuery$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  /**
   * Subject for in progress state while fetching suggestions
   */
  readonly typeaheadInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * Observable for suggestions array
   */
  readonly suggestions$: Observable<string[]>;

  /**
   * Are we showing recent (so we show the header)
   */
  get isShowingSuggestions(): boolean {
    return Boolean(this.tag);
  }

  /**
   * Constructor. Initializes suggestions Observable pipe
   * @param suggested
   * @param mru
   */
  constructor(
    protected suggested: SuggestedService,
    protected mru: MruService
  ) {
    this.suggestions$ = this.typeaheadQuery$.pipe(
      distinctUntilChanged(),
      tap(() => {
        this.typeaheadInProgress$.next(true);
      }),
      debounceTime(100),
      this.suggested.lookupOr(() => this.recent),
      map((suggestions) => suggestions.slice(0, this.maxEntries)),
      tap(() => {
        this.typeaheadInProgress$.next(false);
      })
    );
  }

  /**
   * Initialization. Resets component and fetches MRU items.
   */
  ngOnInit(): void {
    this.reset();
  }

  /**
   * Sets the current tag
   * @param tag
   */
  setTag(tag: string): void {
    this.tag = tag || '';
    this.typeaheadQuery$.next(this.sanitizeTag(this.tag));
  }

  /**
   * Triggers the action, if there's a tag set. Will not close dropdown if input was kept on focus. That's just determined by the parameters
   */
  triggerAction(wasInputKeptOnFocus?: boolean): void {
    if (this.tag) {
      this.onActionEmitter.emit(this.sanitizeTag(this.tag));
    }

    if (!wasInputKeptOnFocus) {
      this.hideDropdown();
    }
  }

  /**
   * Sets a suggestion as the current tag and triggers the action
   * @param tag
   */
  useSuggestion(tag: string): void {
    this.setTag(this.sanitizeTag(tag));
    this.triggerAction();
  }

  /**
   * Resets the control to its initial state
   */
  reset(): void {
    this.fetchMRUItems();
    this.setTag('');
  }

  /**
   * Show dropdown (on focus)
   */
  showDropdown(): void {
    this.isDropdownShown = true;
  }

  /**
   * Hide dropdown (on blur)
   */
  hideDropdown(): void {
    this.isDropdownShown = false;
  }

  /**
   * Clears MRU tags on its service and re-read
   */
  clearMRU(): void {
    this.mru.reset(this.historyKey);
    this.reset();
  }

  /**
   * Pushes MRU tags to its service and re-read
   * @param tags
   */
  pushMRUItems(tags: string[]): void {
    this.mru.push(this.historyKey, tags);
    this.fetchMRUItems();
  }

  /**
   * Fetches latest MRU items
   */
  fetchMRUItems(): void {
    this.recent = this.mru.fetch(this.historyKey);
  }

  /**
   * On clicks outside the component, hide dropdown
   */
  @HostListener('document:click') onHostDocumentClick(): void {
    this.hideDropdown();
  }

  /**
   * Stop click bubbling when clicking inside the component to keep modal open
   * @param $event
   */
  @HostListener('click', ['$event']) onHostClick($event: MouseEvent): void {
    $event.stopPropagation();
  }

  /**
   * Sanitizes a hashtag value (no pound or non-alphanumeric symbols)
   * @param value
   */
  protected sanitizeTag(value: string): string {
    return value.replace(/[^\w]/g, '');
  }
}
