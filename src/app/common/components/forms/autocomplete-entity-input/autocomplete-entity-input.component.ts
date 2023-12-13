import { Component, ElementRef, Input, Self, ViewChild } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  firstValueFrom,
  from,
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
  @Input() placeholder: string;

  /** Whether empty state is allowed (optional). */
  @Input() allowEmpty: boolean = false;

  /** Limit of users to return. */
  @Input() limit: number = 8;

  /** Entity type to search for. */
  @Input() entityType: AutoCompleteEntityTypeEnum =
    AutoCompleteEntityTypeEnum.Group;

  /** Either entity object OR string identifier, depending what we get back from the input. */
  entityRef$: ReplaySubject<AutoCompleteEntity | string> = new ReplaySubject();

  /** Type-ahead matches from server. */
  matchedEntitiesList$: Observable<AutoCompleteEntity[]> = this.entityRef$.pipe(
    // Wait until the is a valid entityRef
    filter(entityRef => Boolean(entityRef)),
    // debounce request to throttle server requests
    debounceTime(100),
    // if there is no change, do nothing.
    distinctUntilChanged(),
    // replace outputted observable with the result of a server call for matches.
    switchMap(searchTerm => {
      this.inProgress$.next(true);
      return this.api.get(
        `api/v2/search/suggest/${
          this.entityType === AutoCompleteEntityTypeEnum.Group
            ? 'group'
            : 'user'
        }`,
        {
          q: searchTerm,
          limit: this.limit,
          hydrate: 1,
        }
      );
    }),
    // on error.
    catchError(e => {
      console.error(e);
      return of([]);
    }),
    map((apiResponse: any) => {
      this.inProgress$.next(false);
      return apiResponse.entities;
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

  /**
   * Matches popout - note this will be destroyed when there are no matches.
   * Subscriptions will have to be set-up again on change and you should make sure that it exists before using.
   */
  @ViewChild('matchesPopout') matchesPopout: ElementRef;

  @ViewChild('input', { static: true }) inputElRef: ElementRef;

  /** The subscription to the entityRef. */
  entityRefSubscription: Subscription;

  constructor(@Self() private control: NgControl, private api: ApiService) {
    this.control.valueAccessor = this;
  }

  ngOnInit() {
    /** This subscription emits out the entity to the form parent */
    this.entityRefSubscription = this.entityRef$
      .pipe(
        filter(entityRef => this.allowEmpty || Boolean(entityRef)),
        switchMap(
          (
            entityRef: AutoCompleteEntity | string
          ): Observable<AutoCompleteEntity> => {
            // if we have a string identifier, use that to grab the entity from the matches list.
            return typeof entityRef === 'string'
              ? from(this.getEntityFromMatchesByIdentifier(entityRef))
              : of(entityRef);
          }
        )
      )
      .subscribe(entity => {
        this.propagateChange(entity);
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

  /**
   * Gets entity from matches list by identifier.
   * @param { string } identifier - identifier of entity to get.
   * @returns { Promise<AutoCompleteEntity> } - entity.
   */
  private async getEntityFromMatchesByIdentifier(
    identifier: string
  ): Promise<AutoCompleteEntity> {
    const matchedEntities: AutoCompleteEntity[] =
      (await firstValueFrom(this.matchedEntitiesList$)) ?? [];

    return (
      matchedEntities.find(e => {
        return this.entityType === AutoCompleteEntityTypeEnum.Group
          ? e.name.toLowerCase() === identifier.toLowerCase()
          : e.username.toLowerCase() === identifier.toLowerCase();
      }) ?? null
    );
  }
}
