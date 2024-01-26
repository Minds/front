import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  Self,
  ViewChild,
} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  ReplaySubject,
  Subscription,
} from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  share,
  switchMap,
} from 'rxjs/operators';
import { ApiService } from '../../../api/api.service';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { FastFadeAnimation } from '../../../../animations';

/** Type-ahead search response from server. */
export type EntitySearchResponse = { status: string; entities: any[] };

/** Auto-complete entity type enum. */
export enum AutoCompleteEntityTypeEnum {
  User,
  Group,
}

/** Autocomplete entity. */
export type AutoCompleteEntity = {
  name?: string;
  username?: string;
};

/**
 * Auto-complete component for entities. Will return the selected entity object to a FormControl.
 */
@Component({
  selector: 'm-formInput__autocompleteEntityInput',
  templateUrl: './autocomplete-entity-input.component.html',
  styleUrls: ['./autocomplete-entity-input.component.ng.scss'],
  animations: [FastFadeAnimation],
})
export class AutocompleteEntityInputComponent implements ControlValueAccessor {
  /** Enum of auto-complete entity types for use in template. */
  public readonly AutoCompleteEntityTypeEnum: typeof AutoCompleteEntityTypeEnum = AutoCompleteEntityTypeEnum;

  /** Placeholder of the input (optional). */
  @Input() placeholder: string = '';

  /** Whether empty state is allowed (optional). */
  @Input() allowEmpty: boolean = false;

  /** Limit of users to return. */
  @Input() limit: number = 8;

  /** If true, resets the input field after a selection is made */
  @Input() clearAfterSelection: boolean = false;

  /** Array of guids to exclude from the popout list of matched entities */
  @Input() excludeGuids: string[] = [];

  /** Entity type to search for. */
  @Input() entityType: AutoCompleteEntityTypeEnum =
    AutoCompleteEntityTypeEnum.Group;

  /** Either entity object OR string identifier, depending what we get back from the input. */
  entityRef$: ReplaySubject<AutoCompleteEntity | string> = new ReplaySubject();

  /** Type-ahead matches from server. */
  matchedEntitiesList$: Observable<AutoCompleteEntity[]> = this.entityRef$.pipe(
    // debounce request to throttle server requests
    debounceTime(100),
    // if there is no change, do nothing.
    distinctUntilChanged(),
    // replace outputted observable with the result of a server call for matches or an empty array.
    switchMap(entityRef => {
      // Check if the entityRef is a non-empty string
      if (typeof entityRef === 'string' && entityRef.trim().length > 0) {
        this.inProgress$.next(true);
        return this.api
          .get(
            `api/v2/search/suggest/${
              this.entityType === AutoCompleteEntityTypeEnum.Group
                ? 'group'
                : 'user'
            }`,
            {
              q: entityRef,
              limit: this.limit,
              hydrate: 1,
            }
          )
          .pipe(
            // on success.
            map((apiResponse: any) => {
              // Filter out the entities that are in the excludeGuid array
              return apiResponse.entities.filter(
                entity => !this.excludeGuids.includes(entity.guid)
              );
            }),
            // on error.
            catchError(e => {
              console.error(e);
              return of([]);
            }),
            // Always turn off the loader.
            finalize(() => this.inProgress$.next(false))
          );
      } else {
        // If entityRef is not a non-empty string, clear the list
        return of([]);
      }
    }),
    share()
  );

  /** Shows the loader or not. */
  inProgress$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /** If the input is focused or not. The determines if the popout will show. */
  isFocused$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /** If the input is dirty. */
  isTouched = false;

  /** Determines if the the popup should be shown. */
  showPopout$: Observable<boolean> = combineLatest([
    this.matchedEntitiesList$,
    this.inProgress$,
    this.isFocused$,
  ]).pipe(
    // map new value of observable.
    map(([entities, inProgress, isFocused]) => {
      return isFocused && (entities.length > 0 || inProgress);
    })
  );

  inputDisplayValue$: Observable<string> = this.entityRef$.pipe(
    map(entityRef => {
      if (typeof entityRef === 'object') {
        return this.entityType === AutoCompleteEntityTypeEnum.Group
          ? entityRef.name
          : entityRef.username;
      }
      return entityRef ?? '';
    })
  );

  /**
   * Matches popout - note this will be destroyed when there are no matches.
   * Subscriptions will have to be set-up again on change and you should make sure that it exists before using.
   */
  @ViewChild('matchesPopout') matchesPopout: ElementRef;

  @ViewChild('input', { static: true }) inputElRef: ElementRef;

  /** The subscription to the entityRef. */
  entityRefSubscription: Subscription;

  constructor(
    @Self() private control: NgControl,
    private api: ApiService,
    private cd: ChangeDetectorRef
  ) {
    this.control.valueAccessor = this;
  }

  ngOnInit() {
    /** This subscription emits out the entity to the form parent */
    this.entityRefSubscription = this.entityRef$
      .pipe(filter(entityRef => this.allowEmpty || Boolean(entityRef)))
      .subscribe(entityRef => {
        this.propagateChange(entityRef);
      });
  }

  ngOnDestroy() {
    this.entityRefSubscription?.unsubscribe();
  }

  /**
   * Whether this control is invalid.
   * @returns { boolean } - true if this control is invalid.
   */
  get isInvalid(): boolean {
    return this.control.invalid;
  }

  /**
   * Emits the entityRef, will trigger rxjs flow.
   * @param { AutoCompleteEntity|string } entityRef - reference to the entity
   * either an identifier or the entity itself.
   */
  public setEntityRef(entityRef: AutoCompleteEntity | string) {
    this.entityRef$.next(entityRef);
  }

  /**
   * @inheritDoc
   */
  public writeValue(value: AutoCompleteEntity | string): void {
    this.setEntityRef(value);
  }

  /**
   * The value of this function is set from the
   * registerOnChange function. We have a default value
   * that doesn't do anything.
   */
  public propagateChange = (_: any) => {};

  /**
   * @inheritDoc
   * The function provides the callback function that we will call to
   * tell the parent form that the value has changed.
   */
  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  /**
   * The value of this function is set from registerOnTouched.
   * The default value doesn't do anything.
   */
  public propagateTouched = () => {};

  /**
   * @inheritDoc
   */
  public registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }

  /**
   * On match select, update entityRef with entity.
   * @param { AutoCompleteEntity|string } entity - selected entity.
   * @returns { void }
   */
  public onEntitySelect(entity: AutoCompleteEntity | string): void {
    this.entityRef$.next(entity);
    this.propagateChange(entity);

    if (this.clearAfterSelection) {
      this.entityRef$.next(''); // Reset the internal state
    }
  }
  /**
   * Mark the input as focused
   * @param { InputEvent } e - input event.
   */
  public onInputFocus(e: InputEvent) {
    this.isFocused$.next(true);
  }

  /**
   * Delay the isFocused event or else we dont reject our
   * mouse event for selecting the user.
   * @param { InputEvent } e - input event.
   */
  public onInputBlur(e: InputEvent) {
    setTimeout(() => this.isFocused$.next(false), 300);
    this.propagateTouched();
  }
}
