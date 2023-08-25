import {
  Component,
  ElementRef,
  forwardRef,
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
  map,
  share,
  switchMap,
} from 'rxjs/operators';
import { ApiService } from '../../../api/api.service';
import { ConfigsService } from '../../../services/configs.service';
import { MindsUser } from '../../../../interfaces/entities';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { FastFadeAnimation } from '../../../../animations';
import videojs from 'video.js';
import log = videojs.log;

/**
 * Type-ahead search response from server.
 */
export type UserSearchResponse = { status: string; entities: MindsUser[] };

export const FORM_INPUT_AUTOCOMPLETE_USER_INPUT_VALUE_ACCESSOR: any = {
  useExisting: forwardRef(() => AutocompleteUserInputComponent),
  multi: true,
};

/**
 * To be used when you want to autocomplete the username in a form
 * This component will return the username as its form value, but will also emit other user
 * metadata via the outputs listed below
 */
@Component({
  selector: 'm-formInput__autocompleteUserInput',
  templateUrl: './autocomplete-user-input.component.html',
  styleUrls: ['./autocomplete-user-input.component.ng.scss'],
  // providers: [FORM_INPUT_AUTOCOMPLETE_USER_INPUT_VALUE_ACCESSOR],
  animations: [FastFadeAnimation],
})
export class AutocompleteUserInputComponent implements ControlValueAccessor {
  /**
   * Placeholder of the input (optional)
   */
  @Input() placeholder: string;
  @Input() allowEmpty: boolean = false;

  /**
   * The username, current value of input
   */
  username$$: ReplaySubject<string> = new ReplaySubject();

  /**
   * Type-ahead matches from server.
   */
  matchedUsersList$: Observable<MindsUser[]> = this.username$$.pipe(
    // Wait until the is a valid username value
    filter(username => !!username),
    // debounce request to throttle server requests
    debounceTime(100),
    // if there is no change, do nothing.
    distinctUntilChanged(),
    // replace outputted observable with the result of a server call for matches.
    switchMap(searchTerm => {
      this.inProgress$$.next(true);
      return this.api.get(`api/v2/search/suggest/user`, {
        q: searchTerm,
        limit: 8,
        hydrate: 1,
      });
    }),
    // on error.
    catchError(e => {
      console.error(e);
      return of([]);
    }),
    map((apiResponse: UserSearchResponse) => {
      this.inProgress$$.next(false);
      return apiResponse.entities;
    }),
    share()
  );

  /**
   * Shows the loader or not
   */
  inProgress$$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * If the input is focused or not. The determines if the popout will show
   */
  isFocused$$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * If the input is dirty
   */
  isTouched = false;

  /**
   * Determines if the the popup should be showed
   */
  showPopout$: Observable<boolean> = combineLatest([
    this.matchedUsersList$,
    this.inProgress$$,
    this.isFocused$$,
  ]).pipe(
    //take(1),
    // map new value of observable.
    map(([users, inProgress, isFocused]) => {
      return isFocused && (users.length > 0 || inProgress);
    })
  );

  /**
   * Matches popout - note this will be destroyed when there are no matches.
   * Subscriptions will have to be set-up again on change and you should make sure that it exists before using.
   */
  @ViewChild('matchesPopout') matchesPopout: ElementRef;

  @ViewChild('input', { static: true }) inputElRef: ElementRef;

  /**
   * The subscription to the username.
   */
  usernameSubscription: Subscription;

  /**
   * CDN url
   */
  readonly cdnUrl: string;

  constructor(
    @Self() private control: NgControl,
    private api: ApiService,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
    this.control.valueAccessor = this;
  }

  ngOnInit() {
    /**
     * This subscription emits out the username to the form parent
     */
    console.log('allowEmpty', this.allowEmpty);
    this.usernameSubscription = this.username$$
      .pipe(filter(username => this.allowEmpty || !!username))
      .subscribe(username => this.propagateChange(username));
  }

  ngOnDestroy() {
    this.usernameSubscription.unsubscribe();
  }

  get isInvalid() {
    return this.control.invalid;
  }

  /**
   * Emits the username, will trigger rxjs flow
   * @param username
   */
  setUsername(username: string) {
    this.username$$.next(username);
  }

  /**
   * @inheritDoc
   */
  writeValue(value: any): void {
    this.setUsername(value);
  }

  /**
   * The value of this function is set from the
   * registerOnChange function. We have a default value
   * that doesn't do anything.
   */
  propagateChange = (_: any) => {};

  /**
   * @inheritDoc
   * The function provides the callback function that we will call to
   * tell the parent form that the value has changed
   */
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  /**
   * The value of this function is set from registerOnTouched.
   * The default value doesn't do anything.
   */
  propagateTouched = () => {};

  /**
   * @inheritDoc
   */
  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }

  /**
   * On match select, populate the targetUser$ in service and
   * update class level username$$ subject.
   * @param { MindsUser } match - selected match.
   * @returns { void }
   */
  onUserSelect(user: MindsUser): void {
    this.username$$.next(user.username);
  }

  /**
   * Mark the input as focused
   * @param e
   */
  onInputFocus(e: InputEvent) {
    this.isFocused$$.next(true);
  }

  /**
   * Delay the isFocused event or else we dont reject our
   * mouse event for selecting the user
   * @param e
   */
  onInputBlur(e: InputEvent) {
    setTimeout(() => this.isFocused$$.next(false), 300);
    this.propagateTouched();
  }
}
